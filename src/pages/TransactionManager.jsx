import { Plus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { createTransaction, deleteTransaction, listTransactions, updateTransaction } from '../api/transactionApi';
import DateRangeFilter from '../components/filters/DateRangeFilter.jsx';
import DataPanel from '../components/layout/DataPanel.jsx';
import PageShell from '../components/layout/PageShell.jsx';
import TransactionCreateModal from '../components/modals/TransactionCreateModal.jsx';
import TransactionDetailModal from '../components/modals/TransactionDetailModal.jsx';
import TransactionTable from '../components/tables/TransactionTable.jsx';
import { useCategories } from '../hooks/useCategories.js';
import DateRangeModal from '../components/modals/DateRangeModal.jsx';
import { rangeForMode } from '../utils/dateRanges';
import ConfirmDialog from '../components/modals/ConfirmDialog.jsx';

export default function TransactionManager({ type, title }) {
  const { categories } = useCategories(type);
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [rangeMode, setRangeMode] = useState('all');
  const [dateRange, setDateRange] = useState({});
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

  const remove = async () => {
    if (!deleteTargetId) return;
    setDeleting(true);
    try {
      await deleteTransaction(type, deleteTargetId);
      await loadEntries();
      setDeleteTargetId(null);
    } finally {
      setDeleting(false);
    }
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

  const pageDescription = type === 'income'
    ? 'Review farm revenue entries, filter by reporting period, and add new income records.'
    : 'Review operating costs, filter by reporting period, and add new expense records.';

  return (
    <PageShell
      eyebrow="Transactions"
      title={title}
      description={pageDescription}
      actions={(
        <>
          <DateRangeFilter
            label={`${title} date range`}
            rangeMode={rangeMode}
            dateRange={dateRange}
            onChange={changeRange}
          />
          <button className="primary-button" type="button" onClick={() => setCreateModalOpen(true)}>
            <Plus size={17} /> Add {type}
          </button>
        </>
      )}
    >
      <DataPanel
        className="table-panel"
        title={`${title} ledger`}
        description={`${entries.length} ${entries.length === 1 ? 'entry' : 'entries'} in the current view.`}
      >
        {error && <p className="error-message">{error}</p>}
        {loading ? <div className="page-loader">Loading...</div> : <TransactionTable entries={entries} onView={setSelectedEntry} onDelete={setDeleteTargetId} />}
      </DataPanel>
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
      {deleteTargetId && (
        <ConfirmDialog
          confirmLabel="Delete entry"
          loading={deleting}
          message={`This ${type} entry will be permanently deleted. This action cannot be undone.`}
          onCancel={() => setDeleteTargetId(null)}
          onConfirm={remove}
          title="Delete entry?"
        />
      )}
    </PageShell>
  );
}
