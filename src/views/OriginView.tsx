import { useEffect, useMemo, useState } from 'react';
import { ItemRow, LoadingState, LocationTag, StatusBadge } from '../components/ui';
import {
  getLocations,
  getTransferOrderLines,
  getTransferOrders,
  postShipment,
  type Location,
  type TransferOrder,
  type TransferOrderLine,
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

function todayYMD(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
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

const openCardStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: 10,
  padding: 16,
  marginBottom: 12,
  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
};

const shippedCardStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: 10,
  padding: '12px 16px',
  marginBottom: 12,
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  flexWrap: 'wrap',
};

const primaryButtonStyle: React.CSSProperties = {
  background: '#1d4ed8',
  color: '#ffffff',
  padding: '8px 20px',
  borderRadius: 6,
  fontSize: 14,
  fontWeight: 500,
  border: 'none',
  cursor: 'pointer',
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

const showItemsButtonStyle: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid #d1d5db',
  color: '#374151',
  padding: '4px 12px',
  borderRadius: 6,
  fontSize: 13,
  cursor: 'pointer',
};

const arrowStyle: React.CSSProperties = { color: '#9ca3af', fontSize: 16 };

// ── component ────────────────────────────────────────────────────────────────
export default function OriginView() {
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [orders, setOrders] = useState<TransferOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [expandedLines, setExpandedLines] = useState<Record<string, TransferOrderLine[]>>({});
  const [confirmingOrderId, setConfirmingOrderId] = useState<string | null>(null);
  const [postingOrderId, setPostingOrderId] = useState<string | null>(null);
  const [postError, setPostError] = useState<string | null>(null);
  const [hoverButtonId, setHoverButtonId] = useState<string | null>(null);

  // Load locations once for the dropdown
  useEffect(() => {
    let alive = true;
    getLocations()
      .then((l) => { if (alive) setLocations(l); })
      .catch((e: unknown) => { if (alive) setError(e instanceof Error ? e.message : String(e)); });
    return () => { alive = false; };
  }, []);

  // Load orders whenever a location is selected
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

  const today = todayYMD();
  const fromHere = useMemo(
    () => orders.filter((o) => o.fromLocationCode === selectedLocation),
    [orders, selectedLocation],
  );
  const needsAction = useMemo(() => fromHere.filter((o) => o.status === 'Open'), [fromHere]);
  const shipped = useMemo(
    () => fromHere.filter((o) => o.status === 'In Transit' && o.shipmentDate.slice(0, 10) <= today),
    [fromHere, today],
  );

  const onToggleItems = (orderId: string) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      return;
    }
    setExpandedOrderId(orderId);
    if (!expandedLines[orderId]) {
      getTransferOrderLines(orderId)
        .then((lines) => setExpandedLines((prev) => ({ ...prev, [orderId]: lines })))
        .catch((e: unknown) => {
          console.error(`Failed to load lines for ${orderId}:`, e);
          setExpandedLines((prev) => ({ ...prev, [orderId]: [] }));
        });
    }
  };

  const onStartConfirm = (orderId: string) => {
    setConfirmingOrderId(orderId);
    setPostError(null);
  };

  const onCancelConfirm = () => {
    setConfirmingOrderId(null);
    setPostError(null);
  };

  const onConfirmShipment = async (order: TransferOrder) => {
    setPostingOrderId(order.id);
    setPostError(null);
    try {
      await postShipment(order.id);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id ? { ...o, status: 'In Transit', shipmentDate: todayYMD() } : o,
        ),
      );
      setConfirmingOrderId(null);
    } catch (e) {
      setPostError(e instanceof Error ? e.message : String(e));
    } finally {
      setPostingOrderId(null);
    }
  };

  // ── render ──
  return (
    <main style={pageStyle}>
      {/* Location selector */}
      <div style={selectorBarStyle}>
        <label htmlFor="origin-loc" style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>
          Your warehouse:
        </label>
        <select
          id="origin-loc"
          style={selectStyle}
          value={selectedLocation}
          onChange={(e) => {
            setSelectedLocation(e.target.value);
            setExpandedOrderId(null);
            setConfirmingOrderId(null);
            setPostError(null);
          }}
        >
          <option value="">Select your warehouse...</option>
          {locations.map((l) => (
            <option key={l.code} value={l.code}>{l.name}</option>
          ))}
        </select>
      </div>

      {!selectedLocation ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', fontSize: 14, color: '#6b7280' }}>
          Select your warehouse above to see transfer orders
        </div>
      ) : (
        <>
          <header style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 22, fontWeight: 500, color: '#111827', margin: 0 }}>Origin Warehouse</h1>
            <p style={{ fontSize: 14, color: '#6b7280', margin: '4px 0 0' }}>
              {(locByCode.get(selectedLocation) ?? selectedLocation)} — outbound transfers
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
              {/* Needs action */}
              <div style={sectionLabelStyle}>Needs action</div>
              {needsAction.length === 0 ? (
                <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 16 }}>
                  No open transfer orders for this location
                </div>
              ) : (
                needsAction.map((o) => (
                  <OpenOrderCard
                    key={o.id}
                    order={o}
                    fromName={locByCode.get(o.fromLocationCode) ?? o.fromLocationCode}
                    toName={locByCode.get(o.toLocationCode) ?? o.toLocationCode}
                    expanded={expandedOrderId === o.id}
                    lines={expandedLines[o.id]}
                    confirming={confirmingOrderId === o.id}
                    posting={postingOrderId === o.id}
                    postError={confirmingOrderId === o.id ? postError : null}
                    hoverButtonId={hoverButtonId}
                    onToggleItems={() => onToggleItems(o.id)}
                    onStartConfirm={() => onStartConfirm(o.id)}
                    onCancelConfirm={onCancelConfirm}
                    onConfirm={() => onConfirmShipment(o)}
                    onHoverEnter={(id) => setHoverButtonId(id)}
                    onHoverLeave={() => setHoverButtonId(null)}
                  />
                ))
              )}

              {/* Shipped */}
              <div style={{ ...sectionLabelStyle, marginTop: 32 }}>Shipped</div>
              {shipped.length === 0 ? (
                <div style={{ fontSize: 14, color: '#6b7280' }}>
                  No outbound shipments yet
                </div>
              ) : (
                shipped.map((o) => (
                  <ShippedCard
                    key={o.id}
                    order={o}
                    toName={locByCode.get(o.toLocationCode) ?? o.toLocationCode}
                  />
                ))
              )}
            </>
          )}
        </>
      )}
    </main>
  );
}

