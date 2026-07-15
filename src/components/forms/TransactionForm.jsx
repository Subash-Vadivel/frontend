import { Save } from 'lucide-react';
import { useMemo, useState } from 'react';
import CustomFieldInputs from './CustomFieldInputs.jsx';
import { customValuesMapToPayload } from '../../utils/customFields.js';
import { Button } from '../ui/button.jsx';
import { Input } from '../ui/input.jsx';
import { Label } from '../ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select.jsx';
import { cn } from '../../lib/utils.js';

const initialForm = () => ({ date: new Date().toISOString().slice(0, 10), categoryId: '', description: '', amount: '' });

export default function TransactionForm({ type, categories, onSubmit, className = '', heading = `Add ${type}` }) {
  const [form, setForm] = useState(initialForm);
  const [customValues, setCustomValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const selectedCategory = useMemo(() => categories.find((category) => category.id === form.categoryId), [categories, form.categoryId]);
  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const updateCustomField = (fieldId, value) => setCustomValues((current) => ({ ...current, [fieldId]: value }));
  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setError('');
    try {
      await onSubmit({ date: form.date, categoryId: form.categoryId, description: form.description.trim() || null, amount: Number(form.amount), customFieldValues: customValuesMapToPayload(selectedCategory, customValues) });
      setForm(initialForm()); setCustomValues({});
    } catch (err) { setError(err.response?.data?.detail || `Unable to save ${type} entry`); } finally { setSaving(false); }
  };
  return (
    <form className={cn('grid gap-4 sm:grid-cols-2', className)} onSubmit={submit}>
      {heading && <div className="col-span-full"><h2 className="text-base font-semibold">{heading}</h2></div>}
      <div className="grid gap-2"><Label>Date</Label><Input type="date" value={form.date} onChange={(event) => updateField('date', event.target.value)} required /></div>
      <div className="grid gap-2"><Label>Category</Label><Select value={form.categoryId} onValueChange={(value) => { updateField('categoryId', value); setCustomValues({}); }} required><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger><SelectContent>{categories.map((category) => <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>)}</SelectContent></Select></div>
      <div className="grid gap-2"><Label>Amount</Label><Input type="number" min="0.01" step="0.01" value={form.amount} onChange={(event) => updateField('amount', event.target.value)} required /></div>
      <div className="grid gap-2"><Label>Description</Label><Input value={form.description} onChange={(event) => updateField('description', event.target.value)} placeholder="Optional note" /></div>
      <CustomFieldInputs fields={selectedCategory?.customFields || []} values={customValues} onChange={updateCustomField} />
      {error && <p className="col-span-full rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
      <Button className="col-span-full" type="submit" disabled={saving}><Save /> {saving ? 'Saving...' : 'Save entry'}</Button>
    </form>
  );
}
