import { Fragment, useEffect, useMemo, useState } from 'react';
import {
  createTransferOrder,
  getItemAvailability,
  type Location,
  type NewTransferOrderLine,
  type TransferOrder,
} from '../services';

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function todayYMD(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function addDaysYMD(ymd: string, days: number): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(ymd);
  if (!m) return ymd;
  const [, y, mo, da] = m;
  const d = new Date(Number(y), Number(mo) - 1, Number(da));
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatDateLabel(ymd: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(ymd);
  if (!m) return ymd;
  const [, y, mo, da] = m;
  return `${MONTH_SHORT[parseInt(mo, 10) - 1]} ${parseInt(da, 10)}, ${y}`;
}

// Hardcoded item catalog (spec)
const ITEM_CATALOG: { itemNo: string; description: string; unit: string }[] = [
  { itemNo: 'ITEM-1001', description: 'Widget A',       unit: 'PCS' },
  { itemNo: 'ITEM-1002', description: 'Widget B',       unit: 'PCS' },
  { itemNo: 'ITEM-1003', description: 'Bracket Set',    unit: 'BOX' },
  { itemNo: 'ITEM-1004', description: 'Cable Assembly', unit: 'PCS' },
];

// ── styles ───────────────────────────────────────────────────────────────────
const backdropStyle: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 50,
};
const cardStyle: React.CSSProperties = {
  position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
  width: 560, maxHeight: '80vh', overflowY: 'auto',
  background: '#ffffff', borderRadius: 12, padding: 32,
  boxShadow: '0 20px 60px rgba(0,0,0,0.15)', zIndex: 51,
  boxSizing: 'border-box', fontFamily: 'system-ui, -apple-system, sans-serif',
};
const closeButtonStyle: React.CSSProperties = {
  position: 'absolute', top: 16, right: 16,
  background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#6b7280',
  lineHeight: 1, padding: 4,
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6,
};
const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  border: '1px solid #d1d5db',
  borderRadius: 6,
  fontSize: 14,
  background: '#ffffff',
  cursor: 'pointer',
  boxSizing: 'border-box',
};
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  border: '1px solid #d1d5db',
  borderRadius: 6,
  fontSize: 14,
  boxSizing: 'border-box',
};
const stepTitleStyle: React.CSSProperties = {
  fontSize: 18, fontWeight: 500, color: '#111827', margin: 0, marginBottom: 24,
};
const primaryButtonStyle: React.CSSProperties = {
  background: '#1d4ed8', color: '#ffffff', padding: '8px 18px',
  borderRadius: 6, fontSize: 14, fontWeight: 500, border: 'none', cursor: 'pointer',
};
const outlineButtonStyle: React.CSSProperties = {
  background: '#ffffff', color: '#374151', padding: '8px 18px',
  borderRadius: 6, fontSize: 14, fontWeight: 500,
  border: '1px solid #d1d5db', cursor: 'pointer',
};
const navRowStyle: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24,
};

// ── step indicator helpers ───────────────────────────────────────────────────
const CIRCLE_SIZE = 36;
function circleStyle(active: boolean, done: boolean): React.CSSProperties {
  return {
    width: CIRCLE_SIZE, height: CIRCLE_SIZE, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 14, fontWeight: 600,
    background: done ? '#059669' : active ? '#1d4ed8' : 'transparent',
    color: done || active ? '#ffffff' : '#9ca3af',
    border: !active && !done ? '2px solid #d1d5db' : 'none',
    boxSizing: 'border-box',
    flexShrink: 0,
  };
}
function stepLabelStyle(active: boolean, done: boolean): React.CSSProperties {
  return {
    fontSize: 14,
    color: done ? '#059669' : active ? '#1d4ed8' : '#9ca3af',
    marginTop: 6, fontWeight: active ? 500 : 400,
  };
}
function connectorStyle(done: boolean): React.CSSProperties {
  return {
    flex: 1, height: 2, background: done ? '#059669' : '#e5e7eb',
    marginTop: CIRCLE_SIZE / 2, marginLeft: 8, marginRight: 8,
  };
}

// ── props ────────────────────────────────────────────────────────────────────
interface NewTransferWizardProps {
  locations: Location[];
  onClose: () => void;
  onCreated: (order: TransferOrder) => void;
}

