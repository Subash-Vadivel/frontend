import { Building2, Menu, Plus, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useBusiness } from '../../context/BusinessContext.jsx';
import CommandPalette from '../command/CommandPalette.jsx';
import ThemeToggle from '../theme/ThemeToggle.jsx';
import { Avatar, AvatarFallback } from '../ui/avatar.jsx';
import { Button } from '../ui/button.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select.jsx';
import { APP_NAME } from '../../lib/brand.js';
import { stripWorkspace, workspacePath } from '../../lib/workspace.js';

const pageNames = {
  '/dashboard': 'Dashboard',
  '/reports': 'Reports',
  '/income': 'Income',
  '/expenses': 'Expenses',
  '/categories': 'Categories',
  '/mcp': 'MCP',
  '/users': 'Users',
  '/settings': 'Settings',
};

export default function AppTopbar({ onMenuClick }) {
  const { user } = useAuth();
  const { businesses, selectedBusiness, selectedBusinessId, canWriteFinance, wsPath } = useBusiness();
  const navigate = useNavigate();
  const location = useLocation();
  const [commandOpen, setCommandOpen] = useState(false);
  const pageTitle = useMemo(() => {
    const path = stripWorkspace(location.pathname);
    return pageNames[path] || (path.startsWith('/reports/') ? 'Report' : APP_NAME);
  }, [location.pathname]);
  const initial = user?.name?.charAt(0)?.toUpperCase() || 'U';
  useEffect(() => {
    const handler = (event) => {
      const key = event.key.toLowerCase();
      if ((event.metaKey || event.ctrlKey) && key === 'k') { event.preventDefault(); setCommandOpen(true); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
  const switchBusiness = (value) => {
    if (value === '__new__') { navigate('/businesses/new'); return; }
    // WorkspaceRoute selects the workspace from the URL.
    navigate(workspacePath(value, '/dashboard'));
  };
  return (
    <>
      <header className="sticky top-0 z-30 flex h-12 items-center gap-3 border-b bg-background/90 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <Button className="lg:hidden" variant="ghost" size="icon" type="button" onClick={onMenuClick} aria-label="Open navigation"><Menu /></Button>
        <div className="hidden min-w-0 lg:block"><h1 className="truncate text-[13px] font-medium">{pageTitle}</h1></div>
        <div className="hidden min-w-[180px] items-center gap-2 lg:flex"><Building2 className="h-3.5 w-3.5 text-muted-foreground" /><Select value={selectedBusinessId || undefined} onValueChange={switchBusiness}><SelectTrigger className="h-8 w-[190px]" aria-label="Switch business"><SelectValue placeholder={selectedBusiness?.name || 'Select business'} /></SelectTrigger><SelectContent>{businesses.map((business) => <SelectItem key={business.id} value={business.id}>{business.name}</SelectItem>)}<SelectItem value="__new__">+ New business</SelectItem></SelectContent></Select></div>
        <button className="ml-0 flex h-8 min-w-0 flex-1 items-center gap-2 rounded-md border bg-muted/30 px-2.5 text-left text-xs text-muted-foreground transition-colors hover:bg-muted lg:ml-0 lg:max-w-xl" type="button" onClick={() => setCommandOpen(true)}>
          <Search className="h-3.5 w-3.5" /><span className="truncate">Search pages, ledgers, categories...</span><kbd className="ml-auto hidden rounded border bg-background px-1.5 py-0.5 font-mono text-[10px] sm:block">⌘K</kbd>
        </button>
        <div className="flex items-center gap-2">
          {canWriteFinance && <Button type="button" variant="outline" size="sm" onClick={() => navigate(wsPath('/income?action=create'))}><Plus /> Income</Button>}
          {canWriteFinance && <Button className="hidden sm:inline-flex" type="button" variant="outline" size="sm" onClick={() => navigate(wsPath('/expenses?action=create'))}><Plus /> Expense</Button>}
          <ThemeToggle compact />
          <Avatar className="h-8 w-8"><AvatarFallback>{initial}</AvatarFallback></Avatar>
        </div>
      </header>
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </>
  );
}
