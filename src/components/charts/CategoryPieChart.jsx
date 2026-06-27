import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useChartTheme } from '../../hooks/useChartTheme.js';
import DataPanel from '../layout/DataPanel.jsx';
import { formatCurrency } from '../../utils/formatters';

export default function CategoryPieChart({ title, data }) {
  const chartTheme = useChartTheme();
  const chartData = data.map((item) => ({ name: item.categoryName, value: item.total }));
  const renderLabel = ({ name, value }) => `${name}: ${formatCurrency(value)}`;

  return (
    <DataPanel className="chart-panel" title={title} description="Category contribution for the selected date range.">
      {chartData.length ? (
        <ResponsiveContainer width="100%" height={320}>
          <PieChart margin={{ top: 8, right: 24, bottom: 8, left: 24 }}>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius={88}
              label={renderLabel}
              labelLine={{ stroke: chartTheme.axis }}
            >
              {chartData.map((entry, index) => (
                <Cell key={entry.name} fill={chartTheme.palette[index % chartTheme.palette.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: chartTheme.tooltipBackground, border: `1px solid ${chartTheme.tooltipBorder}`, borderRadius: 12, color: chartTheme.tooltipText }}
              formatter={(value) => formatCurrency(value)}
            />
            <Legend iconType="circle" verticalAlign="bottom" wrapperStyle={{ color: chartTheme.axis, paddingTop: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="empty-state compact">No data yet.</div>
      )}
    </DataPanel>
  );
}
