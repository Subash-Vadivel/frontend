import { BarChart3, FolderTree, KeyRound, LogOut, Menu, ReceiptText, Sprout, WalletCards, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import ThemeToggle from '../theme/ThemeToggle.jsx';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { to: '/income', label: 'Income', icon: WalletCards },
  { to: '/expenses', label: 'Expenses', icon: ReceiptText },
  { to: '/categories', label: 'Categories', icon: FolderTree },
  { to: '/mcp', label: 'MCP', icon: KeyRound },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="mobile-topbar">
        <div className="brand compact"><Sprout size={22} /> Farm Accounts</div>
        <div className="mobile-actions">
          <ThemeToggle className="compact-toggle" />
          <button
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            className="icon-button"
            onClick={() => setMenuOpen((current) => !current)}
            type="button"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>
      <aside className={`sidebar ${menuOpen ? 'open' : ''} ${collapsed ? 'collapsed' : ''}`}>
        <div className="brand-panel">
          <button
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="brand-mark"
            onClick={() => setCollapsed((current) => !current)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            type="button"
          >
            <Sprout size={24} />
          </button>
          <div className="brand-copy">
            <div className="brand">Farm Accounts</div>
            <p>Premium finance control</p>
          </div>
        </div>
        <nav>
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              aria-label={label}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
              title={collapsed ? label : undefined}
            >
              <Icon size={18} /> <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <ThemeToggle />
          <div className="user-chip">
            <span className="avatar">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
            <div>
              <span className="muted">Signed in as</span>
              <strong>{user?.name}</strong>
            </div>
          </div>
          <button className="icon-text-button" onClick={handleLogout} type="button">
            <LogOut size={17} /> <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
