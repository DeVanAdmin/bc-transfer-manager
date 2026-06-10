import { BrowserRouter, Navigate, NavLink, Route, Routes } from 'react-router-dom';
import CoordinatorView from './views/CoordinatorView';
import OriginView from './views/OriginView';
import DestinationView from './views/DestinationView';

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

const devNavLinkStyle = ({ isActive }: { isActive: boolean }): React.CSSProperties => ({
  color: isActive ? '#7a5d00' : '#444',
  textDecoration: isActive ? 'underline' : 'none',
});

function DevRoleSwitcher() {
  if (!import.meta.env.DEV) return null;
  return (
    <nav style={devNavStyle}>
      <span style={devNavLabelStyle}>DEV ROLE:</span>
      <NavLink to="/coordinator" style={devNavLinkStyle}>Coordinator</NavLink>
      <NavLink to="/origin" style={devNavLinkStyle}>Origin</NavLink>
      <NavLink to="/destination" style={devNavLinkStyle}>Destination</NavLink>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <DevRoleSwitcher />
      <Routes>
        <Route path="/" element={<Navigate to="/coordinator" replace />} />
        <Route path="/coordinator" element={<CoordinatorView />} />
        <Route path="/origin" element={<OriginView />} />
        <Route path="/destination" element={<DestinationView />} />
      </Routes>
    </BrowserRouter>
  );
}
