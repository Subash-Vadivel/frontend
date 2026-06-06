import { Save } from 'lucide-react';
import { useMemo, useState } from 'react';
import CustomFieldInputs from './CustomFieldInputs.jsx';
import { customValuesMapToPayload } from '../../utils/customFields.js';

const emptyForm = {
  date: new Date().toISOString().slice(0, 10),
  categoryId: '',
  description: '',
  amount: '',
};

export default function TransactionForm({
  type,
  categories,
  onSubmit,
  className = 'panel form-grid',
  heading = `Add ${type}`,
}) {
  const [form, setForm] = useState(emptyForm);
  const [customValues, setCustomValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === form.categoryId),
    [categories, form.categoryId],
  );

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const updateCustomField = (fieldId, value) => setCustomValues((current) => ({ ...current, [fieldId]: value }));

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
        customFieldValues: customValuesMapToPayload(selectedCategory, customValues),
      });
      setForm(emptyForm);
      setCustomValues({});
    } catch (err) {
      setError(err.response?.data?.detail || `Unable to save ${type} entry`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className={className} onSubmit={submit}>
      {heading && (
        <div className="form-header">
          <h2>{heading}</h2>
        </div>
      )}
      <label>
        Date
        <input type="date" value={form.date} onChange={(event) => updateField('date', event.target.value)} required />
      </label>
      <label>
        Category
        <select
          value={form.categoryId}
          onChange={(event) => {
            updateField('categoryId', event.target.value);
            setCustomValues({});
          }}
          required
        >
          <option value="">Select category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </label>
      <label>
        Amount
        <input type="number" min="0.01" step="0.01" value={form.amount} onChange={(event) => updateField('amount', event.target.value)} required />
      </label>
      <label className="span-2">
        Description
        <input value={form.description} onChange={(event) => updateField('description', event.target.value)} placeholder="Optional note" />
      </label>
      <CustomFieldInputs
        fields={selectedCategory?.customFields || []}
        values={customValues}
        onChange={updateCustomField}
      />
      {error && <p className="error-message span-2">{error}</p>}
      <button className="primary-button span-2" type="submit" disabled={saving}>
        <Save size={17} /> {saving ? 'Saving...' : 'Save entry'}
      </button>
    </form>
  );
}
