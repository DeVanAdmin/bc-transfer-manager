import { useEffect, useMemo, useState } from 'react';
import { LoadingState, LocationTag, StatusBadge } from '../components/ui';
import {
  getLocations,
  getTransferOrderLines,
  getTransferOrders,
  postReceipt,
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

const inboundCardStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: 10,
  padding: 16,
  marginBottom: 12,
  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
};

const receivedCardStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  padding: '12px 16px',
  background: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  marginBottom: 8,
  flexWrap: 'wrap',
};

const primaryButtonStyle: React.CSSProperties = {
  background: '#059669',
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

const receiveToggleButtonStyle: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid #d1d5db',
  color: '#374151',
  padding: '6px 14px',
  borderRadius: 6,
  fontSize: 13,
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

// ── main component ───────────────────────────────────────────────────────────
export default function DestinationView() {
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [orders, setOrders] = useState<TransferOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receivingOrderId, setReceivingOrderId] = useState<string | null>(null);
  const [cachedLines, setCachedLines] = useState<Record<string, TransferOrderLine[]>>({});
  const [receiptQuantities, setReceiptQuantities] = useState<Record<string, number>>({});
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

  const onToggleReceive = (orderId: string) => {
    if (receivingOrderId === orderId) {
      setReceivingOrderId(null);
      setConfirmingOrderId(null);
      setPostError(null);
      return;
    }
    setReceivingOrderId(orderId);
    setConfirmingOrderId(null);
    setPostError(null);
    if (!cachedLines[orderId]) {
      getTransferOrderLines(orderId)
        .then((lines) => {
          setCachedLines((prev) => ({ ...prev, [orderId]: lines }));
          setReceiptQuantities((prev) => {
            const next = { ...prev };
            for (const l of lines) {
              if (next[l.id] === undefined) next[l.id] = l.quantity;
            }
            return next;
          });
        })
        .catch((e: unknown) => {
          console.error(`Failed to load lines for ${orderId}:`, e);
          setCachedLines((prev) => ({ ...prev, [orderId]: [] }));
        });
    }
  };

  const onQtyChange = (lineId: string, raw: string, max: number) => {
    if (raw === '') {
      setReceiptQuantities((prev) => ({ ...prev, [lineId]: 0 }));
      return;
    }
    const n = Number(raw);
    if (isNaN(n)) return;
    const clamped = Math.max(0, Math.min(max, Math.floor(n)));
    setReceiptQuantities((prev) => ({ ...prev, [lineId]: clamped }));
  };

  const onStartConfirm = (orderId: string) => {
    setConfirmingOrderId(orderId);
    setPostError(null);
  };

  const onCancelConfirm = () => {
    setConfirmingOrderId(null);
    setPostError(null);
  };

  const onConfirmReceipt = async (order: TransferOrder) => {
    const lines = cachedLines[order.id] ?? [];
    setPostingOrderId(order.id);
    setPostError(null);
    try {
      await postReceipt(
        order.id,
        lines.map((l) => ({ lineNo: l.lineNo, qtyReceived: receiptQuantities[l.id] ?? l.quantity })),
      );
      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id ? { ...o, status: 'Received', receiptDate: todayYMD() } : o,
        ),
      );
      setConfirmingOrderId(null);
      setReceivingOrderId((curr) => (curr === order.id ? null : curr));
    } catch (e) {
      setPostError(e instanceof Error ? e.message : String(e));
    } finally {
      setPostingOrderId(null);
    }
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
          onChange={(e) => {
            setSelectedLocation(e.target.value);
            setReceivingOrderId(null);
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
                inbound.map((o) => (
                  <InboundCard
                    key={o.id}
                    order={o}
                    fromName={locByCode.get(o.fromLocationCode) ?? o.fromLocationCode}
                    toName={locByCode.get(o.toLocationCode) ?? o.toLocationCode}
                    receiving={receivingOrderId === o.id}
                    lines={cachedLines[o.id]}
                    receiptQuantities={receiptQuantities}
                    confirming={confirmingOrderId === o.id}
                    posting={postingOrderId === o.id}
                    postError={confirmingOrderId === o.id ? postError : null}
                    hoverButtonId={hoverButtonId}
                    onToggleReceive={() => onToggleReceive(o.id)}
                    onQtyChange={onQtyChange}
                    onStartConfirm={() => onStartConfirm(o.id)}
                    onCancelConfirm={onCancelConfirm}
                    onConfirm={() => onConfirmReceipt(o)}
                    onHoverEnter={(id) => setHoverButtonId(id)}
                    onHoverLeave={() => setHoverButtonId(null)}
                  />
                ))
              )}

              <div style={{ ...sectionLabelStyle, marginTop: 32 }}>Received</div>
              {received.length === 0 ? (
                <div style={{ fontSize: 14, color: '#6b7280' }}>
                  No completed receipts yet
                </div>
              ) : (
                received.map((o) => (
                  <ReceivedCard
                    key={o.id}
                    order={o}
                    fromName={locByCode.get(o.fromLocationCode) ?? o.fromLocationCode}
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

// ── inbound card ─────────────────────────────────────────────────────────────
interface InboundCardProps {
  order: TransferOrder;
  fromName: string;
  toName: string;
  receiving: boolean;
  lines: TransferOrderLine[] | undefined;
  receiptQuantities: Record<string, number>;
  confirming: boolean;
  posting: boolean;
  postError: string | null;
  hoverButtonId: string | null;
  onToggleReceive: () => void;
  onQtyChange: (lineId: string, raw: string, max: number) => void;
  onStartConfirm: () => void;
  onCancelConfirm: () => void;
  onConfirm: () => void;
  onHoverEnter: (id: string) => void;
  onHoverLeave: () => void;
}

function InboundCard({
  order, fromName, toName, receiving, lines, receiptQuantities,
  confirming, posting, postError, hoverButtonId,
  onToggleReceive, onQtyChange, onStartConfirm, onCancelConfirm, onConfirm,
  onHoverEnter, onHoverLeave,
}: InboundCardProps) {
  const confirmHoverId = `confirm-${order.id}`;
  const yesHoverId = `yes-${order.id}`;

  const confirmStyle: React.CSSProperties = {
    ...primaryButtonStyle,
    background: hoverButtonId === confirmHoverId ? '#047857' : '#059669',
  };
  const yesStyle: React.CSSProperties = {
    ...primaryButtonStyle,
    background: hoverButtonId === yesHoverId ? '#047857' : '#059669',
    opacity: posting ? 0.7 : 1,
    cursor: posting ? 'wait' : 'pointer',
  };

  const discrepancyCount = useMemo(() => {
    if (!lines) return 0;
    return lines.reduce((acc, l) => {
      const entered = receiptQuantities[l.id] ?? l.quantity;
      return acc + (entered !== l.quantity ? 1 : 0);
    }, 0);
  }, [lines, receiptQuantities]);

  return (
    <div style={inboundCardStyle}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'ui-monospace, Menlo, Monaco, monospace', fontSize: 15, fontWeight: 600, color: '#111827' }}>
          {order.no}
        </span>
        <StatusBadge status="In Transit" />
      </div>

      {/* Route */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginTop: 8, flexWrap: 'wrap' }}>
        <LocationTag name={fromName} direction="from" />
        <span style={arrowStyle}>→</span>
        <LocationTag name={toName} direction="to" />
        <span style={{ marginLeft: 'auto', fontSize: 12, color: '#6b7280' }}>
          Expected: <span style={{ color: '#374151' }}>{formatDate(order.receiptDate)}</span>
        </span>
      </div>

      {/* Toggle */}
      <div style={{ marginTop: 12 }}>
        <button type="button" style={receiveToggleButtonStyle} onClick={onToggleReceive}>
          {receiving ? 'Cancel receipt' : `Receive items (${order.lineCount})`}
        </button>
      </div>

      {/* Receipt form */}
      {receiving && (
        <div>
          {lines === undefined ? (
            <LoadingState message="Loading line items…" />
          ) : lines.length === 0 ? (
            <div style={{ color: '#6b7280', padding: '16px 0' }}>No line items found</div>
          ) : (
            <>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginTop: 16, marginBottom: 12 }}>
                Confirm quantities received
              </div>
              {lines.map((l) => (
                <ReceiptLineRow
                  key={l.id}
                  line={l}
                  entered={receiptQuantities[l.id] ?? l.quantity}
                  onChange={(raw) => onQtyChange(l.id, raw, l.quantity)}
                />
              ))}

              {discrepancyCount > 0 && (
                <div style={{
                  background: '#fffbeb',
                  border: '1px solid #fcd34d',
                  borderRadius: 6,
                  padding: '10px 14px',
                  marginTop: 12,
                  fontSize: 13,
                  color: '#92400e',
                }}>
                  ⚠ {discrepancyCount} line(s) with quantity discrepancies. These will be recorded in BC.
                </div>
              )}

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
                      Confirm receipt
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: 14, color: '#111827', marginBottom: 12 }}>
                      Confirm receipt of <strong>{order.no}</strong> from <strong>{fromName}</strong>?
                      {discrepancyCount > 0
                        ? ` ${discrepancyCount} of ${lines.length} lines have quantity discrepancies.`
                        : ' All quantities match.'}
                    </div>
                    {posting && (
                      <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>Posting...</div>
                    )}
                    {postError && (
                      <div style={{ color: '#991b1b', fontSize: 13, marginBottom: 12 }}>{postError}</div>
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
                        {postError ? 'Try again' : 'Yes, confirm receipt'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ── receipt line row ─────────────────────────────────────────────────────────
interface ReceiptLineRowProps {
  line: TransferOrderLine;
  entered: number;
  onChange: (raw: string) => void;
}

function ReceiptLineRow({ line, entered, onChange }: ReceiptLineRowProps) {
  const state: 'ok' | 'short' | 'zero' =
    entered === 0 ? 'zero' : entered < line.quantity ? 'short' : 'ok';
  const shortBy = line.quantity - entered;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '10px 0',
      borderBottom: '1px solid #f3f4f6',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'ui-monospace, Menlo, Monaco, monospace',
          fontSize: 12,
          color: '#6b7280',
        }}>{line.itemNo}</div>
        <div style={{ fontSize: 14, color: '#111827', marginTop: 2 }}>{line.description}</div>
      </div>

      <div style={{ fontSize: 13, color: '#6b7280', whiteSpace: 'nowrap' }}>
        Expected: {line.quantity} {line.unit}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <label style={{ fontSize: 12, color: '#6b7280' }} htmlFor={`qty-${line.id}`}>Received:</label>
          <input
            id={`qty-${line.id}`}
            type="number"
            min={0}
            max={line.quantity}
            value={entered}
            onChange={(e) => onChange(e.target.value)}
            style={inputStyle(state)}
          />
        </div>
        {state === 'zero' && (
          <div style={{ fontSize: 12, color: '#991b1b' }}>Not received</div>
        )}
        {state === 'short' && (
          <div style={{ fontSize: 12, color: '#92400e' }}>Short by {shortBy}</div>
        )}
      </div>
    </div>
  );
}

// ── received card ────────────────────────────────────────────────────────────
interface ReceivedCardProps {
  order: TransferOrder;
  fromName: string;
}

function ReceivedCard({ order, fromName }: ReceivedCardProps) {
  return (
    <div style={receivedCardStyle}>
      <span style={{ fontFamily: 'ui-monospace, Menlo, Monaco, monospace', fontSize: 14, fontWeight: 500, color: '#111827' }}>
        {order.no}
      </span>
      <StatusBadge status="Received" />
      <LocationTag name={fromName} direction="from" />
      <span style={{ marginLeft: 'auto', fontSize: 13, color: '#6b7280' }}>
        Received: <span style={{ color: '#374151' }}>{formatDate(order.receiptDate)}</span>
      </span>
    </div>
  );
}
