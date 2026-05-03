import { useEffect, useState } from 'react';
import { createTransaction, deleteTransaction, listTransactions, updateTransaction } from '../api/transactionApi';
import TransactionForm from '../components/forms/TransactionForm.jsx';
import TransactionTable from '../components/tables/TransactionTable.jsx';
import { useCategories } from '../hooks/useCategories.js';

export default function TransactionManager({ type, title }) {
  const { categories, addCategory } = useCategories(type);
  const [entries, setEntries] = useState([]);
  const [editingEntry, setEditingEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadEntries = async () => {
    setLoading(true);
    setError('');
    try {
      setEntries(await listTransactions(type));
    } catch (err) {
      setError(err.response?.data?.detail || `Unable to load ${title.toLowerCase()}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, [type]);

  const submit = async (payload) => {
    if (editingEntry) {
      await updateTransaction(type, editingEntry.id, payload);
      setEditingEntry(null);
    } else {
      await createTransaction(type, payload);
    }
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
        onCreateCategory={addCategory}
        onSubmit={submit}
        editingEntry={editingEntry}
        onCancel={() => setEditingEntry(null)}
      />
      <div className="panel">
        <h2>{title} entries</h2>
        {error && <p className="error-message">{error}</p>}
        {loading ? <div className="page-loader">Loading...</div> : <TransactionTable entries={entries} onEdit={setEditingEntry} onDelete={remove} />}
      </div>
    </section>
  );
}
