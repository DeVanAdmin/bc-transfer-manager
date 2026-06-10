export type TransferStatus = 'Open' | 'In Transit' | 'Received';

interface StatusBadgeProps {
  status: TransferStatus;
}

const palette: Record<TransferStatus, { bg: string; fg: string }> = {
  'Open':       { bg: '#dbeafe', fg: '#1e40af' },
  'In Transit': { bg: '#fef3c7', fg: '#92400e' },
  'Received':   { bg: '#d1fae5', fg: '#065f46' },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { bg, fg } = palette[status];
  const style: React.CSSProperties = {
    display: 'inline-block',
    background: bg,
    color: fg,
    fontSize: 12,
    fontWeight: 500,
    padding: '2px 10px',
    borderRadius: 9999,
    lineHeight: 1.4,
    whiteSpace: 'nowrap',
  };
  return <span style={style}>{status}</span>;
}