export default function NewTransferWizard({ locations, onClose, onCreated }: NewTransferWizardProps) {
  const today = useMemo(() => todayYMD(), []);
  const defaultReceiptDate = useMemo(() => addDaysYMD(today, 3), [today]);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [fromLocation, setFromLocation] = useState<string>('');
  const [toLocation, setToLocation] = useState<string>('');
  const [shipmentDate, setShipmentDate] = useState<string>(today);
  const [receiptDate, setReceiptDate] = useState<string>(defaultReceiptDate);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [addedItems, setAddedItems] = useState<NewTransferOrderLine[]>([]);
  const [availabilityCache, setAvailabilityCache] = useState<Record<string, number>>({});
  const [creating, setCreating] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const locByCode = useMemo(() => {
    const m = new Map<string, string>();
    for (const l of locations) m.set(l.code, l.name);
    return m;
  }, [locations]);

  // ── validation
  const sameLocations = !!fromLocation && !!toLocation && fromLocation === toLocation;
  const datesValid = !!shipmentDate && !!receiptDate
    && shipmentDate >= today && receiptDate >= shipmentDate;
  const step1Valid = !!fromLocation && !!toLocation && !sameLocations && datesValid;
  const step2Valid = addedItems.length > 0;

  const filteredCatalog = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return ITEM_CATALOG;
    return ITEM_CATALOG.filter(
      (i) => i.itemNo.toLowerCase().includes(q) || i.description.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  // ── handlers
  const addItem = (item: typeof ITEM_CATALOG[number]) => {
    setAddedItems((prev) => prev.some((a) => a.itemNo === item.itemNo)
      ? prev
      : [...prev, { itemNo: item.itemNo, description: item.description, unit: item.unit, quantity: 1 }]);
  };

  const updateQty = (itemNo: string, raw: string) => {
    if (raw === '') {
      setAddedItems((prev) => prev.map((a) => a.itemNo === itemNo ? { ...a, quantity: 1 } : a));
      return;
    }
    const n = Math.max(1, Math.floor(Number(raw) || 1));
    setAddedItems((prev) => prev.map((a) => a.itemNo === itemNo ? { ...a, quantity: n } : a));
  };

  const removeItem = (itemNo: string) => {
    setAddedItems((prev) => prev.filter((a) => a.itemNo !== itemNo));
  };

  const safeClose = () => {
    if (creating) return;
    onClose();
  };

  const onConfirmCreate = async () => {
    setCreating(true);
    setCreateError(null);
    try {
      const newOrder = await createTransferOrder(
        fromLocation, toLocation, shipmentDate, receiptDate, addedItems,
      );
      onCreated(newOrder);
      onClose();
    } catch (e) {
      setCreateError(e instanceof Error ? e.message : String(e));
    } finally {
      setCreating(false);
    }
  };

  // ── render
  return (
    <div style={backdropStyle} onClick={safeClose}>
      <div style={cardStyle} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button
          type="button"
          style={closeButtonStyle}
          onClick={safeClose}
          aria-label="Close"
          disabled={creating}
        >×</button>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 32, marginTop: 8 }}>
          {(['Route', 'Items', 'Review'] as const).map((label, i) => {
            const n = i + 1;
            const active = n === step;
            const done = n < step;
            return (
              <Fragment key={n}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 60 }}>
                  <div style={circleStyle(active, done)}>{done ? '✓' : n}</div>
                  <div style={stepLabelStyle(active, done)}>{label}</div>
                </div>
                {i < 2 && <div style={connectorStyle(n < step)} />}
              </Fragment>
            );
          })}
        </div>

        {step === 1 && (
          <div>
            <h2 style={stepTitleStyle}>Where is this transfer going?</h2>

            <div style={{ marginBottom: 16 }}>
              <label htmlFor="ntw-from" style={labelStyle}>From warehouse</label>
              <select
                id="ntw-from"
                style={selectStyle}
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
              >
                <option value="">Select origin...</option>
                {locations.map((l) => (
                  <option key={l.code} value={l.code}>{l.name}</option>
                ))}
              </select>
              {sameLocations && (
                <div style={{ color: '#991b1b', fontSize: 12, marginTop: 4 }}>
                  From and To warehouse cannot be the same
                </div>
              )}
            </div>

            <div style={{ marginBottom: 16 }}>
              <label htmlFor="ntw-to" style={labelStyle}>To warehouse</label>
              <select
                id="ntw-to"
                style={selectStyle}
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
              >
                <option value="">Select destination...</option>
                {locations.map((l) => (
                  <option key={l.code} value={l.code}>{l.name}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label htmlFor="ntw-ship" style={labelStyle}>Shipment date</label>
              <input
                id="ntw-ship"
                type="date"
                style={inputStyle}
                value={shipmentDate}
                min={today}
                onChange={(e) => {
                  const v = e.target.value;
                  setShipmentDate(v);
                  if (receiptDate < v) setReceiptDate(v);
                }}
              />
            </div>

            <div>
              <label htmlFor="ntw-receipt" style={labelStyle}>Expected receipt date</label>
              <input
                id="ntw-receipt"
                type="date"
                style={inputStyle}
                value={receiptDate}
                min={shipmentDate}
                onChange={(e) => setReceiptDate(e.target.value)}
              />
            </div>

            <div style={navRowStyle}>
              <span />
              <button
                type="button"
                style={{ ...primaryButtonStyle, opacity: step1Valid ? 1 : 0.5, cursor: step1Valid ? 'pointer' : 'not-allowed' }}
                disabled={!step1Valid}
                onClick={() => setStep(2)}
              >
                Next: Add items →
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={stepTitleStyle}>Add items to transfer</h2>

            <input
              type="text"
              placeholder="Search by item number or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ ...inputStyle, marginBottom: 16 }}
            />

            <div style={{ marginBottom: 24 }}>
              {filteredCatalog.length === 0 ? (
                <div style={{ color: '#6b7280', fontSize: 13, padding: '12px 0' }}>No items match.</div>
              ) : (
                filteredCatalog.map((item) => {
                  const isAdded = addedItems.some((a) => a.itemNo === item.itemNo);
                  return (
                    <div
                      key={item.itemNo}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '10px 0', borderBottom: '1px solid #f3f4f6',
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: 'ui-monospace, Menlo, Monaco, monospace', fontSize: 13, color: '#6b7280' }}>
                          {item.itemNo}
                        </div>
                        <div style={{ fontSize: 14, color: '#111827', marginTop: 2 }}>{item.description}</div>
                        <AvailabilityRow
                          itemNo={item.itemNo}
                          locationCode={fromLocation}
                          cache={availabilityCache}
                          setCache={setAvailabilityCache}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => addItem(item)}
                        disabled={isAdded}
                        style={{
                          border: '1px solid #1d4ed8',
                          color: isAdded ? '#9ca3af' : '#1d4ed8',
                          background: '#ffffff',
                          padding: '4px 12px',
                          borderRadius: 4,
                          fontSize: 13,
                          cursor: isAdded ? 'default' : 'pointer',
                          opacity: isAdded ? 0.7 : 1,
                        }}
                      >
                        {isAdded ? 'Added' : 'Add'}
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {addedItems.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                  Items in this transfer
                </div>
                {addedItems.map((item) => (
                  <div
                    key={item.itemNo}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 0', borderBottom: '1px solid #f3f4f6',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'ui-monospace, Menlo, Monaco, monospace', fontSize: 13, color: '#6b7280' }}>
                        {item.itemNo}
                      </div>
                      <div style={{ fontSize: 14, color: '#111827', marginTop: 2 }}>{item.description}</div>
                    </div>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateQty(item.itemNo, e.target.value)}
                      style={{
                        width: 70, padding: '4px 8px',
                        border: '1px solid #d1d5db', borderRadius: 4, fontSize: 14,
                      }}
                    />
                    <span style={{ fontSize: 13, color: '#6b7280' }}>{item.unit}</span>
                    <button
                      type="button"
                      onClick={() => removeItem(item.itemNo)}
                      aria-label={`Remove ${item.itemNo}`}
                      style={{
                        background: 'none', border: 'none',
                        color: '#991b1b', cursor: 'pointer', fontSize: 16, padding: 4,
                      }}
                    >×</button>
                  </div>
                ))}
              </div>
            )}

            <div style={navRowStyle}>
              <button type="button" style={outlineButtonStyle} onClick={() => setStep(1)}>← Back</button>
              <button
                type="button"
                style={{ ...primaryButtonStyle, opacity: step2Valid ? 1 : 0.5, cursor: step2Valid ? 'pointer' : 'not-allowed' }}
                disabled={!step2Valid}
                onClick={() => setStep(3)}
              >
                Next: Review →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 style={stepTitleStyle}>Review transfer order</h2>

            <div style={{
              background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8,
              padding: 20, marginBottom: 24,
            }}>
              {/* Route */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', letterSpacing: 0.4 }}>FROM</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: '#111827' }}>
                  {locByCode.get(fromLocation) ?? fromLocation}
                </span>
                <span style={{ color: '#9ca3af', fontSize: 16 }}>→</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', letterSpacing: 0.4 }}>TO</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: '#111827' }}>
                  {locByCode.get(toLocation) ?? toLocation}
                </span>
              </div>
              <div style={{ fontSize: 13, color: '#6b7280', marginTop: 8 }}>
                Shipment: {formatDateLabel(shipmentDate)} · Receipt: {formatDateLabel(receiptDate)}
              </div>

              {/* Items */}
              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Items</div>
                {addedItems.map((item) => (
                  <div
                    key={item.itemNo}
                    style={{
                      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                      gap: 12, padding: '10px 0', borderBottom: '1px solid #f3f4f6',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontFamily: 'ui-monospace, Menlo, Monaco, monospace',
                        fontSize: 12, color: '#6b7280',
                      }}>{item.itemNo}</div>
                      <div style={{ fontSize: 14, color: '#111827', marginTop: 2 }}>{item.description}</div>
                    </div>
                    <div style={{ fontSize: 14, color: '#111827', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      {item.quantity} {item.unit}
                    </div>
                  </div>
                ))}
                <div style={{ fontSize: 13, color: '#6b7280', textAlign: 'right', marginTop: 8 }}>
                  {addedItems.length} item{addedItems.length === 1 ? '' : 's'}
                </div>
              </div>
            </div>

            {createError && (
              <div style={{
                color: '#991b1b', background: '#fef2f2', border: '1px solid #fecaca',
                borderRadius: 6, padding: '10px 14px', marginBottom: 12, fontSize: 13,
              }}>
                {createError}
              </div>
            )}

            <div style={navRowStyle}>
              <button
                type="button"
                style={outlineButtonStyle}
                onClick={() => setStep(2)}
                disabled={creating}
              >← Back</button>
              <button
                type="button"
                style={{ ...primaryButtonStyle, opacity: creating ? 0.7 : 1, cursor: creating ? 'wait' : 'pointer' }}
                onClick={onConfirmCreate}
                disabled={creating}
              >
                {creating ? 'Creating...' : createError ? 'Try again' : 'Confirm & create'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── availability subcell ─────────────────────────────────────────────────────
interface AvailabilityRowProps {
  itemNo: string;
  locationCode: string;
  cache: Record<string, number>;
  setCache: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

function AvailabilityRow({ itemNo, locationCode, cache, setCache }: AvailabilityRowProps) {
  const key = `${itemNo}@${locationCode}`;
  const cached = cache[key];

  useEffect(() => {
    if (!locationCode) return;
    if (cached !== undefined) return;
    let alive = true;
    getItemAvailability(itemNo, locationCode)
      .then((av) => { if (alive) setCache((prev) => ({ ...prev, [key]: av.availableQuantity })); })
      .catch(() => { if (alive) setCache((prev) => ({ ...prev, [key]: 0 })); });
    return () => { alive = false; };
  }, [itemNo, locationCode, key, cached, setCache]);

  if (!locationCode) return null;
  if (cached === undefined) {
    return <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>Checking...</div>;
  }
  return cached > 0 ? (
    <div style={{ fontSize: 12, color: '#059669', marginTop: 2 }}>{cached} available</div>
  ) : (
    <div style={{ fontSize: 12, color: '#991b1b', marginTop: 2 }}>None available</div>
  );
}
