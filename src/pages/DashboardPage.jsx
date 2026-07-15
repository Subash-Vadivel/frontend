import { IndianRupee, ReceiptText, TrendingDown, TrendingUp, WalletCards } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import CategoryPieChart from '../components/charts/CategoryPieChart.jsx';
import DateRangeFilter from '../components/filters/DateRangeFilter.jsx';
import DataPanel from '../components/layout/DataPanel.jsx';
import MetricCard from '../components/layout/MetricCard.jsx';
import PageShell from '../components/layout/PageShell.jsx';
import MonthlyTotalsChart from '../components/charts/MonthlyTotalsChart.jsx';
import DateRangeModal from '../components/modals/DateRangeModal.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Skeleton } from '../components/ui/skeleton.jsx';
import { getCategoryTotals, getMonthlyTotals, getSummary } from '../api/dashboardApi';
import { listTransactions } from '../api/transactionApi';
import { rangeForMode } from '../utils/dateRanges';
import { formatCurrency, formatMonthYear } from '../utils/formatters';

export default function DashboardPage() {
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, netBalance: 0 });
  const [monthly, setMonthly] = useState([]);
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [recentEntries, setRecentEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rangeMode, setRangeMode] = useState('all');
  const [dateRange, setDateRange] = useState({});
  const [customModalOpen, setCustomModalOpen] = useState(false);
  useEffect(() => { const load = async () => { setLoading(true); const [summaryData, monthlyData, incomeData, expenseData, incomeRows, expenseRows] = await Promise.all([getSummary(dateRange), getMonthlyTotals(dateRange), getCategoryTotals('income', dateRange), getCategoryTotals('expense', dateRange), listTransactions('income', dateRange), listTransactions('expense', dateRange)]); setSummary(summaryData); setMonthly(monthlyData); setIncomeCategories(incomeData); setExpenseCategories(expenseData); setRecentEntries([...incomeRows.map((row)=>({...row,type:'income'})), ...expenseRows.map((row)=>({...row,type:'expense'}))].sort((a,b)=>String(b.date).localeCompare(String(a.date))).slice(0,6)); setLoading(false); }; load(); }, [dateRange]);
  const changeRange = (value) => { if (value === 'custom') { setCustomModalOpen(true); return; } setRangeMode(value); setDateRange(rangeForMode(value)); };
  const applyCustomRange = (range) => { setRangeMode('custom'); setDateRange(range); setCustomModalOpen(false); };
  const insights = useMemo(() => {
    const latest = monthly.at(-1);
    const previous = monthly.at(-2);
    const latestNet = (latest?.income || 0) - (latest?.expense || 0);
    const previousNet = (previous?.income || 0) - (previous?.expense || 0);
    const topExpense = [...expenseCategories].sort((a,b)=>(b.total||0)-(a.total||0))[0];
    return { latest, latestNet, previousNet, topExpense };
  }, [expenseCategories, monthly]);
  if (loading) return <div className="grid gap-4"><Skeleton className="h-20" /><div className="grid gap-3 md:grid-cols-4"><Skeleton className="h-32" /><Skeleton className="h-32" /><Skeleton className="h-32" /><Skeleton className="h-32" /></div><Skeleton className="h-96" /></div>;
  return (
    <PageShell eyebrow="Command center" title="Financial overview" description="A production view of farm cash flow, category pressure, and recent ledger movement." actions={<DateRangeFilter label="Dashboard date range" rangeMode={rangeMode} dateRange={dateRange} onChange={changeRange} />}>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard tone="income" icon={TrendingUp} label="Total income" value={formatCurrency(summary.totalIncome)} detail="Revenue in range" delta="Inflow" deltaDirection="up" />
        <MetricCard tone="expense" icon={TrendingDown} label="Total expense" value={formatCurrency(summary.totalExpense)} detail="Costs in range" delta="Outflow" deltaDirection="down" />
        <MetricCard tone="balance" icon={IndianRupee} label="Net balance" value={formatCurrency(summary.netBalance)} detail="Income minus expenses" delta={summary.netBalance >= 0 ? 'Positive' : 'Negative'} deltaDirection={summary.netBalance >= 0 ? 'up' : 'down'} />
        <MetricCard tone="neutral" icon={ReceiptText} label="Recent records" value={recentEntries.length} detail="Latest visible rows" />
      </div>
      <div className="grid gap-3 xl:grid-cols-[1fr_360px]">
        <MonthlyTotalsChart data={monthly} />
        <DataPanel title="Operating signals" description="Derived from the selected range.">
          <div className="grid gap-3">
            <div className="rounded-lg border bg-muted/15 p-3"><div className="mb-1 flex items-center justify-between"><span className="text-xs text-muted-foreground">Latest month</span><Badge variant="outline">{insights.latest?.month ? formatMonthYear(insights.latest.month) : 'No data'}</Badge></div><strong className="text-lg">{formatCurrency(insights.latestNet)}</strong><p className="mt-1 text-xs text-muted-foreground">Previous month: {formatCurrency(insights.previousNet)}</p></div>
            <div className="rounded-lg border bg-muted/15 p-3"><div className="mb-1 flex items-center justify-between"><span className="text-xs text-muted-foreground">Top expense category</span><WalletCards className="h-3.5 w-3.5 text-muted-foreground" /></div><strong className="text-sm">{insights.topExpense?.categoryName || 'No expenses yet'}</strong><p className="mt-1 text-xs text-muted-foreground">{formatCurrency(insights.topExpense?.total || 0)} captured in range</p></div>
          </div>
        </DataPanel>
      </div>
      <div className="grid gap-3 xl:grid-cols-[1fr_360px]">
        <div className="grid gap-3 lg:grid-cols-2"><CategoryPieChart title="Income by category" data={incomeCategories} /><CategoryPieChart title="Expense by category" data={expenseCategories} /></div>
        <DataPanel title="Recent activity" description="Latest income and expense entries.">
          <div className="grid gap-2">{recentEntries.length ? recentEntries.map((entry)=><div className="flex items-center justify-between gap-3 rounded-md border p-2.5" key={`${entry.type}-${entry.id}`}><div className="min-w-0"><div className="truncate text-[13px] font-medium">{entry.description || entry.categoryName}</div><div className="truncate text-xs text-muted-foreground">{entry.date} · {entry.categoryName}</div></div><Badge variant={entry.type === 'income' ? 'income' : 'expense'}>{formatCurrency(entry.amount)}</Badge></div>) : <div className="rounded-lg border border-dashed p-6 text-center text-xs text-muted-foreground">No recent activity.</div>}</div>
        </DataPanel>
      </div>
      {customModalOpen && <DateRangeModal initialRange={dateRange} onApply={applyCustomRange} onClose={() => setCustomModalOpen(false)} />}
    </PageShell>
  );
}
