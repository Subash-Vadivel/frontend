import { IndianRupee, TrendingDown, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import CategoryPieChart from '../components/charts/CategoryPieChart.jsx';
import DateRangeFilter from '../components/filters/DateRangeFilter.jsx';
import MonthlyTotalsChart from '../components/charts/MonthlyTotalsChart.jsx';
import DateRangeModal from '../components/modals/DateRangeModal.jsx';
import { getCategoryTotals, getMonthlyTotals, getSummary } from '../api/dashboardApi';
import { rangeForMode, thisMonthRange } from '../utils/dateRanges';
import { formatCurrency } from '../utils/formatters';

export default function DashboardPage() {
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, netBalance: 0 });
  const [monthly, setMonthly] = useState([]);
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rangeMode, setRangeMode] = useState('thisMonth');
  const [dateRange, setDateRange] = useState(() => thisMonthRange());
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
    <section className="page-stack">
      <header className="page-header">
        <h1>Dashboard</h1>
        <DateRangeFilter
          label="Dashboard date range"
          rangeMode={rangeMode}
          dateRange={dateRange}
          onChange={changeRange}
        />
      </header>
      <div className="summary-grid">
        <article className="summary-card income"><TrendingUp /><span>Total income</span><strong>{formatCurrency(summary.totalIncome)}</strong></article>
        <article className="summary-card expense"><TrendingDown /><span>Total expense</span><strong>{formatCurrency(summary.totalExpense)}</strong></article>
        <article className="summary-card balance"><IndianRupee /><span>Net balance</span><strong>{formatCurrency(summary.netBalance)}</strong></article>
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
    </section>
  );
}
