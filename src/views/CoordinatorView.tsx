import { useEffect, useMemo, useState } from 'react';
import { ItemRow, LoadingState, LocationTag, StatusBadge } from '../components/ui';
import {
  getActiveCompanyId,
  getCompanies,
  getLocations,
  getTransferOrderLines,
  getTransferOrders,
  setActiveCompany,
  type Company,
  type Location,
  type TransferOrder,
  type TransferOrderLine,
} from '../services';
import NewTransferWizard from './NewTransferWizard';

type StatusFilter = 'All' | TransferOrder['status'];

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(value: string): string {
  if (!value) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (m) {
    const [, y, mo, da] = m;
    return `${MONTH_SHORT[parseInt(mo, 10) - 1]} ${parseInt(da, 10)}, ${y}`;
  }
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return `${MONTH_SHORT[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function todayYMD(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function isOverdue(order: TransferOrder): boolean {
  if (order.status !== 'In Transit') return false;
  if (!order.receiptDate) return false;
  return order.receiptDate.slice(0, 10) < todayYMD();
}

// ── styles ────────────────────────────────────────────────────────────────────
const pageStyle: React.CSSProperties = {
  padding: '24px 32px',
  background: '#ffffff',
  color: '#111827',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  maxWidth: 1100,
  margin: '0 auto',
  width: '100%',
  boxSizing: 'border-box',
};

const cardStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  padding: 16,
  flex: 1,
  minWidth: 100,
};

const cardNumberStyle: React.CSSProperties = { fontSize: 28, fontWeight: 600, lineHeight: 1.1 };
const cardLabelStyle: React.CSSProperties = { fontSize: 12, color: '#6b7280', marginTop: 4 };

const selectStyle: React.CSSProperties = {
  padding: '6px 10px',
  border: '1px solid #d1d5db',
  borderRadius: 6,
  fontSize: 14,
  background: '#ffffff',
  cursor: 'pointer',
};

const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse' };
const thStyle: React.CSSProperties = {
  background: '#f9fafb',
  fontSize: 12,
  fontWeight: 600,
  color: '#6b7280',
  textTransform: 'uppercase',
  padding: '10px 12px',
  textAlign: 'left',
  borderBottom: '2px solid #e5e7eb',
};
const tdStyle: React.CSSProperties = {
  padding: 12,
  borderBottom: '1px solid #f3f4f6',
  fontSize: 14,
  color: '#111827',
  verticalAlign: 'middle',
};

const overduePillStyle: React.CSSProperties = {
  display: 'inline-block',
  background: '#fee2e2',
  color: '#991b1b',
  fontSize: 11,
  fontWeight: 600,
  padding: '2px 8px',
  borderRadius: 9999,
};

// ── component ─────────────────────────────────────────────────────────────────
export default function CoordinatorView() {
  const [orders, setOrders] = useState<TransferOrder[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [locationFilter, setLocationFilter] = useState<string>('All');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [expandedLines, setExpandedLines] = useState<Record<string, TransferOrderLine[]>>({});
  const [hoverRowId, setHoverRowId] = useState<string | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(null), 3000);
    return () => clearTimeout(t);
  }, [toastMessage]);

  const onOrderCreated = (newOrder: TransferOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    setToastMessage(`Transfer order ${newOrder.no} created successfully`);
  };

  const load = () => {
    setLoading(true);
    setError(null);
    let alive = true;
    (async () => {
      // Resolve companies first so all subsequent queries are scoped to the
      // chosen company (defaults to the stored selection, else the first one).
      const cos = await getCompanies();
      const active = getActiveCompanyId();
      const sel = cos.find((c) => c.id === active)?.id ?? cos[0]?.id ?? '';
      if (sel) setActiveCompany(sel);
      const [o, l] = await Promise.all([getTransferOrders(), getLocations()]);
      if (!alive) return;
      setCompanies(cos);
      setSelectedCompanyId(sel);
      setOrders(o);
      setLocations(l);
    })()
      .catch((e: unknown) => {
        if (!alive) return;
        setError(e instanceof Error ? e.message : String(e));
      })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  };

  const onCompanyChange = (companyId: string) => {
    setActiveCompany(companyId);
    setSelectedCompanyId(companyId);
    // Clear any expanded rows since their lines belong to the previous company.
    setExpandedOrderId(null);
    setExpandedLines({});
    load();
  };

  useEffect(() => load(), []);

  const locByCode = useMemo(() => {
    const m = new Map<string, string>();
    for (const l of locations) m.set(l.code, l.name);
    return m;
  }, [locations]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== 'All' && o.status !== statusFilter) return false;
      if (locationFilter !== 'All' && o.fromLocationCode !== locationFilter && o.toLocationCode !== locationFilter) return false;
      return true;
    });
  }, [orders, statusFilter, locationFilter]);

  const counts = useMemo(() => ({
    total: orders.length,
    open: orders.filter((o) => o.status === 'Open').length,
    transit: orders.filter((o) => o.status === 'In Transit').length,
    received: orders.filter((o) => o.status === 'Received').length,
  }), [orders]);

  const onRowClick = (orderId: string) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      return;
    }
    setExpandedOrderId(orderId);
    if (!expandedLines[orderId]) {
      getTransferOrderLines(orderId)
        .then((lines) => setExpandedLines((prev) => ({ ...prev, [orderId]: lines })))
        .catch((e: unknown) => {
          const msg = e instanceof Error ? e.message : String(e);
          // Mark with an empty array so the panel renders "No line items found".
          // Per-row errors aren't part of the spec; surface to console.
          console.error(`Failed to load lines for ${orderId}: ${msg}`);
          setExpandedLines((prev) => ({ ...prev, [orderId]: [] }));
        });
    }
  };

  // ── error / loading shells ──
  if (error) {
    return (
      <main style={pageStyle}>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ color: '#991b1b', fontSize: 16, marginBottom: 16 }}>Failed to load transfer orders</div>
          <div style={{ color: '#6b7280', fontSize: 13, marginBottom: 16 }}>{error}</div>
          <button
            type="button"
            onClick={load}
            style={{
              padding: '8px 18px',
              fontSize: 14,
              border: '1px solid #d1d5db',
              borderRadius: 6,
              background: '#ffffff',
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main style={pageStyle}>
        <h1 style={{ fontSize: 24, fontWeight: 500, color: '#111827', marginBottom: 4, marginTop: 0 }}>Transfer Order Manager</h1>
        <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 24, marginTop: 0 }}>All locations — live overview</p>
        <LoadingState message="Loading transfer orders…" />
      </main>
    );
  }

  // ── main render ──
  return (
    <main style={pageStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 500, color: '#111827', margin: '0 0 4px' }}>Transfer Order Manager</h1>
          <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>All locations — live overview</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {companies.length > 0 && (
            <select
              aria-label="Company"
              style={selectStyle}
              value={selectedCompanyId}
              onChange={(e) => onCompanyChange(e.target.value)}
            >
              {companies.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}
          <button
            type="button"
            onClick={() => setShowWizard(true)}
            style={{
              background: '#1d4ed8', color: '#ffffff',
              padding: '8px 18px', borderRadius: 6,
              fontSize: 14, fontWeight: 500,
              border: 'none', cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            New transfer order
          </button>
        </div>
      </div>

      {/* Summary strip */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <div style={cardStyle}>
          <div style={cardNumberStyle}>{counts.total}</div>
          <div style={cardLabelStyle}>Total orders</div>
        </div>
        <div style={cardStyle}>
          <div style={{ ...cardNumberStyle, color: '#1e40af' }}>{counts.open}</div>
          <div style={cardLabelStyle}>Open</div>
        </div>
        <div style={cardStyle}>
          <div style={{ ...cardNumberStyle, color: '#92400e' }}>{counts.transit}</div>
          <div style={cardLabelStyle}>In Transit</div>
        </div>
        <div style={cardStyle}>
          <div style={{ ...cardNumberStyle, color: '#065f46' }}>{counts.received}</div>
          <div style={cardLabelStyle}>Received</div>
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
        <select
          aria-label="Filter by status"
          style={selectStyle}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
        >
          <option value="All">All statuses</option>
          <option value="Open">Open</option>
          <option value="In Transit">In Transit</option>
          <option value="Received">Received</option>
        </select>
        <select
          aria-label="Filter by location"
          style={selectStyle}
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        >
          <option value="All">All locations</option>
          {locations.map((l) => (
            <option key={l.code} value={l.code}>{l.name}</option>
          ))}
        </select>
        <span style={{ fontSize: 13, color: '#6b7280', marginLeft: 'auto' }}>
          Showing {filteredOrders.length} of {orders.length} orders
        </span>
      </div>

      {/* Table */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Order No.</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>From</th>
            <th style={thStyle}>To</th>
            <th style={thStyle}>Shipment Date</th>
            <th style={thStyle}>Receipt Date</th>
            <th style={{ ...thStyle, textAlign: 'center' }}>Lines</th>
            <th style={thStyle}>Overdue</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length === 0 ? (
            <tr>
              <td colSpan={8} style={{ ...tdStyle, textAlign: 'center', color: '#6b7280' }}>
                No transfer orders match the current filters.
              </td>
            </tr>
          ) : (
            filteredOrders.map((o) => {
              const expanded = expandedOrderId === o.id;
              const lines = expandedLines[o.id];
              const hovered = hoverRowId === o.id;
              return (
                <FragmentRow
                  key={o.id}
                  order={o}
                  expanded={expanded}
                  lines={lines}
                  hovered={hovered}
                  fromName={locByCode.get(o.fromLocationCode) ?? o.fromLocationCode}
                  toName={locByCode.get(o.toLocationCode) ?? o.toLocationCode}
                  onClick={() => onRowClick(o.id)}
                  onHoverEnter={() => setHoverRowId(o.id)}
                  onHoverLeave={() => setHoverRowId(null)}
                />
              );
            })
          )}
        </tbody>
      </table>

      {showWizard && (
        <NewTransferWizard
          locations={locations}
          onClose={() => setShowWizard(false)}
          onCreated={onOrderCreated}
        />
      )}

      {toastMessage && (
        <div
          role="status"
          style={{
            position: 'fixed', bottom: 24, right: 24, zIndex: 100,
            background: '#059669', color: '#ffffff',
            padding: '12px 20px', borderRadius: 8,
            fontSize: 14, fontWeight: 500,
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          }}
        >
          {toastMessage}
        </div>
      )}
    </main>
  );
}

// ── row + expansion (separated to keep the main return readable) ──────────────
interface FragmentRowProps {
  order: TransferOrder;
  expanded: boolean;
  lines: TransferOrderLine[] | undefined;
  hovered: boolean;
  fromName: string;
  toName: string;
  onClick: () => void;
  onHoverEnter: () => void;
  onHoverLeave: () => void;
}

function FragmentRow({ order, expanded, lines, hovered, fromName, toName, onClick, onHoverEnter, onHoverLeave }: FragmentRowProps) {
  const trStyle: React.CSSProperties = {
    background: hovered ? '#f9fafb' : undefined,
    cursor: 'pointer',
  };
  const overdue = isOverdue(order);
  return (
    <>
      <tr style={trStyle} onClick={onClick} onMouseEnter={onHoverEnter} onMouseLeave={onHoverLeave}>
        <td style={{ ...tdStyle, fontWeight: 500, fontFamily: 'ui-monospace, Menlo, Monaco, monospace' }}>{order.no}</td>
        <td style={tdStyle}><StatusBadge status={order.status} /></td>
        <td style={tdStyle}><LocationTag name={fromName} direction="from" /></td>
        <td style={tdStyle}><LocationTag name={toName} direction="to" /></td>
        <td style={tdStyle}>{formatDate(order.shipmentDate)}</td>
        <td style={tdStyle}>{formatDate(order.receiptDate)}</td>
        <td style={{ ...tdStyle, textAlign: 'center', color: '#6b7280' }}>{order.lineCount}</td>
        <td style={tdStyle}>{overdue ? <span style={overduePillStyle}>Overdue</span> : null}</td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={8} style={{ padding: '0 12px 16px', background: '#fafafa', borderBottom: '1px solid #f3f4f6' }}>
            {lines === undefined ? (
              <LoadingState message="Loading line items…" />
            ) : lines.length === 0 ? (
              <div style={{ color: '#6b7280', padding: '16px 0' }}>No line items found</div>
            ) : (
              <div style={{ padding: '8px 0' }}>
                {lines.map((l) => (
                  <ItemRow
                    key={l.id}
                    itemNo={l.itemNo}
                    description={l.description}
                    quantity={l.quantity}
                    unit={l.unit}
                    received={l.qtyReceived}
                  />
                ))}
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  );
}
