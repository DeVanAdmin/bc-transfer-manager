interface LoadingStateProps {
  message?: string;
}

const keyframes = `@keyframes bctm-loading-pulse { 0%,100% { opacity: 1 } 50% { opacity: 0.3 } }`;

const wrapperStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 200,
};

const circleStyle: React.CSSProperties = {
  width: 24,
  height: 24,
  borderRadius: '50%',
  border: '1.5px solid #6b7280',
  animation: 'bctm-loading-pulse 1.2s ease-in-out infinite',
};

const messageStyle: React.CSSProperties = {
  fontSize: 14,
  color: '#6b7280',
  marginTop: 12,
};

export default function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div style={wrapperStyle}>
      <style>{keyframes}</style>
      <div style={circleStyle} aria-hidden />
      <div style={messageStyle} role="status">{message}</div>
    </div>
  );
}
