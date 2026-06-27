import { FolderTree, Plus, ReceiptText, WalletCards } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createCategory, listCategories } from '../api/categoryApi';
import DataPanel from '../components/layout/DataPanel.jsx';
import MetricCard from '../components/layout/MetricCard.jsx';
import PageShell from '../components/layout/PageShell.jsx';
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
    <PageShell
      eyebrow="Configuration"
      title="Categories"
      description="Control the income and expense taxonomy that powers reports, entries, and custom fields."
      actions={(
        <button className="primary-button" type="button" onClick={() => setCreateModalOpen(true)}>
          <Plus size={17} /> Add category
        </button>
      )}
    >
      <div className="metric-grid compact">
        <MetricCard tone="income" icon={WalletCards} label="Income categories" value={incomeCategories.length} detail="Revenue classifications" />
        <MetricCard tone="expense" icon={ReceiptText} label="Expense categories" value={expenseCategories.length} detail="Cost classifications" />
        <MetricCard tone="balance" icon={FolderTree} label="Total categories" value={categories.length} detail="Available for entries" />
      </div>
      <DataPanel
        className="table-panel"
        title="Category directory"
        description="Manage labels and custom field counts used across transaction workflows."
      >
        {error && <p className="error-message">{error}</p>}
        {loading ? <div className="page-loader">Loading...</div> : <CategoryTable categories={categories} />}
      </DataPanel>
      {createModalOpen && (
        <CategoryCreateModal
          onClose={() => setCreateModalOpen(false)}
          onSubmit={submit}
        />
      )}
    </PageShell>
  );
}
