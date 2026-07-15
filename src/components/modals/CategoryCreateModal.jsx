import { Plus, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button.jsx';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog.jsx';
import { Input } from '../ui/input.jsx';
import { Label } from '../ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select.jsx';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs.jsx';

export default function CategoryCreateModal({ onClose, onSubmit }) {
  const [type, setType] = useState('income');
  const [name, setName] = useState('');
  const [customFields, setCustomFields] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const addCustomField = () => setCustomFields((current) => [...current, { name: '', type: 'STRING', required: false }]);
  const updateCustomField = (index, field, value) => setCustomFields((current) => current.map((customField, itemIndex) => itemIndex === index ? { ...customField, [field]: value } : customField));
  const removeCustomField = (index) => setCustomFields((current) => current.filter((_, itemIndex) => itemIndex !== index));
  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setError('');
    try {
      await onSubmit({ name, type, customFields: customFields.filter((field) => field.name.trim()).map((field) => ({ name: field.name.trim(), type: field.type, required: field.required })) });
      onClose();
    } catch (err) { setError(err.response?.data?.detail || 'Unable to create category'); } finally { setSaving(false); }
  };
  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent>
        <DialogHeader><DialogDescription>New category</DialogDescription><DialogTitle>Add category</DialogTitle></DialogHeader>
        <form className="grid gap-4" onSubmit={submit}>
          <Tabs value={type} onValueChange={setType}><TabsList className="grid w-full grid-cols-2"><TabsTrigger value="income">Income</TabsTrigger><TabsTrigger value="expense">Expense</TabsTrigger></TabsList></Tabs>
          <div className="grid gap-2"><Label>Category name</Label><Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Crop sale" required /></div>
          <div className="grid gap-3 rounded-lg border border-dashed bg-muted/30 p-4">
            <div className="flex items-center justify-between gap-3"><h3 className="text-sm font-medium">Custom fields</h3><Button type="button" variant="outline" size="sm" onClick={addCustomField}><Plus /> Add field</Button></div>
            {customFields.map((field, index) => (
              <div className="grid gap-2 md:grid-cols-[1fr_150px_120px_40px] md:items-center" key={`${index}-${field.type}`}>
                <Input value={field.name} onChange={(event) => updateCustomField(index, 'name', event.target.value)} placeholder="Field name" required />
                <Select value={field.type} onValueChange={(value) => updateCustomField(index, 'type', value)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="STRING">String</SelectItem><SelectItem value="NUMBER">Number</SelectItem><SelectItem value="BOOLEAN">Boolean</SelectItem></SelectContent></Select>
                <Label className="flex h-10 items-center gap-2"><input className="h-4 w-4 accent-primary" type="checkbox" checked={field.required} onChange={(event) => updateCustomField(index, 'required', event.target.checked)} /> Required</Label>
                <Button className="text-destructive hover:text-destructive" type="button" variant="ghost" size="icon" onClick={() => removeCustomField(index)} title="Remove field"><Trash2 /></Button>
              </div>
            ))}
            {!customFields.length && <p className="text-sm text-muted-foreground">No custom fields for this category.</p>}
          </div>
          {error && <p className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={saving}><Save /> {saving ? 'Saving...' : 'Create category'}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
