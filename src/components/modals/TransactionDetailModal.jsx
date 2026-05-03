import { Save, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import CustomFieldInputs from '../forms/CustomFieldInputs.jsx';
import { customValuesArrayToMap, customValuesMapToPayload, valueForDisplay } from '../../utils/customFields.js';

export default function TransactionDetailModal({ entry, categories, type, onClose, onSave }) {
  const [form, setForm] = useState({
    date: '',
    categoryId: '',
    description: '',
    amount: '',
  });
  const [customValues, setCustomValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!entry) return;
    setForm({
      date: entry.date,
      categoryId: entry.categoryId,
      description: entry.description || '',
      amount: String(entry.amount),
    });
    setCustomValues(customValuesArrayToMap(entry.customFieldValues));
    setError('');
  }, [entry]);

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === form.categoryId),
    [categories, form.categoryId],
  );

  if (!entry) return null;

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const updateCustomField = (fieldId, value) => setCustomValues((current) => ({ ...current, [fieldId]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSave(entry.id, {
        date: form.date,
        categoryId: form.categoryId,
        description: form.description.trim() || null,
        amount: Number(form.amount),
        customFieldValues: customValuesMapToPayload(selectedCategory, customValues),
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || `Unable to update ${type} entry`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="modal-panel" role="dialog" aria-modal="true" aria-label={`${type} entry details`} onMouseDown={(event) => event.stopPropagation()}>
        <form className="form-grid" onSubmit={submit}>
          <div className="modal-header span-2">
            <div>
              <span className="muted">Entry details</span>
              <h2>{entry.categoryName}</h2>
            </div>
            <button className="icon-button" type="button" onClick={onClose} title="Close">
              <X size={18} />
            </button>
          </div>

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
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </label>
          <label>
            Amount
            <input type="number" min="0.01" step="0.01" value={form.amount} onChange={(event) => updateField('amount', event.target.value)} required />
          </label>
          <label>
            Description
            <input value={form.description} onChange={(event) => updateField('description', event.target.value)} placeholder="Optional note" />
          </label>

          <CustomFieldInputs
            fields={selectedCategory?.customFields || []}
            values={customValues}
            onChange={updateCustomField}
          />

          {entry.customFieldValues?.length > 0 && (
            <div className="custom-field-readout span-2">
              <h3>Saved custom values</h3>
              {entry.customFieldValues.map((value) => (
                <div key={value.fieldId}>
                  <span>{value.fieldName}</span>
                  <strong>{valueForDisplay(value)}</strong>
                </div>
              ))}
            </div>
          )}

          {error && <p className="error-message span-2">{error}</p>}
          <button className="primary-button span-2" type="submit" disabled={saving}>
            <Save size={17} /> {saving ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </section>
    </div>
  );
}
