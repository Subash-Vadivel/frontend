import { Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import CategoryInlineCreate from './CategoryInlineCreate.jsx';

const emptyForm = {
  date: new Date().toISOString().slice(0, 10),
  categoryId: '',
  description: '',
  amount: '',
};

export default function TransactionForm({ type, categories, onCreateCategory, onSubmit, editingEntry, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingEntry) {
      setForm({
        date: editingEntry.date,
        categoryId: editingEntry.categoryId,
        description: editingEntry.description || '',
        amount: String(editingEntry.amount),
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingEntry]);

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleCreateCategory = async (name) => {
    const category = await onCreateCategory(name);
    updateField('categoryId', category.id);
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSubmit({
        date: form.date,
        categoryId: form.categoryId,
        description: form.description.trim() || null,
        amount: Number(form.amount),
      });
      if (!editingEntry) setForm(emptyForm);
    } catch (err) {
      setError(err.response?.data?.detail || `Unable to save ${type} entry`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="panel form-grid" onSubmit={submit}>
      <div className="form-header">
        <h2>{editingEntry ? 'Edit' : 'Add'} {type}</h2>
        {editingEntry && (
          <button className="ghost-button" type="button" onClick={onCancel}>
            <X size={16} /> Cancel
          </button>
        )}
      </div>
      <label>
        Date
        <input type="date" value={form.date} onChange={(event) => updateField('date', event.target.value)} required />
      </label>
      <label>
        Category
        <select value={form.categoryId} onChange={(event) => updateField('categoryId', event.target.value)} required>
          <option value="">Select category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </label>
      <CategoryInlineCreate onCreate={handleCreateCategory} />
      <label>
        Amount
        <input type="number" min="0.01" step="0.01" value={form.amount} onChange={(event) => updateField('amount', event.target.value)} required />
      </label>
      <label className="span-2">
        Description
        <input value={form.description} onChange={(event) => updateField('description', event.target.value)} placeholder="Optional note" />
      </label>
      {error && <p className="error-message span-2">{error}</p>}
      <button className="primary-button span-2" type="submit" disabled={saving}>
        <Save size={17} /> {saving ? 'Saving...' : 'Save entry'}
      </button>
    </form>
  );
}
