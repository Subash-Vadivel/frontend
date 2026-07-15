import { Plus, Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createTransaction, deleteTransaction, listTransactions, updateTransaction } from '../api/transactionApi';
import DateRangeFilter from '../components/filters/DateRangeFilter.jsx';
import DataPanel from '../components/layout/DataPanel.jsx';
import MetricCard from '../components/layout/MetricCard.jsx';
import PageShell from '../components/layout/PageShell.jsx';
import TransactionCreateModal from '../components/modals/TransactionCreateModal.jsx';
import TransactionDetailModal from '../components/modals/TransactionDetailModal.jsx';
import TransactionTable from '../components/tables/TransactionTable.jsx';
import { useCategories } from '../hooks/useCategories.js';
import DateRangeModal from '../components/modals/DateRangeModal.jsx';
import { rangeForMode } from '../utils/dateRanges';
import ConfirmDialog from '../components/modals/ConfirmDialog.jsx';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Skeleton } from '../components/ui/skeleton.jsx';
import { formatCurrency } from '../utils/formatters.js';

export default function TransactionManager({ type, title }) {
  const { categories } = useCategories(type);
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [rangeMode, setRangeMode] = useState('all');
  const [dateRange, setDateRange] = useState({});
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const loadEntries = useCallback(async () => { setLoading(true); setError(''); try { setEntries(await listTransactions(type, dateRange)); } catch (err) { setError(err.response?.data?.detail || `Unable to load ${title.toLowerCase()}`); } finally { setLoading(false); } }, [dateRange, title, type]);
  useEffect(() => { loadEntries(); }, [loadEntries]);
  useEffect(() => { const params = new URLSearchParams(location.search); if (params.get('action') === 'create') { setCreateModalOpen(true); navigate(location.pathname, { replace: true }); } const entryId = params.get('entry'); if (entryId && entries.length) { const match = entries.find((entry) => String(entry.id) === entryId); if (match) setSelectedEntry(match); navigate(location.pathname, { replace: true }); } }, [entries, location.pathname, location.search, navigate]);
  useEffect(() => { const handler = (event) => { if (event.key === '/' && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)) { event.preventDefault(); searchRef.current?.focus(); } }; window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler); }, []);
  const submit = async (payload) => { await createTransaction(type, payload); await loadEntries(); setCreateModalOpen(false); };
  const saveFromModal = async (id, payload) => { await updateTransaction(type, id, payload); await loadEntries(); };
  const remove = async () => { if (!deleteTargetId) return; setDeleting(true); try { await deleteTransaction(type, deleteTargetId); await loadEntries(); setDeleteTargetId(null); } finally { setDeleting(false); } };
  const changeRange = (value) => { if (value === 'custom') { setCustomModalOpen(true); return; } setRangeMode(value); setDateRange(rangeForMode(value)); };
  const applyCustomRange = (range) => { setRangeMode('custom'); setDateRange(range); setCustomModalOpen(false); };
  const stats = useMemo(() => { const total = entries.reduce((sum, entry) => sum + Number(entry.amount || 0), 0); const avg = entries.length ? total / entries.length : 0; const categoriesUsed = new Set(entries.map((entry) => entry.categoryName)).size; return { total, avg, categoriesUsed }; }, [entries]);
  const pageDescription = type === 'income' ? 'Revenue ledger with fast search, date filters, and category-level review.' : 'Expense ledger for operating costs, vendor notes, and category control.';
  return (
    <PageShell eyebrow="Ledger" title={title} description={pageDescription} actions={<><DateRangeFilter label={`${title} date range`} rangeMode={rangeMode} dateRange={dateRange} onChange={changeRange} /><Button type="button" onClick={() => setCreateModalOpen(true)}><Plus /> New {type}</Button></>}>
      <div className="grid gap-3 md:grid-cols-3"><MetricCard label="Total value" value={formatCurrency(stats.total)} detail="Across current view" tone={type === 'income' ? 'income' : 'expense'} /><MetricCard label="Average record" value={formatCurrency(stats.avg)} detail="Mean transaction size" /><MetricCard label="Categories used" value={stats.categoriesUsed} detail={`${categories.length} configured`} /></div>
      <DataPanel title={`${title} ledger`} description={`${entries.length} ${entries.length === 1 ? 'entry' : 'entries'} loaded. Press / to search this table.`} action={<div className="relative w-full sm:w-72"><Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" /><Input ref={searchRef} className="pl-8" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search ledger..." /></div>}>
        {error && <p className="mb-3 rounded-md border border-destructive/20 bg-destructive/10 p-2 text-xs text-destructive">{error}</p>}
        {loading ? <Skeleton className="h-72" /> : <TransactionTable entries={entries} query={query} onView={setSelectedEntry} onDelete={setDeleteTargetId} />}
      </DataPanel>
      {createModalOpen && <TransactionCreateModal type={type} categories={categories} onClose={() => setCreateModalOpen(false)} onSubmit={submit} />}
      {customModalOpen && <DateRangeModal initialRange={dateRange} onApply={applyCustomRange} onClose={() => setCustomModalOpen(false)} />}
      <TransactionDetailModal entry={selectedEntry} categories={categories} type={type} onClose={() => setSelectedEntry(null)} onSave={saveFromModal} />
      {deleteTargetId && <ConfirmDialog confirmLabel="Delete entry" loading={deleting} message={`This ${type} entry will be permanently deleted. This action cannot be undone.`} onCancel={() => setDeleteTargetId(null)} onConfirm={remove} title="Delete entry?" />}
    </PageShell>
  );
}
