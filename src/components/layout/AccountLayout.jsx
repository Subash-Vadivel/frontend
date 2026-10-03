import { ArrowLeft } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';
import { useBusiness } from '../../context/BusinessContext.jsx';
import { APP_NAME, BrandIcon } from '../../lib/brand.js';
import { workspacePath } from '../../lib/workspace.js';
import ThemeToggle from '../theme/ThemeToggle.jsx';

// Pages that belong to the user account rather than one workspace (e.g. MCP API keys).
export default function AccountLayout() {
  const { selectedBusiness } = useBusiness();
  const back = selectedBusiness
    ? { to: workspacePath(selectedBusiness.id), label: `Back to ${selectedBusiness.name}` }
    : { to: '/businesses/select', label: 'Choose a workspace' };
  return (
    <div className="min-h-screen bg-muted/15 text-foreground">
      <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto flex h-12 w-full max-w-[1200px] items-center gap-3 px-3 sm:px-5">
          <span className="flex items-center gap-2 text-[13px] font-semibold"><span className="flex h-8 w-8 items-center justify-center rounded-md border bg-background"><BrandIcon className="h-4 w-4 text-primary" /></span>{APP_NAME}</span>
          <Link to={back.to} className="ml-2 inline-flex min-w-0 items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{back.label}</span></Link>
          <div className="ml-auto"><ThemeToggle compact /></div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1200px] px-3 py-4 sm:px-5 lg:px-6"><Outlet /></main>
    </div>
  );
}
