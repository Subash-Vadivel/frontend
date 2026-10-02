import { BarChart3, ChevronsLeftRight, FolderTree, KeyRound, LogOut, ReceiptText, Users, WalletCards, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useBusiness } from '../../context/BusinessContext.jsx';
import { cn } from '../../lib/utils.js';
import { Avatar, AvatarFallback } from '../ui/avatar.jsx';
import { Badge } from '../ui/badge.jsx';
import { Button } from '../ui/button.jsx';
import { Separator } from '../ui/separator.jsx';
import { APP_NAME, BrandIcon } from '../../lib/brand.js';

export default function Navbar({ mobileOpen = false, onMobileOpenChange = () => {} }) {
  const { user, logout } = useAuth();
  const { selectedBusiness, canManageUsers, canManageMcp } = useBusiness();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const initial = user?.name?.charAt(0)?.toUpperCase() || 'U';
  const groups = useMemo(() => [
    { label: 'Workspace', links: [{ to: '/dashboard', label: 'Dashboard', icon: BarChart3 }] },
    { label: 'Ledgers', links: [{ to: '/income', label: 'Income', icon: WalletCards }, { to: '/expenses', label: 'Expenses', icon: ReceiptText }] },
    { label: 'System', links: [
      { to: '/categories', label: 'Categories', icon: FolderTree },
      ...(canManageMcp ? [{ to: '/mcp', label: 'MCP', icon: KeyRound }] : []),
      ...(canManageUsers ? [{ to: '/users', label: 'Users', icon: Users }] : []),
    ] },
  ], [canManageMcp, canManageUsers]);
  const handleLogout = () => { logout(); navigate('/login'); };
  const content = (
    <aside className={cn('flex h-full flex-col bg-background p-2 transition-all lg:sticky lg:top-0 lg:h-screen lg:border-r', collapsed ? 'lg:w-[68px]' : 'lg:w-[248px]')}>
      <div className="flex h-10 items-center gap-2 px-1">
        <button className="flex h-8 w-8 items-center justify-center rounded-md border bg-background" type="button" onClick={() => navigate('/dashboard')} aria-label={APP_NAME}><BrandIcon className="h-4 w-4 text-primary" /></button>
        {!collapsed && <div className="min-w-0"><div className="truncate text-[13px] font-semibold">{APP_NAME}</div><div className="truncate text-[11px] text-muted-foreground">{selectedBusiness?.name || 'Select business'}</div></div>}
        <Button className="ml-auto lg:hidden" variant="ghost" size="icon" type="button" onClick={() => onMobileOpenChange(false)} aria-label="Close navigation"><X /></Button>
      </div>
      <Separator className="my-2" />
      <nav className="grid gap-4 px-1 py-1">
        {groups.map((group) => <div className="grid gap-1" key={group.label}>{!collapsed && <div className="px-2 py-1 text-[11px] font-medium text-muted-foreground">{group.label}</div>}{group.links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} onClick={() => onMobileOpenChange(false)} title={collapsed ? label : undefined} className={({ isActive }) => cn('flex h-8 items-center gap-2 rounded-md px-2 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground', collapsed && 'justify-center px-0', isActive && 'bg-accent text-foreground')}><Icon className="h-3.5 w-3.5 shrink-0" />{!collapsed && <span>{label}</span>}</NavLink>)}</div>)}
      </nav>
      <div className="mt-auto grid gap-2 px-1">
        {!collapsed && <div className="rounded-lg border bg-muted/20 p-3"><div className="mb-2 flex items-center justify-between"><span className="text-xs font-medium">Business role</span><Badge variant="income">{selectedBusiness?.role || 'none'}</Badge></div><p className="text-[11px] text-muted-foreground">All ledgers and settings are scoped to the selected business.</p></div>}
        <div className={cn('flex items-center gap-2 rounded-lg border p-2', collapsed && 'justify-center p-1')}><Avatar className="h-7 w-7"><AvatarFallback>{initial}</AvatarFallback></Avatar>{!collapsed && <div className="min-w-0"><p className="truncate text-[11px] text-muted-foreground">Signed in</p><strong className="block truncate text-[13px] font-medium">{user?.name}</strong></div>}</div>
        <Button onClick={handleLogout} type="button" variant="outline" size={collapsed ? 'icon' : 'default'} title="Logout"><LogOut />{!collapsed && <span>Logout</span>}</Button>
        <Button className="hidden lg:inline-flex" onClick={() => setCollapsed((v) => !v)} size={collapsed ? 'icon' : 'default'} type="button" variant="ghost" title="Toggle sidebar"><ChevronsLeftRight />{!collapsed && <span>Collapse</span>}</Button>
      </div>
    </aside>
  );
  return <><div className="hidden lg:block">{content}</div>{mobileOpen && <div className="fixed inset-0 z-50 grid grid-cols-[280px_1fr] lg:hidden"><div className="border-r bg-background">{content}</div><button aria-label="Close navigation" className="bg-background/70 backdrop-blur" onClick={() => onMobileOpenChange(false)} type="button" /></div>}</>;
}
