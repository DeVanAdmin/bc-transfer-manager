import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { LoadingState, LocationTag, StatusBadge } from '../components/ui';
import {
  getLocations,
  getTransferOrderLines,
  getTransferOrders,
  postReceipt,
  postShipment,
  type Location,
  type TransferOrder,
  type TransferOrderLine,
} from '../services';

type DetailMode = 'receive' | 'ship' | 'view';

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(value: string): string {
  if (!value) return '—';
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (m) {
    const [, y, mo, da] = m;
    return `${MONTH_SHORT[parseInt(mo, 10) - 1]} ${parseInt(da, 10)}, ${y}`;
  }
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return `${MONTH_SHORT[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

const MODE_CONFIG: Record<DetailMode, { backTo: string; backLabel: string; accent: string; accentHover: string }> = {
  receive: { backTo: '/destination', backLabel: '← Back to inbound transfers', accent: '#059669', accentHover: '#047857' },
  ship: { backTo: '/origin', backLabel: '← Back to outbound transfers', accent: '#1d4ed8', accentHover: '#1e40af' },
  view: { backTo: '/coordinator', backLabel: '← Back to orders', accent: '#1d4ed8', accentHover: '#1e40af' },
};

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

const backButtonStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: '#1d4ed8',
  fontSize: 14,
  cursor: 'pointer',
  padding: 0,
  marginBottom: 16,
};

const cardStyle: React.CSSProperties = {
  background: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: 10,
  padding: 20,
  marginBottom: 24,
};

const sectionLabelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: 12,
};

const cancelButtonStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #d1d5db',
  color: '#374151',
  padding: '8px 20px',
  borderRadius: 6,
  fontSize: 14,
  fontWeight: 500,
  cursor: 'pointer',
};

const inputStyle = (state: 'ok' | 'short' | 'zero'): React.CSSProperties => ({
  width: 70,
  padding: '4px 8px',
  border: `1px solid ${state === 'zero' ? '#ef4444' : state === 'short' ? '#f59e0b' : '#d1d5db'}`,
  borderRadius: 4,
  fontSize: 14,
  outline: 'none',
});

const arrowStyle: React.CSSProperties = { color: '#9ca3af', fontSize: 16 };

// ── component ────────────────────────────────────────────────────────────────
export default function TransferOrderDetail({ mode }: { mode: DetailMode }) {
  const { orderId = '' } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const passedOrder = (location.state as { order?: TransferOrder } | null)?.order;
  const cfg = MODE_CONFIG[mode];

  const [order, setOrder] = useState<TransferOrder | null>(passedOrder ?? null);
  const [lines, setLines] = useState<TransferOrderLine[] | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [receiptQuantities, setReceiptQuantities] = useState<Record<string, number>>({});
  const [confirming, setConfirming] = useState(false);
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    (async () => {
      const [locs, lns, ord] = await Promise.all([
        getLocations(),
        getTransferOrderLines(orderId),
        passedOrder ? Promise.resolve(passedOrder) : getTransferOrders().then((all) => all.find((o) => o.id === orderId) ?? null),
      ]);
      if (!alive) return;
      setLocations(locs);
      setLines(lns);
      setOrder(ord);
      setReceiptQuantities((prev) => {
        const next = { ...prev };
        for (const l of lns) if (next[l.id] === undefined) next[l.id] = l.quantity;
        return next;
      });
    })()
      .catch((e: unknown) => { if (alive) setError(e instanceof Error ? e.message : String(e)); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [orderId, passedOrder]);

  const locByCode = useMemo(() => {
    const m = new Map<string, string>();
    for (const l of locations) m.set(l.code, l.name);
    return m;
  }, [locations]);

  const onQtyChange = (lineId: string, raw: string, max: number) => {
    if (raw === '') {
      setReceiptQuantities((prev) => ({ ...prev, [lineId]: 0 }));
      return;
    }
    const n = Number(raw);
    if (isNaN(n)) return;
    setReceiptQuantities((prev) => ({ ...prev, [lineId]: Math.max(0, Math.min(max, Math.floor(n))) }));
  };

  const onConfirm = async () => {
    if (!order) return;
    setPosting(true);
    setPostError(null);
    try {
      if (mode === 'receive') {
        const lns = lines ?? [];
        await postReceipt(order.id, lns.map((l) => ({ lineNo: l.lineNo, qtyReceived: receiptQuantities[l.id] ?? l.quantity })));
      } else if (mode === 'ship') {
        await postShipment(order.id);
      }
      navigate(cfg.backTo);
    } catch (e) {
      setPostError(e instanceof Error ? e.message : String(e));
    } finally {
      setPosting(false);
    }
  };

  const back = (
    <button type="button" style={backButtonStyle} onClick={() => navigate(cfg.backTo)}>
      {cfg.backLabel}
    </button>
  );

  if (loading) {
    return <main style={pageStyle}>{back}<LoadingState message="Loading transfer order…" /></main>;
  }
  if (error) {
    return (
      <main style={pageStyle}>{back}
        <div style={{ color: '#991b1b', padding: 12, background: '#fef2f2', borderRadius: 6 }}>{error}</div>
      </main>
    );
  }
  if (!order) {
    return (
      <main style={pageStyle}>{back}
        <div style={{ color: '#6b7280', padding: '40px 0', textAlign: 'center' }}>Transfer order not found.</div>
      </main>
    );
  }

  const canReceive = mode === 'receive' && order.status === 'In Transit';
  const canShip = mode === 'ship' && order.status === 'Open';
  const showAction = canReceive || canShip;
  const discrepancyCount = (lines ?? []).reduce(
    (acc, l) => acc + ((receiptQuantities[l.id] ?? l.quantity) !== l.quantity ? 1 : 0),
    0,
  );
  const primaryButtonStyle: React.CSSProperties = {
    background: cfg.accent, color: '#ffffff', padding: '8px 20px', borderRadius: 6,
    fontSize: 14, fontWeight: 500, border: 'none', cursor: 'pointer',
  };

  return (
    <main style={pageStyle}>
      {back}

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
        <h1 style={{ fontFamily: 'ui-monospace, Menlo, Monaco, monospace', fontSize: 24, fontWeight: 600, margin: 0 }}>
          {order.no}
        </h1>
        <StatusBadge status={order.status} />
      </div>

      {/* Header summary */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <LocationTag name={locByCode.get(order.fromLocationCode) ?? order.fromLocationCode} direction="from" />
          <span style={arrowStyle}>→</span>
          <LocationTag name={locByCode.get(order.toLocationCode) ?? order.toLocationCode} direction="to" />
        </div>
        <div style={{ fontSize: 13, color: '#6b7280', marginTop: 12 }}>
          Shipment: <span style={{ color: '#374151' }}>{formatDate(order.shipmentDate)}</span>
          {'   ·   '}
          Receipt: <span style={{ color: '#374151' }}>{formatDate(order.receiptDate)}</span>
        </div>
      </div>

      {/* Lines */}
      <div style={sectionLabelStyle}>{canReceive ? 'Confirm quantities received' : 'Line items'}</div>
      {lines === null ? (
        <LoadingState message="Loading line items…" />
      ) : lines.length === 0 ? (
        <div style={{ color: '#6b7280', padding: '16px 0' }}>No line items found</div>
      ) : (
        lines.map((l) => {
          const entered = receiptQuantities[l.id] ?? l.quantity;
          const state: 'ok' | 'short' | 'zero' = entered === 0 ? 'zero' : entered < l.quantity ? 'short' : 'ok';
          return (
            <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'ui-monospace, Menlo, Monaco, monospace', fontSize: 12, color: '#6b7280' }}>{l.itemNo}</div>
                <div style={{ fontSize: 14, color: '#111827', marginTop: 2 }}>{l.description}</div>
              </div>
              <div style={{ fontSize: 13, color: '#6b7280', whiteSpace: 'nowrap' }}>
                {canReceive ? 'Expected' : 'Qty'}: {l.quantity} {l.unit}
              </div>
              {canReceive ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <label style={{ fontSize: 12, color: '#6b7280' }} htmlFor={`qty-${l.id}`}>Received:</label>
                  <input
                    id={`qty-${l.id}`}
                    type="number"
                    min={0}
                    max={l.quantity}
                    value={entered}
                    onChange={(e) => onQtyChange(l.id, e.target.value, l.quantity)}
                    style={inputStyle(state)}
                  />
                </div>
              ) : l.qtyReceived > 0 ? (
                <div style={{ fontSize: 13, color: '#374151', whiteSpace: 'nowrap' }}>Received: {l.qtyReceived}</div>
              ) : null}
            </div>
          );
        })
      )}

      {/* Action */}
      {showAction && lines && (
        <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #f3f4f6' }}>
          {canReceive && discrepancyCount > 0 && (
            <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 6, padding: '10px 14px', marginBottom: 12, fontSize: 13, color: '#92400e' }}>
              ⚠ {discrepancyCount} line(s) with quantity discrepancies. These will be recorded in BC.
            </div>
          )}
          {confirming && canShip && (
            <div style={{ fontSize: 14, color: '#111827', marginBottom: 12 }}>
              Confirm shipment of <strong>{order.no}</strong> to{' '}
              <strong>{locByCode.get(order.toLocationCode) ?? order.toLocationCode}</strong>?
            </div>
          )}
          {postError && <div style={{ color: '#991b1b', fontSize: 13, marginBottom: 12 }}>{postError}</div>}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            {!confirming ? (
              <button type="button" style={primaryButtonStyle} onClick={() => setConfirming(true)}>
                {canReceive ? 'Confirm receipt' : 'Confirm shipment'}
              </button>
            ) : (
              <>
                <button type="button" style={cancelButtonStyle} onClick={() => setConfirming(false)} disabled={posting}>
                  Cancel
                </button>
                <button
                  type="button"
                  style={{ ...primaryButtonStyle, opacity: posting ? 0.7 : 1, cursor: posting ? 'wait' : 'pointer' }}
                  onClick={onConfirm}
                  disabled={posting}
                >
                  {posting ? 'Posting…' : postError ? 'Try again' : canReceive ? 'Yes, post receipt' : 'Yes, ship it'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
