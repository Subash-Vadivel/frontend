import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { createCategory } from '../api/categoryApi';
import { useCategories } from '../hooks/useCategories.js';

export default function CategoryPage() {
  const [type, setType] = useState('income');
  const [name, setName] = useState('');
  const [customFields, setCustomFields] = useState([]);
  const [error, setError] = useState('');
  const { categories, loading, refresh } = useCategories(type);

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
    setError('');
    try {
      await createCategory({
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
      setName('');
      setCustomFields([]);
      await refresh();
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to create category');
    }
  };

  return (
    <section className="page-stack">
      <header className="page-header"><h1>Categories</h1></header>
      <form className="panel category-form" onSubmit={submit}>
        <div className="segmented-control">
          <button type="button" className={type === 'income' ? 'active' : ''} onClick={() => setType('income')}>Income</button>
          <button type="button" className={type === 'expense' ? 'active' : ''} onClick={() => setType('expense')}>Expense</button>
        </div>
        <label>
          Category name
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Crop sale" required />
        </label>
        <div className="custom-field-builder">
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
        {error && <p className="error-message">{error}</p>}
        <button className="primary-button" type="submit"><Plus size={17} /> Create category</button>
      </form>
      <div className="panel">
        <h2>{type === 'income' ? 'Income' : 'Expense'} categories</h2>
        {loading ? <div className="page-loader">Loading...</div> : (
          <div className="category-list">
            {categories.length ? categories.map((category) => (
              <article className="category-pill" key={category.id}>
                <strong>{category.name}</strong>
                <small>{category.customFields?.length || 0} custom fields</small>
              </article>
            )) : <div className="empty-state compact">No categories yet.</div>}
          </div>
        )}
      </div>
    </section>
  );
}
