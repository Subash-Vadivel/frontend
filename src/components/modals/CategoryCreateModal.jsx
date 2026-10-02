import { Hash, ListPlus, Plus, ToggleLeft, TrendingDown, TrendingUp, Type, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils.js';
import { Button } from '../ui/button.jsx';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog.jsx';
import { Input } from '../ui/input.jsx';
import { Label } from '../ui/label.jsx';

const categoryTypes = [
  { value: 'income', label: 'Income', hint: 'Money coming in', icon: TrendingUp, active: 'border-income/50 bg-income/5 ring-1 ring-income/30', iconTone: 'bg-income/10 text-income' },
  { value: 'expense', label: 'Expense', hint: 'Money going out', icon: TrendingDown, active: 'border-expense/50 bg-expense/5 ring-1 ring-expense/30', iconTone: 'bg-expense/10 text-expense' },
];
const fieldTypes = [
  { value: 'STRING', label: 'Text', icon: Type },
  { value: 'NUMBER', label: 'Number', icon: Hash },
  { value: 'BOOLEAN', label: 'Yes / No', icon: ToggleLeft },
];

let nextFieldId = 0;
const newField = () => ({ id: `field-${nextFieldId++}`, name: '', type: 'STRING', required: false });

function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2 text-xs text-muted-foreground focus-visible:outline-none"
    >
      <span className={cn('relative inline-flex h-4 w-7 shrink-0 items-center rounded-full transition-colors', checked ? 'bg-primary' : 'bg-muted-foreground/30')}>
        <span className={cn('absolute h-3 w-3 rounded-full bg-background shadow-sm transition-transform', checked ? 'translate-x-3.5' : 'translate-x-0.5')} />
      </span>
      {label}
    </button>
  );
}

export default function CategoryCreateModal({ initialType = 'income', onClose, onSubmit }) {
  const [type, setType] = useState(initialType);
  const [name, setName] = useState('');
  const [customFields, setCustomFields] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const addCustomField = () => setCustomFields((current) => [...current, newField()]);
  const updateCustomField = (id, key, value) => setCustomFields((current) => current.map((field) => field.id === id ? { ...field, [key]: value } : field));
  const removeCustomField = (id) => setCustomFields((current) => current.filter((field) => field.id !== id));
  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setError('');
    try {
      await onSubmit({ name: name.trim(), type, customFields: customFields.filter((field) => field.name.trim()).map((field) => ({ name: field.name.trim(), type: field.type, required: field.required })) });
      onClose();
    } catch (err) { setError(err.response?.data?.detail || 'Unable to create category'); } finally { setSaving(false); }
  };

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogDescription>Categories</DialogDescription><DialogTitle>Add category</DialogTitle></DialogHeader>
        <form className="grid gap-5" onSubmit={submit}>
          <div className="grid gap-1.5">
            <Label>Type</Label>
            <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Category type">
              {categoryTypes.map(({ value, label, hint, icon: Icon, active, iconTone }) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={type === value}
                  onClick={() => setType(value)}
                  className={cn('flex items-center gap-3 rounded-lg border p-3 text-left transition-all hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', type === value ? active : 'opacity-70 hover:opacity-100')}
                >
                  <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-md', iconTone)}><Icon className="h-4 w-4" /></span>
                  <span><span className="block text-sm font-medium">{label}</span><span className="block text-[11px] text-muted-foreground">{hint}</span></span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="category-name">Category name</Label>
            <Input id="category-name" autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder={type === 'income' ? 'e.g. Sales, Consulting, Rent received' : 'e.g. Rent, Utilities, Salaries'} required />
          </div>

          <div className="grid gap-2">
            <div className="flex items-end justify-between gap-3">
              <div>
                <Label>Custom fields <span className="font-normal text-muted-foreground">(optional)</span></Label>
                <p className="mt-0.5 text-[11px] text-muted-foreground">Extra details to capture on every entry, like an invoice number or vendor.</p>
              </div>
              {customFields.length > 0 && <Button type="button" variant="ghost" size="sm" onClick={addCustomField}><Plus /> Add field</Button>}
            </div>

            {customFields.length ? (
              <div className="grid gap-2">
                {customFields.map((field) => (
                  <div key={field.id} className="grid gap-2.5 rounded-lg border bg-muted/20 p-3">
                    <div className="flex items-center gap-2">
                      <Input className="h-9" value={field.name} onChange={(event) => updateCustomField(field.id, 'name', event.target.value)} placeholder="Field name, e.g. Invoice number" required aria-label="Field name" />
                      <Button className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive" type="button" variant="ghost" size="icon" onClick={() => removeCustomField(field.id)} title="Remove field"><X /></Button>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="inline-flex rounded-md border bg-background p-0.5" role="radiogroup" aria-label="Field type">
                        {fieldTypes.map(({ value, label, icon: Icon }) => (
                          <button
                            key={value}
                            type="button"
                            role="radio"
                            aria-checked={field.type === value}
                            onClick={() => updateCustomField(field.id, 'type', value)}
                            className={cn('inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs transition-colors', field.type === value ? 'bg-muted font-medium text-foreground' : 'text-muted-foreground hover:text-foreground')}
                          >
                            <Icon className="h-3.5 w-3.5" />{label}
                          </button>
                        ))}
                      </div>
                      <Switch checked={field.required} onChange={(value) => updateCustomField(field.id, 'required', value)} label="Required" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <button type="button" onClick={addCustomField} className="flex items-center justify-center gap-2 rounded-lg border border-dashed p-4 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:bg-accent/40 hover:text-foreground">
                <ListPlus className="h-4 w-4" /> Add a custom field
              </button>
            )}
          </div>

          {error && <p className="rounded-md border border-destructive/20 bg-destructive/10 p-2 text-xs text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saving}><Plus /> {saving ? 'Creating...' : 'Create category'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
