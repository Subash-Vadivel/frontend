import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useChartTheme } from '../../hooks/useChartTheme.js';
import DataPanel from '../layout/DataPanel.jsx';
import { formatCurrency, formatMonthYear } from '../../utils/formatters';
const labelMap = { income: 'Income', expense: 'Expense' };
export default function MonthlyTotalsChart({ data }) {
  const chartTheme = useChartTheme();
  return <DataPanel title="Monthly income vs expense" description="Compare inflow and outflow trends across the active reporting period."><ResponsiveContainer width="100%" height={320}><BarChart data={data} margin={{ top: 8, right: 10, bottom: 8, left: 8 }}><CartesianGrid stroke={chartTheme.grid} vertical={false} /><XAxis dataKey="month" tick={{ fill: chartTheme.axis, fontSize: 11 }} tickFormatter={formatMonthYear} tickLine={false} axisLine={false} tickMargin={10} /><YAxis tick={{ fill: chartTheme.axis, fontSize: 11 }} tickFormatter={formatCurrency} tickLine={false} axisLine={false} width={86} /><Tooltip contentStyle={{ background: chartTheme.tooltipBackground, border: `1px solid ${chartTheme.tooltipBorder}`, borderRadius: 8, color: chartTheme.tooltipText, fontSize: 12 }} cursor={{ fill: chartTheme.grid }} formatter={(value, name) => [formatCurrency(value), labelMap[name] || name]} labelFormatter={formatMonthYear} /><Legend formatter={(value) => labelMap[value] || value} wrapperStyle={{ color: chartTheme.axis, paddingTop: 10, fontSize: 12 }} /><Bar dataKey="income" fill={chartTheme.income} name="Income" radius={[4, 4, 0, 0]} /><Bar dataKey="expense" fill={chartTheme.expense} name="Expense" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></DataPanel>;
}
