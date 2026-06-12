import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingState, LocationTag, StatusBadge } from '../components/ui';
import {
  getLocations,
  getTransferOrders,
  type Location,
  type TransferOrder,
} from '../services';

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

// ── styles ───────────────────────────────────────────────────────────────────
const pageStyle: React.CSSProperties = {
  padding: '24px 32px',
  background: '#ffffff',
  color: '#111827',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  maxWidth: 900,
  margin: '0 auto',
  width: '100%',
  boxSizing: 'border-box',
};

const selectorBarStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '10px 12px',
  background: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  marginBottom: 24,
};

const selectStyle: React.CSSProperties = {
  padding: '6px 10px',
  border: '1px solid #d1d5db',
  borderRadius: 6,
  fontSize: 14,
  background: '#ffffff',
  cursor: 'pointer',
};

const sectionLabelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: 12,
};

const arrowStyle: React.CSSProperties = { color: '#9ca3af', fontSize: 16 };

// ── main component ───────────────────────────────────────────────────────────
export default function DestinationView() {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [orders, setOrders] = useState<TransferOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);

  // Load locations once for the dropdown
  useEffect(() => {
    let alive = true;
    getLocations()
      .then((l) => { if (alive) setLocations(l); })
      .catch((e: unknown) => { if (alive) setError(e instanceof Error ? e.message : String(e)); });
    return () => { alive = false; };
  }, []);

  // Re-fetch on location change
  useEffect(() => {
    if (!selectedLocation) {
      setOrders([]);
      return;
    }
    let alive = true;
    setLoading(true);
    setError(null);
    Promise.all([getTransferOrders(), getLocations()])
      .then(([o, l]) => {
        if (!alive) return;
        setOrders(o);
        setLocations(l);
      })
      .catch((e: unknown) => {
        if (!alive) return;
        setError(e instanceof Error ? e.message : String(e));
      })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [selectedLocation]);

  const locByCode = useMemo(() => {
    const m = new Map<string, string>();
    for (const l of locations) m.set(l.code, l.name);
    return m;
  }, [locations]);

  const toHere = useMemo(
    () => orders.filter((o) => o.toLocationCode === selectedLocation),
    [orders, selectedLocation],
  );
  const inbound = useMemo(() => toHere.filter((o) => o.status === 'In Transit'), [toHere]);
  const received = useMemo(() => toHere.filter((o) => o.status === 'Received'), [toHere]);

  const openOrder = (order: TransferOrder) => {
    navigate(`/destination/orders/${encodeURIComponent(order.id)}`, { state: { order } });
  };

  const renderCard = (order: TransferOrder, action: string) => {
    const hovered = hoverId === order.id;
    return (
      <div
        key={order.id}
        role="button"
        tabIndex={0}
        onClick={() => openOrder(order)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openOrder(order); } }}
        onMouseEnter={() => setHoverId(order.id)}
        onMouseLeave={() => setHoverId(null)}
        style={{
          background: '#ffffff',
          border: `1px solid ${hovered ? '#1d4ed8' : '#e5e7eb'}`,
          borderRadius: 10,
          padding: 16,
          marginBottom: 12,
          boxShadow: hovered ? '0 2px 8px rgba(29,78,216,0.10)' : '0 1px 3px rgba(0,0,0,0.06)',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: 'ui-monospace, Menlo, Monaco, monospace', fontSize: 15, fontWeight: 600, color: '#111827' }}>
            {order.no}
          </span>
          <StatusBadge status={order.status} />
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginTop: 8, flexWrap: 'wrap' }}>
          <LocationTag name={locByCode.get(order.fromLocationCode) ?? order.fromLocationCode} direction="from" />
          <span style={arrowStyle}>→</span>
          <LocationTag name={locByCode.get(order.toLocationCode) ?? order.toLocationCode} direction="to" />
          <span style={{ marginLeft: 'auto', fontSize: 12, color: '#6b7280' }}>
            {order.status === 'Received' ? 'Received' : 'Expected'}:{' '}
            <span style={{ color: '#374151' }}>{formatDate(order.receiptDate)}</span>
          </span>
        </div>
        <div style={{ marginTop: 10, fontSize: 13, color: hovered ? '#1d4ed8' : '#6b7280', textAlign: 'right' }}>
          {action} →
        </div>
      </div>
    );
  };

  return (
    <main style={pageStyle}>
      <div style={selectorBarStyle}>
        <label htmlFor="dest-loc" style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>
          Your warehouse:
        </label>
        <select
          id="dest-loc"
          style={selectStyle}
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          <option value="">Select your warehouse...</option>
          {locations.map((l) => (
            <option key={l.code} value={l.code}>{l.name}</option>
          ))}
        </select>
      </div>

      {!selectedLocation ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', fontSize: 14, color: '#6b7280' }}>
          Select your warehouse above to see inbound transfers
        </div>
      ) : (
        <>
          <header style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 22, fontWeight: 500, color: '#111827', margin: 0 }}>Destination Warehouse</h1>
            <p style={{ fontSize: 14, color: '#6b7280', margin: '4px 0 0' }}>
              {(locByCode.get(selectedLocation) ?? selectedLocation)} — inbound transfers
            </p>
          </header>

          {error && (
            <div style={{ color: '#991b1b', padding: 12, background: '#fef2f2', borderRadius: 6, marginBottom: 16 }}>
              {error}
            </div>
          )}

          {loading ? (
            <LoadingState message="Loading transfer orders…" />
          ) : (
            <>
              <div style={sectionLabelStyle}>Inbound</div>
              {inbound.length === 0 ? (
                <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 16 }}>
                  No inbound transfers for this location
                </div>
              ) : (
                inbound.map((o) => renderCard(o, 'Receive'))
              )}

              <div style={{ ...sectionLabelStyle, marginTop: 32 }}>Received</div>
              {received.length === 0 ? (
                <div style={{ fontSize: 14, color: '#6b7280' }}>
                  No completed receipts yet
                </div>
              ) : (
                received.map((o) => renderCard(o, 'View'))
              )}
            </>
          )}
        </>
      )}
    </main>
  );
}
