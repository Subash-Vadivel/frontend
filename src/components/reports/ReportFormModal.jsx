import { Save } from 'lucide-react';
import { useState } from 'react';
import { getErrorMessage } from '../../lib/utils.js';
import { Button } from '../ui/button.jsx';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog.jsx';
import { Input } from '../ui/input.jsx';
import { Label } from '../ui/label.jsx';

export default function ReportFormModal({ report, onClose, onSubmit }) {
  const [name, setName] = useState(report?.name || '');
  const [description, setDescription] = useState(report?.description || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setError('');
    try { await onSubmit({ name: name.trim(), description: description.trim() || null }); }
    catch (err) { setError(getErrorMessage(err, 'Unable to save report')); setSaving(false); }
  };
  return (
    <Dialog open onOpenChange={(open) => { if (!open && !saving) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogDescription>{report ? 'Edit report' : 'New report'}</DialogDescription>
          <DialogTitle>{report ? 'Rename report' : 'Create report'}</DialogTitle>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={submit}>
          <div className="grid gap-1.5"><Label htmlFor="report-name">Name</Label><Input id="report-name" autoFocus maxLength={120} value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Vegetable prices" required /></div>
          <div className="grid gap-1.5"><Label htmlFor="report-description">Description <span className="text-muted-foreground">(optional)</span></Label><Input id="report-description" maxLength={500} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What this report tracks" /></div>
          {error && <p className="rounded-md border border-destructive/20 bg-destructive/10 p-2 text-xs text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
            <Button type="submit" disabled={saving || !name.trim()}><Save /> {saving ? 'Saving...' : report ? 'Save' : 'Create report'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
