import { Plus } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createCategory, listCategories } from '../api/categoryApi';
import CategoryCreateModal from '../components/modals/CategoryCreateModal.jsx';
import CategoryTable from '../components/tables/CategoryTable.jsx';

export default function CategoryPage() {
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [income, expense] = await Promise.all([
        listCategories('income'),
        listCategories('expense'),
      ]);
      setIncomeCategories(income);
      setExpenseCategories(expense);
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const categories = useMemo(
    () => [...incomeCategories, ...expenseCategories].sort((a, b) => {
      const typeSort = a.type.localeCompare(b.type);
      return typeSort || a.name.localeCompare(b.name);
    }),
    [expenseCategories, incomeCategories],
  );

  const submit = async (payload) => {
    await createCategory(payload);
    await loadCategories();
  };

  return (
    <section className="page-stack">
      <header className="page-header">
        <h1>Categories</h1>
        <button className="primary-button" type="button" onClick={() => setCreateModalOpen(true)}>
          <Plus size={17} /> Add category
        </button>
      </header>
      <div className="panel">
        <h2>All categories</h2>
        {error && <p className="error-message">{error}</p>}
        {loading ? <div className="page-loader">Loading...</div> : <CategoryTable categories={categories} />}
      </div>
      {createModalOpen && (
        <CategoryCreateModal
          onClose={() => setCreateModalOpen(false)}
          onSubmit={submit}
        />
      )}
    </section>
  );
}
