import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function CategoryInlineCreate({ onCreate }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError('');
    try {
      await onCreate(name.trim());
      setName('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to create category');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="inline-create" onSubmit={submit}>
      <input value={name} onChange={(event) => setName(event.target.value)} placeholder="New category" />
      <button type="submit" disabled={saving || !name.trim()} title="Create category">
        <Plus size={16} />
      </button>
      {error && <span className="field-error">{error}</span>}
    </form>
  );
}
