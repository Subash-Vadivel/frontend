import { Building2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/theme/ThemeToggle.jsx';
import { Button } from '../components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';
import { useBusiness } from '../context/BusinessContext.jsx';

export default function BusinessCreatePage() {
  const { createBusiness } = useBusiness();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [legalName, setLegalName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const submit = async (event) => {
    event.preventDefault();
    setSaving(true); setError('');
    try {
      await createBusiness({ name, legalName: legalName || null });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to create business');
    } finally { setSaving(false); }
  };
  return (
    <main className="grid min-h-screen place-items-center bg-muted/20 px-4 py-6 text-foreground">
      <div className="absolute right-4 top-4"><ThemeToggle compact /></div>
      <Card className="w-full max-w-lg rounded-lg">
        <CardHeader><div className="mb-2 flex h-9 w-9 items-center justify-center rounded-md border"><Building2 className="h-4 w-4 text-primary" /></div><CardTitle className="text-xl">Create business</CardTitle><CardDescription>This business will hold its own ledgers, categories, MCP keys, and invited users. You will be the owner.</CardDescription></CardHeader>
        <CardContent><form className="grid gap-4" onSubmit={submit}><div className="grid gap-1.5"><Label>Business name</Label><Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Acme Traders" required /></div><div className="grid gap-1.5"><Label>Legal name</Label><Input value={legalName} onChange={(event) => setLegalName(event.target.value)} placeholder="Optional" /></div>{error && <p className="rounded-md border border-destructive/20 bg-destructive/10 p-2 text-xs text-destructive">{error}</p>}<div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => navigate('/businesses/select')}>Cancel</Button><Button type="submit" disabled={saving}>{saving ? 'Creating...' : 'Create and enter'}</Button></div></form></CardContent>
      </Card>
    </main>
  );
}
