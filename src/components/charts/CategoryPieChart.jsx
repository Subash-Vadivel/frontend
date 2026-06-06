import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

const colors = ['#2563eb', '#16a34a', '#dc2626', '#ca8a04', '#7c3aed', '#0891b2', '#db2777'];

export default function CategoryPieChart({ title, data }) {
  const chartData = data.map((item) => ({ name: item.categoryName, value: item.total }));
  const renderLabel = ({ name, value }) => `${name}: ${formatCurrency(value)}`;

  return (
    <div className="panel chart-panel">
      <h2>{title}</h2>
      {chartData.length ? (
        <ResponsiveContainer width="100%" height={320}>
          <PieChart margin={{ top: 8, right: 24, bottom: 8, left: 24 }}>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius={88}
              label={renderLabel}
              labelLine={{ stroke: '#94a38c' }}
            >
              {chartData.map((entry, index) => (
                <Cell key={entry.name} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend iconType="circle" verticalAlign="bottom" wrapperStyle={{ paddingTop: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="empty-state compact">No data yet.</div>
      )}
    </div>
  );
}
