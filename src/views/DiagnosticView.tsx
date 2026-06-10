import { useEffect, useState } from 'react';
import { Dynamics365BusinessCentralService } from '../generated';

interface NamedThing { Name?: string; DisplayName?: string }
interface CompanyLite { Id?: string; Name?: string; DisplayName?: string }
interface EnvLite { Name?: string; UrlKey?: string; DisplayableKey?: string }

interface DatasetResult {
  dataset: string;
  datasetDisplay?: string;
  status: 'pending' | 'done' | 'error';
  tables?: NamedThing[];
  procedures?: NamedThing[];
  tablesError?: string;
  proceduresError?: string;
}

type Step =
  | 'init'
  | 'envs' | 'envs-done'
  | 'companies' | 'companies-done'
  | 'datasets' | 'datasets-done'
  | 'per-dataset' | 'finished' | 'errored';

interface DiscoveryState {
  step: Step;
  currentCall?: string;
  envs?: EnvLite[];
  companies?: CompanyLite[];
  datasets?: { Name?: string; DisplayName?: string }[];
  selectedEnv?: string;
  selectedCompanyId?: string;
  selectedCompanyName?: string;
  perDataset: DatasetResult[];
  errors: { step: string; message: string }[];
}

const TRANSFER_KEYWORDS = ['transfer', 'shipment', 'receipt', 'inventory', 'location', 'item'];
const CALL_TIMEOUT_MS = 15000;

function isTransfery(name?: string, display?: string) {
  const n = (name ?? '').toLowerCase();
  const d = (display ?? '').toLowerCase();
  return TRANSFER_KEYWORDS.some((k) => n.includes(k) || d.includes(k));
}

function errToString(e: unknown): string {
  if (!e) return 'unknown';
  if (typeof e === 'string') return e;
  if (typeof e === 'object') {
    const o = e as Record<string, unknown>;
    if (typeof o.message === 'string') return o.message;
    try { return JSON.stringify(e); } catch { return String(e); }
  }
  return String(e);
}

function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, rej) => setTimeout(() => rej(new Error(`TIMEOUT after ${ms}ms in ${label}`)), ms)),
  ]);
}

const pageStyle: React.CSSProperties = {
  padding: '20px 32px', background: '#ffffff', color: '#111827',
  fontFamily: 'system-ui, -apple-system, sans-serif', maxWidth: 900, margin: '0 auto',
};
const sectionStyle: React.CSSProperties = { marginTop: 20, paddingTop: 12, borderTop: '1px solid #e5e7eb' };
const codeStyle: React.CSSProperties = {
  fontFamily: 'ui-monospace, Menlo, Monaco, monospace',
  fontSize: 12, background: '#f9fafb', padding: '2px 6px', borderRadius: 4,
};
const matchStyle: React.CSSProperties = { background: '#fef3c7', fontWeight: 600 };
const dotStyle = (color: string): React.CSSProperties => ({
  display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: color, marginRight: 6,
});

