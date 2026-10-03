import { Calculator, FolderTree, Plus, Search, TrendingDown, TrendingUp } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createTransaction, deleteTransaction, getTransaction, listTransactions, updateTransaction } from '../api/transactionApi';
import DateRangeFilter from '../components/filters/DateRangeFilter.jsx';
import DataPanel from '../components/layout/DataPanel.jsx';
import MetricCard from '../components/layout/MetricCard.jsx';
import PageShell from '../components/layout/PageShell.jsx';
import TransactionCreateModal from '../components/modals/TransactionCreateModal.jsx';
import TransactionDetailModal from '../components/modals/TransactionDetailModal.jsx';
import TransactionTable from '../components/tables/TransactionTable.jsx';
import { useBusiness } from '../context/BusinessContext.jsx';
import { useCategories } from '../hooks/useCategories.js';
import DateRangeModal from '../components/modals/DateRangeModal.jsx';
import { rangeForMode } from '../utils/dateRanges';
import ConfirmDialog from '../components/modals/ConfirmDialog.jsx';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Loader } from '../components/ui/loader.jsx';
import { Pagination } from '../components/ui/pagination.jsx';
import { formatCurrency } from '../utils/formatters.js';

const PAGE_SIZE = 25;
const SEARCH_DEBOUNCE_MS = 300;
const emptySummary = { count: 0, totalAmount: 0, averageAmount: 0, categoriesUsed: 0 };

export default function TransactionManager({ type, title }) {
  const { categories } = useCategories(type);
  const { canWriteFinance } = useBusiness();
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const [page, setPage] = useState(null);
  const [offset, setOffset] = useState(0);
  const [sort, setSort] = useState({ key: 'date', dir: 'desc' });
  const [search, setSearch] = useState('');
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
  const loadEntries = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const nextPage = await listTransactions(type, dateRange, { limit: PAGE_SIZE, offset, search, sort: sort.key, order: sort.dir });
      // Deleting the last row on a page leaves it empty; step back instead of showing a blank page.
      if (!nextPage.items.length && offset > 0) { setOffset(Math.max(0, offset - PAGE_SIZE)); return; }
      setPage(nextPage);
    } catch (err) { setError(err.response?.data?.detail || `Unable to load ${title.toLowerCase()}`); }
    finally { setLoading(false); }
  }, [dateRange, offset, search, sort, title, type]);
  useEffect(() => { loadEntries(); }, [loadEntries]);
  useEffect(() => { const timer = setTimeout(() => { setSearch(query.trim()); setOffset(0); }, SEARCH_DEBOUNCE_MS); return () => clearTimeout(timer); }, [query]);
  const entries = page?.items || [];
  const summary = page?.summary || emptySummary;
  const changeSort = (nextSort) => { setSort(nextSort); setOffset(0); };
  useEffect(() => { const params = new URLSearchParams(location.search); if (params.get('action') === 'create') { setCreateModalOpen(true); navigate(location.pathname, { replace: true }); } const entryId = params.get('entry'); if (entryId) { navigate(location.pathname, { replace: true }); getTransaction(type, entryId).then(setSelectedEntry).catch(() => setError('That entry could not be found.')); } }, [location.pathname, location.search, navigate, type]);
  useEffect(() => { const handler = (event) => { if (event.key === '/' && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)) { event.preventDefault(); searchRef.current?.focus(); } }; window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler); }, []);
  const submit = async (payload) => { await createTransaction(type, payload); await loadEntries(); setCreateModalOpen(false); };
  const saveFromModal = async (id, payload) => { await updateTransaction(type, id, payload); await loadEntries(); };
  const remove = async () => { if (!deleteTargetId) return; setDeleting(true); try { await deleteTransaction(type, deleteTargetId); await loadEntries(); setDeleteTargetId(null); } finally { setDeleting(false); } };
  const changeRange = (value) => { if (value === 'custom') { setCustomModalOpen(true); return; } setRangeMode(value); setDateRange(rangeForMode(value)); setOffset(0); };
  const applyCustomRange = (range) => { setRangeMode('custom'); setDateRange(range); setOffset(0); setCustomModalOpen(false); };
  const pageDescription = type === 'income' ? 'Revenue ledger with fast search, date filters, and category-level review.' : 'Expense ledger for operating costs, vendor notes, and category control.';
  return (
    <PageShell eyebrow="Ledger" title={title} description={pageDescription} actions={<><DateRangeFilter label={`${title} date range`} rangeMode={rangeMode} dateRange={dateRange} onChange={changeRange} />{canWriteFinance && <Button type="button" onClick={() => setCreateModalOpen(true)}><Plus /> New {type}</Button>}</>}>
      <div className="grid gap-3 md:grid-cols-3"><MetricCard icon={type === 'income' ? TrendingUp : TrendingDown} tone={type === 'income' ? 'income' : 'expense'} label={type === 'income' ? 'Total income' : 'Total expense'} value={formatCurrency(summary.totalAmount)} detail={`${summary.count} ${summary.count === 1 ? 'entry' : 'entries'}${search ? ' matching search' : ' in this period'}`} /><MetricCard icon={Calculator} tone="balance" label="Average per entry" value={formatCurrency(summary.averageAmount)} detail={summary.count ? 'Total ÷ number of entries' : 'No entries yet'} /><MetricCard icon={FolderTree} label="Categories used" value={summary.categoriesUsed} detail={`of ${categories.length} ${type} ${categories.length === 1 ? 'category' : 'categories'}`} /></div>
      <DataPanel title={`${title} ledger`} description="Search by description or category. Press / to jump to search." action={<div className="relative w-full sm:w-72"><Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" /><Input ref={searchRef} className="pl-8" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search ledger..." /></div>}>
        {error && <p className="mb-3 rounded-md border border-destructive/20 bg-destructive/10 p-2 text-xs text-destructive">{error}</p>}
        {!page && loading ? <Loader className="min-h-72" /> : <div className={loading ? 'pointer-events-none opacity-60 transition-opacity' : 'transition-opacity'}><TransactionTable entries={entries} sort={sort} onSortChange={changeSort} onView={setSelectedEntry} onDelete={setDeleteTargetId} canDelete={canWriteFinance} emptyMessage={search ? 'No entries match this search.' : 'No entries in this period yet.'} /><Pagination total={page?.total || 0} limit={PAGE_SIZE} offset={offset} onOffsetChange={setOffset} disabled={loading} /></div>}
      </DataPanel>
      {canWriteFinance && createModalOpen && <TransactionCreateModal type={type} categories={categories} onClose={() => setCreateModalOpen(false)} onSubmit={submit} />}
      {customModalOpen && <DateRangeModal initialRange={dateRange} onApply={applyCustomRange} onClose={() => setCustomModalOpen(false)} />}
      <TransactionDetailModal entry={selectedEntry} categories={categories} type={type} onClose={() => setSelectedEntry(null)} onSave={saveFromModal} />
      {canWriteFinance && deleteTargetId && <ConfirmDialog confirmLabel="Delete entry" loading={deleting} message={`This ${type} entry will be permanently deleted. This action cannot be undone.`} onCancel={() => setDeleteTargetId(null)} onConfirm={remove} title="Delete entry?" />}
    </PageShell>
  );
}
