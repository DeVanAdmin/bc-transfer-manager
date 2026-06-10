import { useEffect, useState } from 'react';
import { StatusBadge, LoadingState } from '../components/ui';
import { getTransferOrders, type TransferOrder } from '../services';

const pageStyle: React.CSSProperties = {
  padding: '24px 32px',
  background: '#ffffff',
  color: '#111827',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  maxWidth: 720,
  margin: '0 auto',
  width: '100%',
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 0',
  borderBottom: '1px solid #f3f4f6',
};

const noStyle: React.CSSProperties = {
  fontFamily: 'ui-monospace, Menlo, Monaco, monospace',
  fontSize: 14,
  color: '#111827',
};

const routeStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#6b7280',
  marginLeft: 8,
};

const errorStyle: React.CSSProperties = {
  color: '#991b1b',
  marginTop: 16,
  padding: 12,
  background: '#fef2f2',
  borderRadius: 6,
  fontSize: 14,
};

export default function CoordinatorView() {
  const [orders, setOrders] = useState<TransferOrder[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    getTransferOrders()
      .then((data) => { if (alive) setOrders(data); })
      .catch((e: unknown) => {
        if (!alive) return;
        setError(e instanceof Error ? e.message : String(e));
      });
    return () => { alive = false; };
  }, []);

  return (
    <main style={pageStyle}>
      <h1 style={{ fontSize: 24, margin: 0 }}>Coordinator Dashboard</h1>
      <p style={{ color: '#4b5563', marginTop: 4 }}>All transfer orders across all locations.</p>

      {error && <div style={errorStyle}>Failed to load transfer orders: {error}</div>}

      {!error && orders === null && <LoadingState message="Loading transfer orders…" />}

      {!error && orders !== null && (
        <section style={{ marginTop: 16 }}>
          {orders.length === 0 ? (
            <p style={{ color: '#6b7280' }}>No transfer orders.</p>
          ) : (
            orders.map((o) => (
              <div key={o.id} style={rowStyle}>
                <div>
                  <span style={noStyle}>{o.no}</span>
                  <span style={routeStyle}>{o.fromLocationCode} → {o.toLocationCode}</span>
                </div>
                <StatusBadge status={o.status} />
              </div>
            ))
          )}
        </section>
      )}
    </main>
  );
}
