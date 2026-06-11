import { useEffect } from 'react';
// HashRouter (not BrowserRouter): the Power Apps host serves this app at a deep
// path (/play/e/{env}/app/{appId}), so path-based routing matches no route and
// renders a blank screen. Hash routing is independent of the host pathname.
import { HashRouter, Navigate, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import AuthGuard from './components/AuthGuard';
import { getDevRole } from './hooks/useUserRole';
import CoordinatorView from './views/CoordinatorView';
import OriginView from './views/OriginView';
import DestinationView from './views/DestinationView';
import DiagnosticView from './views/DiagnosticView';

const devNavStyle: React.CSSProperties = {
  display: 'flex',
  gap: '0.75rem',
  padding: '0.5rem 0.75rem',
  background: '#fff3bf',
  borderBottom: '1px dashed #b58900',
  fontFamily: 'system-ui, sans-serif',
  fontSize: '0.85rem',
};

const devNavLabelStyle: React.CSSProperties = {
  fontWeight: 600,
  color: '#7a5d00',
  marginRight: '0.5rem',
};

const devNavRoleStyle: React.CSSProperties = {
  fontWeight: 700,
  color: '#7a5d00',
  marginRight: '0.5rem',
};

const devNavLinkStyle = ({ isActive }: { isActive: boolean }): React.CSSProperties => ({
  color: isActive ? '#7a5d00' : '#444',
  textDecoration: isActive ? 'underline' : 'none',
});

function DevRoleSwitcher() {
  if (!import.meta.env.DEV) return null;
  const activeRole = (import.meta.env.VITE_DEV_ROLE as string | undefined) ?? '(unset)';
  return (
    <nav style={devNavStyle}>
      <span style={devNavLabelStyle}>DEV ROLE:</span>
      <span style={devNavRoleStyle}>{activeRole}</span>
      <NavLink to="/coordinator" style={devNavLinkStyle}>Coordinator</NavLink>
      <NavLink to="/origin" style={devNavLinkStyle}>Origin</NavLink>
      <NavLink to="/destination" style={devNavLinkStyle}>Destination</NavLink>
      <NavLink to="/diagnostic" style={devNavLinkStyle}>Diagnostic</NavLink>
    </nav>
  );
}

/**
 * In development, land on the route matching VITE_DEV_ROLE on mount so that
 * editing .env.local + restarting the dev server drops you on the right view.
 */
function DevRoleRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const devRole = getDevRole();
    if (devRole) navigate(`/${devRole}`, { replace: true });
  }, [navigate]);
  return null;
}

export default function App() {
  return (
    <HashRouter>
      <DevRoleSwitcher />
      <DevRoleRedirect />
      <Routes>
        <Route path="/" element={<Navigate to="/coordinator" replace />} />
        <Route
          path="/coordinator"
          element={
            <AuthGuard requiredRole="coordinator">
              <CoordinatorView />
            </AuthGuard>
          }
        />
        <Route
          path="/origin"
          element={
            <AuthGuard requiredRole="origin">
              <OriginView />
            </AuthGuard>
          }
        />
        <Route
          path="/destination"
          element={
            <AuthGuard requiredRole="destination">
              <DestinationView />
            </AuthGuard>
          }
        />
        {import.meta.env.DEV && <Route path="/diagnostic" element={<DiagnosticView />} />}
      </Routes>
    </HashRouter>
  );
}
