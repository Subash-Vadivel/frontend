import { ArrowRight, Building2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/theme/ThemeToggle.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Button } from '../components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Skeleton } from '../components/ui/skeleton.jsx';
import { useBusiness } from '../context/BusinessContext.jsx';

export default function BusinessSelectPage() {
  const { businesses, loading, error, selectBusiness } = useBusiness();
  const navigate = useNavigate();
  const enterBusiness = (businessId) => {
    selectBusiness(businessId);
    navigate('/dashboard', { replace: true });
  };
  return (
    <main className="min-h-screen bg-muted/20 px-4 py-6 text-foreground">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold"><Building2 className="h-4 w-4 text-primary" /> Farm Accounts</div>
        <ThemeToggle compact />
      </div>
      <section className="mx-auto mt-14 w-full max-w-4xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-xs font-medium text-muted-foreground">Workspace access</p><h1 className="mt-1 text-2xl font-semibold tracking-normal">Select a business</h1><p className="mt-2 max-w-xl text-sm text-muted-foreground">Finance data, categories, MCP keys, and users are scoped to the business you enter.</p></div>
          <Button type="button" onClick={() => navigate('/businesses/new')}><Plus /> New business</Button>
        </div>
        {error && <p className="mb-3 rounded-md border border-destructive/20 bg-destructive/10 p-2 text-xs text-destructive">{error}</p>}
        {loading ? <Skeleton className="h-56" /> : businesses.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {businesses.map((business) => <Card key={business.id} className="rounded-lg"><CardHeader><div className="flex items-start justify-between gap-3"><div><CardTitle className="text-base">{business.name}</CardTitle><CardDescription>{business.legalName || 'Business workspace'}</CardDescription></div><Badge>{business.role}</Badge></div></CardHeader><CardContent><Button className="w-full justify-between" type="button" variant="outline" onClick={() => enterBusiness(business.id)}>Enter workspace <ArrowRight /></Button></CardContent></Card>)}
          </div>
        ) : (
          <Card className="rounded-lg border-dashed"><CardHeader><CardTitle>Create your first business</CardTitle><CardDescription>Your account is ready. Add a business entity to start tracking income, expenses, categories, API keys, and users.</CardDescription></CardHeader><CardContent><Button type="button" onClick={() => navigate('/businesses/new')}><Plus /> Create business</Button></CardContent></Card>
        )}
      </section>
    </main>
  );
}
