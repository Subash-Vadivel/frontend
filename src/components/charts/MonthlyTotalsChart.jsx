import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatCurrency, formatMonthYear } from '../../utils/formatters';

const labelMap = {
  income: 'Income',
  expense: 'Expense',
};

export default function MonthlyTotalsChart({ data }) {
  return (
    <div className="panel chart-panel">
      <h2>Monthly income vs expense</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 8, right: 18, bottom: 8, left: 18 }}>
          <CartesianGrid stroke="#e1e8dc" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" tickFormatter={formatMonthYear} tickMargin={10} />
          <YAxis tickFormatter={formatCurrency} width={92} />
          <Tooltip
            formatter={(value, name) => [formatCurrency(value), labelMap[name] || name]}
            labelFormatter={formatMonthYear}
          />
          <Legend formatter={(value) => labelMap[value] || value} wrapperStyle={{ paddingTop: 10 }} />
          <Bar dataKey="income" fill="#2f855a" name="Income" radius={[6, 6, 0, 0]} />
          <Bar dataKey="expense" fill="#c2410c" name="Expense" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
