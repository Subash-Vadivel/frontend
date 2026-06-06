import { Plus, Save, Trash2, X } from 'lucide-react';
import { useState } from 'react';

export default function CategoryCreateModal({ onClose, onSubmit }) {
  const [type, setType] = useState('income');
  const [name, setName] = useState('');
  const [customFields, setCustomFields] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const addCustomField = () => {
    setCustomFields((current) => [...current, { name: '', type: 'STRING', required: false }]);
  };

  const updateCustomField = (index, field, value) => {
    setCustomFields((current) =>
      current.map((customField, itemIndex) =>
        itemIndex === index ? { ...customField, [field]: value } : customField,
      ),
    );
  };

  const removeCustomField = (index) => {
    setCustomFields((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSubmit({
        name,
        type,
        customFields: customFields
          .filter((field) => field.name.trim())
          .map((field) => ({
            name: field.name.trim(),
            type: field.type,
            required: field.required,
          })),
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to create category');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="modal-panel" role="dialog" aria-modal="true" aria-label="Add category" onMouseDown={(event) => event.stopPropagation()}>
        <form className="form-grid" onSubmit={submit}>
          <div className="modal-header span-2">
            <div>
              <span className="muted">New category</span>
              <h2>Add category</h2>
            </div>
            <button className="icon-button" type="button" onClick={onClose} title="Close">
              <X size={18} />
            </button>
          </div>

          <div className="segmented-control span-2">
            <button type="button" className={type === 'income' ? 'active' : ''} onClick={() => setType('income')}>Income</button>
            <button type="button" className={type === 'expense' ? 'active' : ''} onClick={() => setType('expense')}>Expense</button>
          </div>

          <label className="span-2">
            Category name
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Crop sale" required />
          </label>

          <div className="custom-field-builder span-2">
            <div className="section-title-row">
              <h2>Custom fields</h2>
              <button className="ghost-button" type="button" onClick={addCustomField}>
                <Plus size={16} /> Add field
              </button>
            </div>
            {customFields.map((field, index) => (
              <div className="custom-field-row" key={`${index}-${field.type}`}>
                <input
                  value={field.name}
                  onChange={(event) => updateCustomField(index, 'name', event.target.value)}
                  placeholder="Field name"
                  required
                />
                <select value={field.type} onChange={(event) => updateCustomField(index, 'type', event.target.value)}>
                  <option value="STRING">String</option>
                  <option value="NUMBER">Number</option>
                  <option value="BOOLEAN">Boolean</option>
                </select>
                <label className="checkbox-label compact-checkbox">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(event) => updateCustomField(index, 'required', event.target.checked)}
                  />
                  <span>Required</span>
                </label>
                <button className="icon-button danger" type="button" onClick={() => removeCustomField(index)} title="Remove field">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {!customFields.length && <p className="muted no-margin">No custom fields for this category.</p>}
          </div>

          {error && <p className="error-message span-2">{error}</p>}
          <button className="primary-button span-2" type="submit" disabled={saving}>
            <Save size={17} /> {saving ? 'Saving...' : 'Create category'}
          </button>
        </form>
      </section>
    </div>
  );
}
