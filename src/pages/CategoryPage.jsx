import { FolderTree, ListChecks, Plus, ReceiptText, Search, WalletCards } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { createCategory, deleteCategory, listAllCategories } from '../api/categoryApi';
import DataPanel from '../components/layout/DataPanel.jsx';
import MetricCard from '../components/layout/MetricCard.jsx';
import PageShell from '../components/layout/PageShell.jsx';
import CategoryCreateModal from '../components/modals/CategoryCreateModal.jsx';
import ConfirmDialog from '../components/modals/ConfirmDialog.jsx';
import { getErrorMessage } from '../lib/utils.js';
import CategoryTable from '../components/tables/CategoryTable.jsx';
import { Button } from '../components/ui/button.jsx';
import { useBusiness } from '../context/BusinessContext.jsx';
import { Input } from '../components/ui/input.jsx';
import { Loader } from '../components/ui/loader.jsx';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs.jsx';
export default function CategoryPage() {
  const { canWriteFinance } = useBusiness();
  const [incomeCategories, setIncomeCategories] = useState([]); const [expenseCategories, setExpenseCategories] = useState([]); const [createModalOpen, setCreateModalOpen] = useState(false); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const [typeView, setTypeView] = useState('all'); const [query, setQuery] = useState(''); const [deleteTarget, setDeleteTarget] = useState(null); const [deleting, setDeleting] = useState(false);
  const loadCategories = useCallback(async () => { setLoading(true); setError(''); try { const [income, expense] = await Promise.all([listAllCategories('income'), listAllCategories('expense')]); setIncomeCategories(income); setExpenseCategories(expense); } catch (err) { setError(err.response?.data?.detail || 'Unable to load categories'); } finally { setLoading(false); } }, []);
  useEffect(() => { loadCategories(); }, [loadCategories]);
  const categories = useMemo(() => [...incomeCategories, ...expenseCategories].sort((a, b) => { const typeSort = a.type.localeCompare(b.type); return typeSort || a.name.localeCompare(b.name); }), [expenseCategories, incomeCategories]);
  const filtered = useMemo(() => categories.filter((category) => (typeView === 'all' || category.type === typeView) && (!query.trim() || `${category.name} ${category.type}`.toLowerCase().includes(query.toLowerCase()))), [categories, query, typeView]);
  const customFieldCount = categories.reduce((sum, category) => sum + (category.customFields?.length || 0), 0);
  const submit = async (payload) => { await createCategory(payload); await loadCategories(); };
  const removeCategory = async () => {
    setDeleting(true);
    try { await deleteCategory(deleteTarget.id); toast.success(`Category "${deleteTarget.name}" deleted`); await loadCategories(); }
    catch (err) { toast.error(getErrorMessage(err, 'Unable to delete category')); }
    finally { setDeleting(false); setDeleteTarget(null); }
  };
  return <PageShell eyebrow="Configuration" title="Category workspace" description="Maintain the taxonomy that powers ledgers, custom fields, and reporting." actions={canWriteFinance ? <Button type="button" onClick={() => setCreateModalOpen(true)}><Plus /> New category</Button> : null}>
    <div className="grid gap-3 md:grid-cols-4"><MetricCard tone="income" icon={WalletCards} label="Income" value={incomeCategories.length} detail="Revenue classes" /><MetricCard tone="expense" icon={ReceiptText} label="Expenses" value={expenseCategories.length} detail="Cost classes" /><MetricCard tone="balance" icon={FolderTree} label="Total" value={categories.length} detail="Configured categories" /><MetricCard icon={ListChecks} label="Custom fields" value={customFieldCount} detail="Structured metadata" /></div>
    <DataPanel title="Category directory" description="Filter and review category structure before recording entries." action={<div className="flex flex-wrap items-center gap-2"><Tabs value={typeView} onValueChange={setTypeView}><TabsList><TabsTrigger value="all">All</TabsTrigger><TabsTrigger value="income">Income</TabsTrigger><TabsTrigger value="expense">Expense</TabsTrigger></TabsList></Tabs><div className="relative w-64"><Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" /><Input className="pl-8" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search categories..." /></div></div>}>
      {error && <p className="mb-3 rounded-md border border-destructive/20 bg-destructive/10 p-2 text-xs text-destructive">{error}</p>}{loading ? <Loader className="min-h-72" /> : <CategoryTable categories={filtered} onDelete={canWriteFinance ? setDeleteTarget : undefined} />}
    </DataPanel>{canWriteFinance && createModalOpen && <CategoryCreateModal initialType={typeView === 'expense' ? 'expense' : 'income'} onClose={() => setCreateModalOpen(false)} onSubmit={submit} />}{deleteTarget && <ConfirmDialog title="Delete category?" message={`"${deleteTarget.name}" will be permanently deleted. Categories that already have entries can't be deleted.`} confirmLabel="Delete category" loading={deleting} onCancel={() => setDeleteTarget(null)} onConfirm={removeCategory} />}
  </PageShell>;
}
