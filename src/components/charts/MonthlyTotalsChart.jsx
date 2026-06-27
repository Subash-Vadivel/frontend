import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useChartTheme } from '../../hooks/useChartTheme.js';
import DataPanel from '../layout/DataPanel.jsx';
import { formatCurrency, formatMonthYear } from '../../utils/formatters';

const labelMap = {
  income: 'Income',
  expense: 'Expense',
};

export default function MonthlyTotalsChart({ data }) {
  const chartTheme = useChartTheme();

  return (
    <DataPanel
      className="chart-panel primary-chart-panel"
      title="Monthly income vs expense"
      description="Compare inflow and outflow trends across the active reporting period."
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 8, right: 18, bottom: 8, left: 18 }}>
          <CartesianGrid stroke={chartTheme.grid} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: chartTheme.axis }} tickFormatter={formatMonthYear} tickLine={false} tickMargin={10} />
          <YAxis tick={{ fill: chartTheme.axis }} tickFormatter={formatCurrency} tickLine={false} width={92} />
          <Tooltip
            contentStyle={{ background: chartTheme.tooltipBackground, border: `1px solid ${chartTheme.tooltipBorder}`, borderRadius: 12, color: chartTheme.tooltipText }}
            cursor={{ fill: chartTheme.grid }}
            formatter={(value, name) => [formatCurrency(value), labelMap[name] || name]}
            labelFormatter={formatMonthYear}
          />
          <Legend formatter={(value) => labelMap[value] || value} wrapperStyle={{ color: chartTheme.axis, paddingTop: 10 }} />
          <Bar dataKey="income" fill={chartTheme.income} name="Income" radius={[6, 6, 0, 0]} />
          <Bar dataKey="expense" fill={chartTheme.expense} name="Expense" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </DataPanel>
  );
}
