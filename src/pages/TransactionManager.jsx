import { useCallback, useEffect, useState } from 'react';
import { createTransaction, deleteTransaction, listTransactions, updateTransaction } from '../api/transactionApi';
import TransactionForm from '../components/forms/TransactionForm.jsx';
import TransactionDetailModal from '../components/modals/TransactionDetailModal.jsx';
import TransactionTable from '../components/tables/TransactionTable.jsx';
import { useCategories } from '../hooks/useCategories.js';

export default function TransactionManager({ type, title }) {
  const { categories } = useCategories(type);
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadEntries = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setEntries(await listTransactions(type));
    } catch (err) {
      setError(err.response?.data?.detail || `Unable to load ${title.toLowerCase()}`);
    } finally {
      setLoading(false);
    }
  }, [title, type]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const submit = async (payload) => {
    await createTransaction(type, payload);
    await loadEntries();
  };

  const saveFromModal = async (id, payload) => {
    await updateTransaction(type, id, payload);
    await loadEntries();
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this entry?')) return;
    await deleteTransaction(type, id);
    await loadEntries();
  };

  return (
    <section className="page-stack">
      <header className="page-header"><h1>{title}</h1></header>
      <TransactionForm
        type={type}
        categories={categories}
        onSubmit={submit}
      />
      <div className="panel">
        <h2>{title} entries</h2>
        {error && <p className="error-message">{error}</p>}
        {loading ? <div className="page-loader">Loading...</div> : <TransactionTable entries={entries} onView={setSelectedEntry} onDelete={remove} />}
      </div>
      <TransactionDetailModal
        entry={selectedEntry}
        categories={categories}
        type={type}
        onClose={() => setSelectedEntry(null)}
        onSave={saveFromModal}
      />
    </section>
  );
}
