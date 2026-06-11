import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useUserRole, type Role } from '../hooks/useUserRole';
import LoadingState from './ui/LoadingState';

interface AuthGuardProps {
  requiredRole: Role;
  children: ReactNode;
}

const roleRoute: Record<Role, string> = {
  coordinator: '/coordinator',
  origin: '/origin',
  destination: '/destination',
};

const centeredStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '60vh',
  padding: '2rem',
  textAlign: 'center',
  fontFamily: 'system-ui, sans-serif',
};

const deniedTitleStyle: React.CSSProperties = {
  color: '#991b1b',
  fontSize: '1.25rem',
  fontWeight: 700,
  margin: 0,
};

const deniedEmailStyle: React.CSSProperties = {
  color: '#991b1b',
  fontSize: '0.9rem',
  fontWeight: 600,
  marginTop: '0.5rem',
};

const deniedBodyStyle: React.CSSProperties = {
  color: '#991b1b',
  fontSize: '0.95rem',
  marginTop: '0.75rem',
  maxWidth: 360,
  lineHeight: 1.5,
};

const errorStyle: React.CSSProperties = {
  color: '#991b1b',
  fontSize: '0.95rem',
  maxWidth: 420,
  lineHeight: 1.5,
};

export default function AuthGuard({ requiredRole, children }: AuthGuardProps) {
  const { role, email, loading, error } = useUserRole();

  if (loading) {
    return <LoadingState message="Signing you in..." />;
  }

  if (error) {
    return (
      <div style={centeredStyle}>
        <div style={errorStyle} role="alert">{error}</div>
      </div>
    );
  }

  if (role === requiredRole) {
    return <>{children}</>;
  }

  if (role === null) {
    return (
      <div style={centeredStyle} role="alert">
        <p style={deniedTitleStyle}>Access denied</p>
        {email && <p style={deniedEmailStyle}>{email}</p>}
        <p style={deniedBodyStyle}>
          Your account is not configured for this application. Contact your administrator.
        </p>
      </div>
    );
  }

  // Authenticated, but on the wrong route — send the user to their own route.
  return <Navigate to={roleRoute[role]} replace />;
}
