import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AppTopbar from './AppTopbar.jsx';
import Navbar from './Navbar.jsx';

export default function AppLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[auto_1fr]">
      <Navbar mobileOpen={mobileNavOpen} onMobileOpenChange={setMobileNavOpen} />
      <div className="min-w-0 bg-muted/15">
        <AppTopbar onMenuClick={() => setMobileNavOpen(true)} />
        <main className="mx-auto w-full max-w-[1440px] px-3 py-4 sm:px-5 lg:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
