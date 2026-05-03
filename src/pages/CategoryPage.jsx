import { Plus } from 'lucide-react';
import { useState } from 'react';
import { createCategory } from '../api/categoryApi';
import { useCategories } from '../hooks/useCategories.js';

export default function CategoryPage() {
  const [type, setType] = useState('income');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { categories, loading, refresh } = useCategories(type);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await createCategory({ name, type });
      setName('');
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
        {error && <p className="error-message">{error}</p>}
        <button className="primary-button" type="submit"><Plus size={17} /> Create category</button>
      </form>
      <div className="panel">
        <h2>{type === 'income' ? 'Income' : 'Expense'} categories</h2>
        {loading ? <div className="page-loader">Loading...</div> : (
          <div className="category-list">
            {categories.length ? categories.map((category) => <span key={category.id}>{category.name}</span>) : <div className="empty-state compact">No categories yet.</div>}
          </div>
        )}
      </div>
    </section>
  );
}
