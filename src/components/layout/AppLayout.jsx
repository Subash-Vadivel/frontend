import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';

export default function AppLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <div className="app-main">
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
