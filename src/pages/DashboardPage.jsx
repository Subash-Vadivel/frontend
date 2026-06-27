import { IndianRupee, TrendingDown, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import CategoryPieChart from '../components/charts/CategoryPieChart.jsx';
import DateRangeFilter from '../components/filters/DateRangeFilter.jsx';
import MetricCard from '../components/layout/MetricCard.jsx';
import PageShell from '../components/layout/PageShell.jsx';
import MonthlyTotalsChart from '../components/charts/MonthlyTotalsChart.jsx';
import DateRangeModal from '../components/modals/DateRangeModal.jsx';
import { getCategoryTotals, getMonthlyTotals, getSummary } from '../api/dashboardApi';
import { rangeForMode } from '../utils/dateRanges';
import { formatCurrency } from '../utils/formatters';

export default function DashboardPage() {
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, netBalance: 0 });
  const [monthly, setMonthly] = useState([]);
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rangeMode, setRangeMode] = useState('all');
  const [dateRange, setDateRange] = useState({});
  const [customModalOpen, setCustomModalOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [summaryData, monthlyData, incomeData, expenseData] = await Promise.all([
        getSummary(dateRange),
        getMonthlyTotals(dateRange),
        getCategoryTotals('income', dateRange),
        getCategoryTotals('expense', dateRange),
      ]);
      setSummary(summaryData);
      setMonthly(monthlyData);
      setIncomeCategories(incomeData);
      setExpenseCategories(expenseData);
      setLoading(false);
    };
    load();
  }, [dateRange]);

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

  if (loading) return <div className="page-loader">Loading dashboard...</div>;

  return (
    <PageShell
      eyebrow="Command center"
      title="Dashboard"
      description="Monitor farm cash flow, category movement, and net balance for the selected period."
      actions={(
        <DateRangeFilter
          label="Dashboard date range"
          rangeMode={rangeMode}
          dateRange={dateRange}
          onChange={changeRange}
        />
      )}
    >
      <div className="metric-grid">
        <MetricCard tone="income" icon={TrendingUp} label="Total income" value={formatCurrency(summary.totalIncome)} detail="Revenue captured in range" />
        <MetricCard tone="expense" icon={TrendingDown} label="Total expense" value={formatCurrency(summary.totalExpense)} detail="Costs captured in range" />
        <MetricCard tone="balance" icon={IndianRupee} label="Net balance" value={formatCurrency(summary.netBalance)} detail="Income minus expenses" />
      </div>
      <MonthlyTotalsChart data={monthly} />
      <div className="chart-grid">
        <CategoryPieChart title="Income by category" data={incomeCategories} />
        <CategoryPieChart title="Expense by category" data={expenseCategories} />
      </div>
      {customModalOpen && (
        <DateRangeModal
          initialRange={dateRange}
          onApply={applyCustomRange}
          onClose={() => setCustomModalOpen(false)}
        />
      )}
    </PageShell>
  );
}