export default function DiagnosticView() {
  const [state, setState] = useState<DiscoveryState>({ step: 'init', perDataset: [], errors: [] });

  useEffect(() => {
    let alive = true;
    const update = (patch: Partial<DiscoveryState>) => {
      if (!alive) return;
      setState((s) => ({ ...s, ...patch }));
    };

    (async () => {
      // ── 1. Environments
      update({ step: 'envs', currentCall: 'GetEnvironmentsV3()' });
      const envErrors: DiscoveryState['errors'] = [];
      let envs: EnvLite[] = [];
      let selectedEnv: string | undefined;
      try {
        const r = await withTimeout(Dynamics365BusinessCentralService.GetEnvironmentsV3(), CALL_TIMEOUT_MS, 'GetEnvironmentsV3');
        if (!r.success) envErrors.push({ step: 'GetEnvironmentsV3', message: errToString(r.error) });
        else {
          envs = r.data?.value ?? [];
          selectedEnv = envs[0]?.UrlKey ?? envs[0]?.Name;
        }
      } catch (e) { envErrors.push({ step: 'GetEnvironmentsV3', message: errToString(e) }); }
      update({ step: 'envs-done', envs, selectedEnv, errors: envErrors });

      if (!selectedEnv) { update({ step: 'errored', currentCall: undefined }); return; }

      // ── 2. Companies
      update({ step: 'companies', currentCall: 'GetCompaniesV3(env)' });
      let companies: CompanyLite[] = [];
      let selectedCompanyId: string | undefined;
      let selectedCompanyName: string | undefined;
      try {
        const r = await withTimeout(Dynamics365BusinessCentralService.GetCompaniesV3(selectedEnv), CALL_TIMEOUT_MS, 'GetCompaniesV3');
        if (!r.success) envErrors.push({ step: 'GetCompaniesV3', message: errToString(r.error) });
        else {
          companies = r.data?.value ?? [];
          selectedCompanyId = companies[0]?.Id;
          selectedCompanyName = companies[0]?.Name;
        }
      } catch (e) { envErrors.push({ step: 'GetCompaniesV3', message: errToString(e) }); }
      update({ step: 'companies-done', companies, selectedCompanyId, selectedCompanyName, errors: [...envErrors] });

      // ── 3. Datasets
      update({ step: 'datasets', currentCall: 'GetDataSetsV3(env)' });
      let datasets: { Name?: string; DisplayName?: string }[] = [];
      try {
        const r = await withTimeout(Dynamics365BusinessCentralService.GetDataSetsV3(selectedEnv), CALL_TIMEOUT_MS, 'GetDataSetsV3');
        if (!r.success) envErrors.push({ step: 'GetDataSetsV3', message: errToString(r.error) });
        else datasets = r.data?.value ?? [];
      } catch (e) { envErrors.push({ step: 'GetDataSetsV3', message: errToString(e) }); }
      update({ step: 'datasets-done', datasets, errors: [...envErrors] });

      // ── 4. Per-dataset tables + procedures (PARALLEL with priority order)
      update({ step: 'per-dataset', currentCall: 'parallel fan-out' });
      // Seed perDataset with pending entries so user sees them all immediately
      const seeded: DatasetResult[] = datasets
        .filter((d) => !!d.Name)
        .map((d) => ({ dataset: d.Name as string, datasetDisplay: d.DisplayName, status: 'pending' as const }));
      // Priority: v2.0 first (OOTB BC API), then intercompany, then everything else
      const priority = (n: string) => (n === 'v2.0' ? 0 : n.includes('intercompany') ? 1 : 2);
      seeded.sort((a, b) => priority(a.dataset) - priority(b.dataset));
      update({ perDataset: seeded });

      await Promise.all(
        seeded.map(async (entry) => {
          const dsName = entry.dataset;
          try {
            const tr = await withTimeout(
              Dynamics365BusinessCentralService.GetTablesV3(selectedEnv, dsName),
              CALL_TIMEOUT_MS, `GetTablesV3(${dsName})`
            );
            if (tr.success) entry.tables = tr.data?.value ?? [];
            else entry.tablesError = errToString(tr.error);
          } catch (e) { entry.tablesError = errToString(e); }

          if (selectedCompanyId) {
            try {
              const pr = await withTimeout(
                Dynamics365BusinessCentralService.GetProceduresV3(selectedEnv, selectedCompanyId, dsName),
                CALL_TIMEOUT_MS, `GetProceduresV3(${dsName})`
              );
              if (pr.success) entry.procedures = pr.data?.value ?? [];
              else entry.proceduresError = errToString(pr.error);
            } catch (e) { entry.proceduresError = errToString(e); }
          }
          entry.status = entry.tablesError && entry.proceduresError ? 'error' : 'done';
          // Force re-render after each dataset finishes
          setState((s) => ({
            ...s,
            perDataset: s.perDataset.map((d) => (d.dataset === dsName ? { ...entry } : d)),
          }));
        }),
      );
      update({ step: 'finished', currentCall: undefined });
    })();

    return () => { alive = false; };
  }, []);

  const totalMatches = state.perDataset.reduce((acc, r) => acc
    + (r.tables ?? []).filter((t) => isTransfery(t.Name, t.DisplayName)).length
    + (r.procedures ?? []).filter((p) => isTransfery(p.Name, p.DisplayName)).length, 0);

  const stepColor: Record<Step, string> = {
    'init': '#9ca3af', 'envs': '#92400e', 'envs-done': '#065f46',
    'companies': '#92400e', 'companies-done': '#065f46',
    'datasets': '#92400e', 'datasets-done': '#065f46',
    'per-dataset': '#92400e', 'finished': '#065f46', 'errored': '#991b1b',
  };

  return (
    <main style={pageStyle}>
      <h1 style={{ fontSize: 22, margin: 0 }}>BC Connector Diagnostic v3 (progressive)</h1>
      <p style={{ color: '#4b5563', marginTop: 4, fontSize: 13 }}>
        Updates state after every call. Per-call timeout {CALL_TIMEOUT_MS / 1000}s.
        Highlight = matched on transfer/shipment/receipt/inventory/location/item.
      </p>

      <section style={sectionStyle}>
        <h2 style={{ fontSize: 15, margin: 0 }}>Progress</h2>
        <div style={{ marginTop: 6, fontSize: 13 }}>
          <span style={dotStyle(stepColor[state.step])} />
          <strong>Step:</strong> <span style={codeStyle}>{state.step}</span>
          {state.currentCall && <> · in flight: <span style={codeStyle}>{state.currentCall}</span></>}
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ fontSize: 15, margin: 0 }}>Selected</h2>
        <pre style={{ ...codeStyle, padding: 10, marginTop: 8 }}>
{`Env (UrlKey):  ${state.selectedEnv ?? '(none)'}
Company.Id:    ${state.selectedCompanyId ?? '(none)'}
Company.Name:  ${state.selectedCompanyName ?? '(none)'}
Datasets:      ${state.datasets?.length ?? 0}
Total matches: ${totalMatches}`}
        </pre>
      </section>

      {state.errors.length > 0 && (
        <section style={sectionStyle}>
          <h2 style={{ fontSize: 15, margin: 0, color: '#991b1b' }}>Top-level errors</h2>
          <ul>{state.errors.map((e, i) => (
            <li key={i}><span style={codeStyle}>{e.step}</span>: {e.message}</li>
          ))}</ul>
        </section>
      )}

      <section style={sectionStyle}>
        <h2 style={{ fontSize: 15, margin: 0 }}>Datasets (API routes)</h2>
        {(!state.datasets || state.datasets.length === 0) && <p style={{ color: '#6b7280', fontSize: 13 }}>(none yet)</p>}
        <ul>{(state.datasets ?? []).map((d, i) => (
          <li key={i}><span style={codeStyle}>{d.Name}</span> {d.DisplayName && `— ${d.DisplayName}`}</li>
        ))}</ul>
      </section>

      {state.perDataset.map((ds, idx) => {
        const matchedTables = (ds.tables ?? []).filter((t) => isTransfery(t.Name, t.DisplayName));
        const matchedProcs = (ds.procedures ?? []).filter((p) => isTransfery(p.Name, p.DisplayName));
        const highlight = matchedTables.length + matchedProcs.length > 0;
        return (
          <section key={idx} style={{ ...sectionStyle, background: highlight ? '#fffbeb' : undefined, padding: highlight ? 12 : undefined }}>
            <h2 style={{ fontSize: 16, margin: 0 }}>
              <span style={dotStyle(ds.status === 'pending' ? '#f59e0b' : ds.status === 'error' ? '#991b1b' : '#065f46')} />
              Dataset: <span style={codeStyle}>{ds.dataset}</span>
              {ds.datasetDisplay && ds.datasetDisplay !== ds.dataset ? ` — ${ds.datasetDisplay}` : ''}
            </h2>

            <h3 style={{ fontSize: 13, marginTop: 10 }}>
              Tables ({ds.tables?.length ?? 0}{ds.tablesError ? `, ERROR` : ''}, matched: {matchedTables.length})
            </h3>
            {ds.tablesError && <div style={{ color: '#991b1b', fontSize: 12 }}>{ds.tablesError}</div>}
            {matchedTables.length > 0 && (
              <ul>{matchedTables.map((t, i) => (
                <li key={i} style={matchStyle}>
                  <span style={codeStyle}>{t.Name}</span>
                  {t.DisplayName && t.DisplayName !== t.Name ? ` — ${t.DisplayName}` : ''}
                </li>
              ))}</ul>
            )}
            {ds.tables && ds.tables.length > 0 && (
              <details>
                <summary style={{ cursor: 'pointer', color: '#1e40af', fontSize: 12 }}>Show all {ds.tables.length} tables</summary>
                <ul>{ds.tables.map((t, i) => (
                  <li key={i} style={isTransfery(t.Name, t.DisplayName) ? matchStyle : undefined}>
                    <span style={codeStyle}>{t.Name}</span>
                    {t.DisplayName && t.DisplayName !== t.Name ? ` — ${t.DisplayName}` : ''}
                  </li>
                ))}</ul>
              </details>
            )}

            <h3 style={{ fontSize: 13, marginTop: 10 }}>
              Procedures ({ds.procedures?.length ?? 0}{ds.proceduresError ? `, ERROR` : ''}, matched: {matchedProcs.length})
            </h3>
            {ds.proceduresError && <div style={{ color: '#991b1b', fontSize: 12 }}>{ds.proceduresError}</div>}
            {matchedProcs.length > 0 && (
              <ul>{matchedProcs.map((p, i) => (
                <li key={i} style={matchStyle}>
                  <span style={codeStyle}>{p.Name}</span>
                  {p.DisplayName && p.DisplayName !== p.Name ? ` — ${p.DisplayName}` : ''}
                </li>
              ))}</ul>
            )}
            {ds.procedures && ds.procedures.length > 0 && (
              <details>
                <summary style={{ cursor: 'pointer', color: '#1e40af', fontSize: 12 }}>Show all {ds.procedures.length} procedures</summary>
                <ul>{ds.procedures.map((p, i) => (
                  <li key={i} style={isTransfery(p.Name, p.DisplayName) ? matchStyle : undefined}>
                    <span style={codeStyle}>{p.Name}</span>
                    {p.DisplayName && p.DisplayName !== p.Name ? ` — ${p.DisplayName}` : ''}
                  </li>
                ))}</ul>
              </details>
            )}
          </section>
        );
      })}
    </main>
  );
}
