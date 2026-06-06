import { BarChart3, FolderTree, KeyRound, LogOut, ReceiptText, Sprout, WalletCards } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="brand"><Sprout size={24} /> Farm Accounts</div>
      <nav>
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Icon size={18} /> {label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div>
          <span className="muted">Signed in as</span>
          <strong>{user?.name}</strong>
        </div>
        <button className="icon-text-button" onClick={handleLogout} type="button">
          <LogOut size={17} /> Logout
        </button>
      </div>
    </aside>
  );
}
