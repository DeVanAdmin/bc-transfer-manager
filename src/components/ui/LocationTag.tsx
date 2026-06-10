interface LocationTagProps {
  name: string;
  direction?: 'from' | 'to';
}

const wrapperStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'baseline',
  gap: 4,
};

const labelStyle: React.CSSProperties = {
  color: '#6b7280',
  fontSize: 10,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
};

const nameStyle: React.CSSProperties = {
  color: '#111827',
  fontSize: 13,
  fontWeight: 500,
};

export default function LocationTag({ name, direction }: LocationTagProps) {
  return (
    <span style={wrapperStyle}>
      {direction && <span style={labelStyle}>{direction === 'from' ? 'FROM:' : 'TO:'}</span>}
      <span style={nameStyle}>{name}</span>
    </span>
  );
}