// ── sub-components ───────────────────────────────────────────────────────────
interface OpenOrderCardProps {
  order: TransferOrder;
  fromName: string;
  toName: string;
  expanded: boolean;
  lines: TransferOrderLine[] | undefined;
  confirming: boolean;
  posting: boolean;
  postError: string | null;
  hoverButtonId: string | null;
  onToggleItems: () => void;
  onStartConfirm: () => void;
  onCancelConfirm: () => void;
  onConfirm: () => void;
  onHoverEnter: (id: string) => void;
  onHoverLeave: () => void;
}

function OpenOrderCard({
  order,
  fromName,
  toName,
  expanded,
  lines,
  confirming,
  posting,
  postError,
  hoverButtonId,
  onToggleItems,
  onStartConfirm,
  onCancelConfirm,
  onConfirm,
  onHoverEnter,
  onHoverLeave,
}: OpenOrderCardProps) {
  const confirmHoverId = `confirm-${order.id}`;
  const yesHoverId = `yes-${order.id}`;
  const confirmStyle: React.CSSProperties = {
    ...primaryButtonStyle,
    background: hoverButtonId === confirmHoverId ? '#1e40af' : '#1d4ed8',
  };
  const yesStyle: React.CSSProperties = {
    ...primaryButtonStyle,
    background: hoverButtonId === yesHoverId ? '#1e40af' : '#1d4ed8',
    opacity: posting ? 0.7 : 1,
    cursor: posting ? 'wait' : 'pointer',
  };

  return (
    <div style={openCardStyle}>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'ui-monospace, Menlo, Monaco, monospace', fontSize: 15, fontWeight: 600, color: '#111827' }}>
          {order.no}
        </span>
        <StatusBadge status={order.status} />
      </div>

      {/* Route row */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginTop: 8, flexWrap: 'wrap' }}>
        <LocationTag name={fromName} direction="from" />
        <span style={arrowStyle}>→</span>
        <LocationTag name={toName} direction="to" />
        <span style={{ marginLeft: 'auto', fontSize: 12, color: '#6b7280' }}>
          Due: <span style={{ color: '#374151' }}>{formatDate(order.receiptDate)}</span>
        </span>
      </div>

      {/* Items toggle */}
      <div style={{ marginTop: 12 }}>
        <button type="button" style={showItemsButtonStyle} onClick={onToggleItems}>
          {expanded ? 'Hide items' : `Show items (${order.lineCount})`}
        </button>
        {expanded && (
          <div style={{ marginTop: 8 }}>
            {lines === undefined ? (
              <LoadingState message="Loading line items…" />
            ) : lines.length === 0 ? (
              <div style={{ color: '#6b7280', padding: '8px 0' }}>No line items found</div>
            ) : (
              lines.map((l) => (
                <ItemRow
                  key={l.id}
                  itemNo={l.itemNo}
                  description={l.description}
                  quantity={l.quantity}
                  unit={l.unit}
                  received={l.qtyReceived}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Action row */}
      <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f3f4f6' }}>
        {!confirming ? (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              style={confirmStyle}
              onClick={onStartConfirm}
              onMouseEnter={() => onHoverEnter(confirmHoverId)}
              onMouseLeave={onHoverLeave}
            >
              Confirm shipment
            </button>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 14, color: '#111827', marginBottom: 12 }}>
              Confirm shipment of <strong>{order.no}</strong> to <strong>{toName}</strong>?
            </div>
            {posting && (
              <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>Posting...</div>
            )}
            {postError && (
              <div style={{ color: '#991b1b', fontSize: 13, marginBottom: 12 }}>
                {postError}
              </div>
            )}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                type="button"
                style={cancelButtonStyle}
                onClick={onCancelConfirm}
                disabled={posting}
              >
                Cancel
              </button>
              <button
                type="button"
                style={yesStyle}
                onClick={onConfirm}
                disabled={posting}
                onMouseEnter={() => onHoverEnter(yesHoverId)}
                onMouseLeave={onHoverLeave}
              >
                {postError ? 'Try again' : 'Yes, ship it'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface ShippedCardProps {
  order: TransferOrder;
  toName: string;
}

function ShippedCard({ order, toName }: ShippedCardProps) {
  return (
    <div style={shippedCardStyle}>
      <span style={{ fontFamily: 'ui-monospace, Menlo, Monaco, monospace', fontSize: 14, fontWeight: 500, color: '#111827' }}>
        {order.no}
      </span>
      <StatusBadge status="In Transit" />
      <LocationTag name={toName} direction="to" />
      <span style={{ marginLeft: 'auto', fontSize: 13, color: '#6b7280' }}>
        Shipped: <span style={{ color: '#374151' }}>{formatDate(order.shipmentDate)}</span>
      </span>
    </div>
  );
}
