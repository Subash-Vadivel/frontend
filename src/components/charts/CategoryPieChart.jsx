import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const colors = ['#2563eb', '#16a34a', '#dc2626', '#ca8a04', '#7c3aed', '#0891b2', '#db2777'];

export default function CategoryPieChart({ title, data }) {
  const chartData = data.map((item) => ({ name: item.categoryName, value: item.total }));

  return (
    <div className="panel chart-panel">
      <h2>{title}</h2>
      {chartData.length ? (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={90} label>
              {chartData.map((entry, index) => (
                <Cell key={entry.name} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="empty-state compact">No data yet.</div>
      )}
    </div>
  );
}
