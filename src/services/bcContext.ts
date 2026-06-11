import { Dynamics365BusinessCentralService } from '../generated';
import type { Company } from './types';

export interface BCContext {
  env: string;
  companyId: string;
  companyName: string;
}

const BC_API_DATASET = 'v2.0';
const ACTIVE_COMPANY_KEY = 'bctm.activeCompanyId';

let envPromise: Promise<string> | null = null;
let companiesPromise: Promise<Company[]> | null = null;

function loadStoredCompanyId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_COMPANY_KEY);
  } catch {
    return null;
  }
}

let activeCompanyId: string | null = loadStoredCompanyId();

export function getBCDataset(): string {
  return BC_API_DATASET;
}

function resolveEnv(): Promise<string> {
  if (!envPromise) {
    envPromise = (async () => {
      const envRes = await Dynamics365BusinessCentralService.GetEnvironmentsV3();
      if (!envRes.success) throw new Error(`GetEnvironmentsV3 failed: ${envRes.error?.message ?? 'unknown'}`);
      const env = envRes.data?.value?.[0]?.UrlKey ?? envRes.data?.value?.[0]?.Name;
      if (!env) throw new Error('No BC environment found.');
      return env;
    })();
  }
  return envPromise;
}

/** Lists every company in the BC environment (cached for the session). */
export function getCompanies(): Promise<Company[]> {
  if (!companiesPromise) {
    companiesPromise = (async () => {
      const env = await resolveEnv();
      const coRes = await Dynamics365BusinessCentralService.GetCompaniesV3(env);
      if (!coRes.success) throw new Error(`GetCompaniesV3 failed: ${coRes.error?.message ?? 'unknown'}`);
      const companies = (coRes.data?.value ?? [])
        .map((c) => ({ id: c?.Id ?? '', name: c?.DisplayName || c?.Name || c?.Id || '' }))
        .filter((c) => c.id.length > 0);
      if (companies.length === 0) throw new Error('No BC company found.');
      return companies;
    })();
  }
  return companiesPromise;
}

export function getActiveCompanyId(): string | null {
  return activeCompanyId;
}

/** Sets the company every subsequent BC query is scoped to (persisted locally). */
export function setActiveCompany(companyId: string): void {
  activeCompanyId = companyId;
  try {
    localStorage.setItem(ACTIVE_COMPANY_KEY, companyId);
  } catch {
    /* ignore storage failures */
  }
}

export async function getBCContext(): Promise<BCContext> {
  const env = await resolveEnv();
  const companies = await getCompanies();
  // Honor the selected company; fall back to the first one if none is set or
  // the stored selection no longer exists.
  const active = companies.find((c) => c.id === activeCompanyId) ?? companies[0];
  activeCompanyId = active.id;
  return { env, companyId: active.id, companyName: active.name };
}

export function resetBCContext(): void {
  envPromise = null;
  companiesPromise = null;
  activeCompanyId = null;
}
