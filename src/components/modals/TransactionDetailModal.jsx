import { Save } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import CustomFieldInputs from '../forms/CustomFieldInputs.jsx';
import { customValuesArrayToMap, customValuesMapToPayload, valueForDisplay } from '../../utils/customFields.js';
import { Button } from '../ui/button.jsx';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog.jsx';
import { Input } from '../ui/input.jsx';
import { Label } from '../ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select.jsx';

export default function TransactionDetailModal({ entry, categories, type, onClose, onSave }) {
  const [form, setForm] = useState({ date: '', categoryId: '', description: '', amount: '' });
  const [customValues, setCustomValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { if (!entry) return; setForm({ date: entry.date, categoryId: entry.categoryId, description: entry.description || '', amount: String(entry.amount) }); setCustomValues(customValuesArrayToMap(entry.customFieldValues)); setError(''); }, [entry]);
  const selectedCategory = useMemo(() => categories.find((category) => category.id === form.categoryId), [categories, form.categoryId]);
  if (!entry) return null;
  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const updateCustomField = (fieldId, value) => setCustomValues((current) => ({ ...current, [fieldId]: value }));
  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setError('');
    try { await onSave(entry.id, { date: form.date, categoryId: form.categoryId, description: form.description.trim() || null, amount: Number(form.amount), customFieldValues: customValuesMapToPayload(selectedCategory, customValues) }); onClose(); }
    catch (err) { setError(err.response?.data?.detail || `Unable to update ${type} entry`); } finally { setSaving(false); }
  };
  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent>
        <DialogHeader><DialogDescription>Entry details</DialogDescription><DialogTitle>{entry.categoryName}</DialogTitle></DialogHeader>
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={submit}>
          <div className="grid gap-2"><Label>Date</Label><Input type="date" value={form.date} onChange={(event) => updateField('date', event.target.value)} required /></div>
          <div className="grid gap-2"><Label>Category</Label><Select value={form.categoryId} onValueChange={(value) => { updateField('categoryId', value); setCustomValues({}); }}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{categories.map((category) => <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>)}</SelectContent></Select></div>
          <div className="grid gap-2"><Label>Amount</Label><Input type="number" min="0.01" step="0.01" value={form.amount} onChange={(event) => updateField('amount', event.target.value)} required /></div>
          <div className="grid gap-2"><Label>Description</Label><Input value={form.description} onChange={(event) => updateField('description', event.target.value)} placeholder="Optional note" /></div>
          <CustomFieldInputs fields={selectedCategory?.customFields || []} values={customValues} onChange={updateCustomField} />
          {entry.customFieldValues?.length > 0 && <div className="col-span-full grid gap-2 rounded-lg border bg-muted/30 p-4"><h3 className="text-sm font-medium">Saved custom values</h3>{entry.customFieldValues.map((value) => <div className="flex justify-between gap-4 text-sm" key={value.fieldId}><span className="text-muted-foreground">{value.fieldName}</span><strong>{valueForDisplay(value)}</strong></div>)}</div>}
          {error && <p className="col-span-full rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
          <Button className="col-span-full" type="submit" disabled={saving}><Save /> {saving ? 'Saving...' : 'Save changes'}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
