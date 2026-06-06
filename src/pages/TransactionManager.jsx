import { Plus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { createTransaction, deleteTransaction, listTransactions, updateTransaction } from '../api/transactionApi';
import DateRangeFilter from '../components/filters/DateRangeFilter.jsx';
import TransactionCreateModal from '../components/modals/TransactionCreateModal.jsx';
import TransactionDetailModal from '../components/modals/TransactionDetailModal.jsx';
import TransactionTable from '../components/tables/TransactionTable.jsx';
import { useCategories } from '../hooks/useCategories.js';
import DateRangeModal from '../components/modals/DateRangeModal.jsx';
import { rangeForMode, thisMonthRange } from '../utils/dateRanges';

export default function TransactionManager({ type, title }) {
  const { categories } = useCategories(type);
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [rangeMode, setRangeMode] = useState('thisMonth');
  const [dateRange, setDateRange] = useState(() => thisMonthRange());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadEntries = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setEntries(await listTransactions(type, dateRange));
    } catch (err) {
      setError(err.response?.data?.detail || `Unable to load ${title.toLowerCase()}`);
    } finally {
      setLoading(false);
    }
  }, [dateRange, title, type]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const submit = async (payload) => {
    await createTransaction(type, payload);
    await loadEntries();
    setCreateModalOpen(false);
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

  const changeRange = (value) => {
    if (value === 'custom') {
      setCustomModalOpen(true);
      return;
    }
    setRangeMode(value);
    setDateRange(rangeForMode(value));
  };

  const applyCustomRange = (range) => {
    setRangeMode('custom');
    setDateRange(range);
    setCustomModalOpen(false);
  };

  return (
    <section className="page-stack">
      <header className="page-header">
        <h1>{title}</h1>
        <div className="page-actions">
          <DateRangeFilter
            label={`${title} date range`}
            rangeMode={rangeMode}
            dateRange={dateRange}
            onChange={changeRange}
          />
          <button className="primary-button" type="button" onClick={() => setCreateModalOpen(true)}>
            <Plus size={17} /> Add {type}
          </button>
        </div>
      </header>
      <div className="panel">
        <h2>{title} entries</h2>
        {error && <p className="error-message">{error}</p>}
        {loading ? <div className="page-loader">Loading...</div> : <TransactionTable entries={entries} onView={setSelectedEntry} onDelete={remove} />}
      </div>
      {createModalOpen && (
        <TransactionCreateModal
          type={type}
          categories={categories}
          onClose={() => setCreateModalOpen(false)}
          onSubmit={submit}
        />
      )}
      {customModalOpen && (
        <DateRangeModal
          initialRange={dateRange}
          onApply={applyCustomRange}
          onClose={() => setCustomModalOpen(false)}
        />
      )}
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
