import { ArrowRight, Check, KeyRound, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/theme/ThemeToggle.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Button } from '../components/ui/button.jsx';
import { Loader } from '../components/ui/loader.jsx';
import { useBusiness } from '../context/BusinessContext.jsx';
import { APP_NAME, BrandIcon } from '../lib/brand.js';
import { cn } from '../lib/utils.js';
import { workspacePath } from '../lib/workspace.js';

const roleLabels = { owner: 'Owner', admin: 'Admin', manager: 'Manager', viewer: 'Viewer' };
const roleVariants = { owner: 'default', admin: 'balance', manager: 'income', viewer: 'secondary' };
const avatarTones = [
  'bg-blue-500/10 text-blue-700 dark:text-blue-300',
  'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  'bg-amber-500/10 text-amber-700 dark:text-amber-300',
  'bg-violet-500/10 text-violet-700 dark:text-violet-300',
  'bg-rose-500/10 text-rose-700 dark:text-rose-300',
];

const initialsFor = (name = '') => name.trim().split(/\s+/).slice(0, 2).map((word) => word[0]).join('').toUpperCase() || '?';
const toneFor = (id = '') => avatarTones[[...id].reduce((sum, char) => sum + char.charCodeAt(0), 0) % avatarTones.length];
const formatCreated = (value) => (value ? new Date(value).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : null);

export default function BusinessSelectPage() {
  const { businesses, selectedBusiness, loading, error, selectBusiness } = useBusiness();
  const navigate = useNavigate();
  const enterBusiness = (businessId) => {
    selectBusiness(businessId);
    navigate(workspacePath(businessId), { replace: true });
  };
  const createNew = () => navigate('/businesses/new');

  return (
    <main className="min-h-screen bg-muted/20 px-4 py-6 text-foreground">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between">
        <div className="flex items-center gap-2 text-[13px] font-semibold"><span className="flex h-8 w-8 items-center justify-center rounded-md border bg-background"><BrandIcon className="h-4 w-4 text-primary" /></span>{APP_NAME}</div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={() => navigate('/account/mcp')}><KeyRound /> MCP API keys</Button>
          <ThemeToggle compact />
        </div>
      </div>
      <section className="mx-auto mt-14 w-full max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-normal">Choose a business</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">Each business keeps its own entries, categories, team, and integrations. You can switch at any time.</p>
        </div>
        {error && <p className="mb-3 rounded-md border border-destructive/20 bg-destructive/10 p-2 text-xs text-destructive">{error}</p>}
        {loading ? <Loader className="min-h-56" /> : businesses.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {businesses.map((business) => {
              const isCurrent = selectedBusiness?.id === business.id;
              const created = formatCreated(business.createdAt);
              return (
                <button
                  key={business.id}
                  type="button"
                  onClick={() => enterBusiness(business.id)}
                  className={cn(
                    'group flex items-center gap-4 rounded-lg border bg-card p-4 text-left shadow-[0_1px_1px_rgba(0,0,0,.03)] transition-colors hover:border-foreground/20 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    isCurrent && 'border-primary/40',
                  )}
                >
                  <span className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-sm font-semibold', toneFor(business.id))}>{initialsFor(business.name)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold">{business.name}</span>
                      {isCurrent && <span className="flex items-center gap-0.5 text-[11px] font-medium text-primary"><Check className="h-3 w-3" /> Current</span>}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">{[business.legalName, created && `Since ${created}`].filter(Boolean).join(' · ') || 'Business'}</span>
                    <Badge variant={roleVariants[business.role] || 'secondary'} className="mt-2">{roleLabels[business.role] || business.role}</Badge>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" aria-hidden="true" />
                </button>
              );
            })}
            <button
              type="button"
              onClick={createNew}
              className="flex min-h-[94px] items-center justify-center gap-2 rounded-lg border border-dashed p-4 text-sm text-muted-foreground transition-colors hover:border-foreground/30 hover:bg-accent/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Plus className="h-4 w-4" /> Add a business
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center rounded-lg border border-dashed bg-card px-6 py-12 text-center">
            <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-md border"><BrandIcon className="h-5 w-5 text-primary" /></span>
            <h2 className="text-base font-semibold">Create your first business</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">Add a business to start tracking its income and expenses. You can invite your team later.</p>
            <Button className="mt-5" type="button" onClick={createNew}><Plus /> Create business</Button>
          </div>
        )}
      </section>
    </main>
  );
}
