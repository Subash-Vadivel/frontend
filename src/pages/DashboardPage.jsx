import { IndianRupee, TrendingDown, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import CategoryPieChart from '../components/charts/CategoryPieChart.jsx';
import MonthlyTotalsChart from '../components/charts/MonthlyTotalsChart.jsx';
import DateRangeModal from '../components/modals/DateRangeModal.jsx';
import { getCategoryTotals, getMonthlyTotals, getSummary } from '../api/dashboardApi';

const currency = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value || 0);
const dateToInputValue = (date) => date.toISOString().slice(0, 10);

const rangeOptions = [
  { value: 'all', label: 'All Time' },
  { value: '30', label: 'Last 30 days' },
  { value: '60', label: 'Last 60 days' },
  { value: '90', label: 'Last 90 days' },
  { value: 'custom', label: 'Custom' },
];

const presetRange = (days) => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - (days - 1));
  return { startDate: dateToInputValue(start), endDate: dateToInputValue(end) };
};

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
    setDateRange(value === 'all' ? {} : presetRange(Number(value)));
  };

  const applyCustomRange = (range) => {
    setRangeMode('custom');
    setDateRange(range);
    setCustomModalOpen(false);
  };

  const rangeLabel = rangeMode === 'custom' && dateRange.startDate && dateRange.endDate
    ? `${dateRange.startDate} to ${dateRange.endDate}`
    : rangeOptions.find((option) => option.value === rangeMode)?.label;

  if (loading) return <div className="page-loader">Loading dashboard...</div>;

  return (
    <section className="page-stack">
      <header className="page-header">
        <h1>Dashboard</h1>
        <div className="dashboard-filter">
          <span>{rangeLabel}</span>
          <select value={rangeMode} onChange={(event) => changeRange(event.target.value)} aria-label="Dashboard date range">
            {rangeOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </header>
      <div className="summary-grid">
        <article className="summary-card income"><TrendingUp /><span>Total income</span><strong>{currency(summary.totalIncome)}</strong></article>
        <article className="summary-card expense"><TrendingDown /><span>Total expense</span><strong>{currency(summary.totalExpense)}</strong></article>
        <article className="summary-card balance"><IndianRupee /><span>Net balance</span><strong>{currency(summary.netBalance)}</strong></article>
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
