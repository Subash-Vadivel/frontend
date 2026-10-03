import { Building2, Save, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateBusiness } from '../api/businessApi';
import DataPanel from '../components/layout/DataPanel.jsx';
import PageShell from '../components/layout/PageShell.jsx';
import DeleteWorkspaceModal from '../components/modals/DeleteWorkspaceModal.jsx';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useBusiness } from '../context/BusinessContext.jsx';
import { getErrorMessage } from '../lib/utils.js';

export default function SettingsPage() {
  const { user } = useAuth();
  const { selectedBusiness, canManageSettings, isOwner, refreshBusinesses } = useBusiness();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', legalName: '' });
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    if (selectedBusiness) setForm({ name: selectedBusiness.name || '', legalName: selectedBusiness.legalName || '' });
  }, [selectedBusiness]);

  if (!selectedBusiness) return null;
  if (!canManageSettings) {
    return <PageShell eyebrow="Workspace" title="Settings"><p className="rounded-lg border border-dashed bg-muted/20 p-10 text-center text-xs text-muted-foreground">Only owners and admins can change workspace settings.</p></PageShell>;
  }

  const dirty = form.name.trim() !== selectedBusiness.name || (form.legalName.trim() || null) !== (selectedBusiness.legalName || null);
  const save = async (event) => {
    event.preventDefault(); setSaving(true); setError(''); setNotice('');
    try {
      await updateBusiness(selectedBusiness.id, { name: form.name, legalName: form.legalName.trim() || null });
      await refreshBusinesses();
      setNotice('Workspace updated.');
    } catch (err) { setError(getErrorMessage(err, 'Unable to update workspace')); }
    finally { setSaving(false); }
  };
  const onDeleted = async () => {
    setDeleteOpen(false);
    await refreshBusinesses();
    navigate('/businesses/select', { replace: true });
  };

  return (
    <PageShell eyebrow="Workspace" title="Settings" description="Manage this workspace's details.">
      <DataPanel eyebrow="General" title="Workspace details" description="The name is shown to everyone in this workspace.">
        <form className="grid max-w-xl gap-4" onSubmit={save}>
          <div className="grid gap-1.5"><Label htmlFor="workspace-name">Workspace name</Label><Input id="workspace-name" maxLength={120} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></div>
          <div className="grid gap-1.5"><Label htmlFor="workspace-legal-name">Legal name <span className="text-muted-foreground">(optional)</span></Label><Input id="workspace-legal-name" maxLength={180} value={form.legalName} onChange={(event) => setForm({ ...form, legalName: event.target.value })} /></div>
          {notice && <p className="rounded-md border border-emerald-500/20 bg-emerald-500/10 p-2 text-xs text-emerald-700 dark:text-emerald-300">{notice}</p>}
          {error && <p className="rounded-md border border-destructive/20 bg-destructive/10 p-2 text-xs text-destructive">{error}</p>}
          <div><Button type="submit" disabled={saving || !dirty || !form.name.trim()}><Save /> {saving ? 'Saving...' : 'Save changes'}</Button></div>
        </form>
      </DataPanel>
      <DataPanel className="border-destructive/30" eyebrow="Danger zone" title="Delete workspace" description="Permanently delete this workspace and all of its data.">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3"><Building2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" /><p className="text-sm text-muted-foreground">{isOwner ? 'All income, expenses, categories, members, invitations and MCP API keys are removed. You will confirm with a code sent to your email.' : 'Only the workspace owner can delete it.'}</p></div>
          {isOwner && <Button type="button" variant="destructive" onClick={() => setDeleteOpen(true)}><Trash2 /> Delete workspace</Button>}
        </div>
      </DataPanel>
      {deleteOpen && <DeleteWorkspaceModal business={selectedBusiness} email={user?.email} onClose={() => setDeleteOpen(false)} onDeleted={onDeleted} />}
    </PageShell>
  );
}
