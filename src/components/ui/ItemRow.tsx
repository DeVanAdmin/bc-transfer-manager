interface ItemRowProps {
  itemNo: string;
  description: string;
  quantity: number;
  unit: string;
  received?: number;
}

const rowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: 16,
  padding: '10px 0',
  borderBottom: '1px solid #f3f4f6',
};

const leftStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
};

const itemNoStyle: React.CSSProperties = {
  fontFamily: 'ui-monospace, Menlo, Monaco, "Cascadia Code", "Source Code Pro", monospace',
  color: '#6b7280',
  fontSize: 12,
};

const descStyle: React.CSSProperties = {
  color: '#111827',
  fontSize: 14,
};

const rightStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  textAlign: 'right',
  whiteSpace: 'nowrap',
};

const qtyStyle: React.CSSProperties = {
  color: '#111827',
  fontSize: 14,
};

export default function ItemRow({ itemNo, description, quantity, unit, received }: ItemRowProps) {
  const isComplete = received !== undefined && received === quantity;
  const receivedStyle: React.CSSProperties = {
    fontSize: 12,
    color: isComplete ? '#065f46' : '#991b1b',
    marginTop: 2,
  };
  return (
    <div style={rowStyle}>
      <div style={leftStyle}>
        <span style={itemNoStyle}>{itemNo}</span>
        <span style={descStyle}>{description}</span>
      </div>
      <div style={rightStyle}>
        <span style={qtyStyle}>{quantity} {unit}</span>
        {received !== undefined && (
          <span style={receivedStyle}>Received: {received} {unit}</span>
        )}
      </div>
    </div>
  );
}
