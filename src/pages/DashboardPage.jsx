import { IndianRupee, TrendingDown, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import CategoryPieChart from '../components/charts/CategoryPieChart.jsx';
import MonthlyTotalsChart from '../components/charts/MonthlyTotalsChart.jsx';
import { getCategoryTotals, getMonthlyTotals, getSummary } from '../api/dashboardApi';

const currency = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value || 0);

export default function DashboardPage() {
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, netBalance: 0 });
  const [monthly, setMonthly] = useState([]);
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [summaryData, monthlyData, incomeData, expenseData] = await Promise.all([
        getSummary(),
        getMonthlyTotals(),
        getCategoryTotals('income'),
        getCategoryTotals('expense'),
      ]);
      setSummary(summaryData);
      setMonthly(monthlyData);
      setIncomeCategories(incomeData);
      setExpenseCategories(expenseData);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="page-loader">Loading dashboard...</div>;

  return (
    <section className="page-stack">
      <header className="page-header"><h1>Dashboard</h1></header>
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
    </section>
  );
}
