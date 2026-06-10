import { StatusBadge, LocationTag, ItemRow, LoadingState } from '../components/ui';

const pageStyle: React.CSSProperties = {
  padding: '24px 32px',
  background: '#ffffff',
  color: '#111827',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  maxWidth: 720,
  margin: '0 auto',
  width: '100%',
};

const sectionStyle: React.CSSProperties = {
  marginTop: 24,
  paddingTop: 16,
  borderTop: '1px solid #e5e7eb',
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: 0.6,
  textTransform: 'uppercase',
  color: '#6b7280',
  marginBottom: 12,
};

const rowGroupStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 12,
  alignItems: 'center',
};

export default function CoordinatorView() {
  return (
    <main style={pageStyle}>
      <h1 style={{ fontSize: 24, margin: 0 }}>Coordinator Dashboard</h1>
      <p style={{ color: '#4b5563', marginTop: 4 }}>All transfer orders across all locations.</p>

      <section style={sectionStyle}>
        <div style={sectionTitleStyle}>StatusBadge</div>
        <div style={rowGroupStyle}>
          <StatusBadge status="Open" />
          <StatusBadge status="In Transit" />
          <StatusBadge status="Received" />
        </div>
      </section>

      <section style={sectionStyle}>
        <div style={sectionTitleStyle}>LocationTag</div>
        <div style={rowGroupStyle}>
          <LocationTag name="WH-MAIN" />
          <LocationTag name="WH-EAST" direction="from" />
          <LocationTag name="WH-WEST" direction="to" />
        </div>
      </section>

      <section style={sectionStyle}>
        <div style={sectionTitleStyle}>ItemRow</div>
        <div>
          <ItemRow itemNo="SKU-00001" description="Cordless drill, 18V" quantity={10} unit="PCS" />
          <ItemRow itemNo="SKU-00042" description="Steel wood screws, 1.5in (box)" quantity={50} unit="BOX" received={50} />
          <ItemRow itemNo="SKU-00109" description="Safety goggles, anti-fog" quantity={20} unit="PCS" received={14} />
        </div>
      </section>

      <section style={sectionStyle}>
        <div style={sectionTitleStyle}>LoadingState</div>
        <LoadingState message="Loading transfer orders…" />
      </section>
    </main>
  );
}
