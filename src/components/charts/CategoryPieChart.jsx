import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useChartTheme } from '../../hooks/useChartTheme.js';
import DataPanel from '../layout/DataPanel.jsx';
import { formatCurrency } from '../../utils/formatters';
export default function CategoryPieChart({ title, data }) {
  const chartTheme = useChartTheme();
  const chartData = data.map((item) => ({ name: item.categoryName, value: item.total }));
  return <DataPanel title={title} description="Category contribution for the selected date range.">{chartData.length ? <ResponsiveContainer width="100%" height={280}><PieChart margin={{ top: 4, right: 12, bottom: 4, left: 12 }}><Pie data={chartData} dataKey="value" nameKey="name" innerRadius={54} outerRadius={84} paddingAngle={2}>{chartData.map((entry, index) => <Cell key={entry.name} fill={chartTheme.palette[index % chartTheme.palette.length]} />)}</Pie><Tooltip contentStyle={{ background: chartTheme.tooltipBackground, border: `1px solid ${chartTheme.tooltipBorder}`, borderRadius: 8, color: chartTheme.tooltipText, fontSize: 12 }} formatter={(value) => formatCurrency(value)} /><Legend iconType="circle" verticalAlign="bottom" wrapperStyle={{ color: chartTheme.axis, paddingTop: 8, fontSize: 12 }} /></PieChart></ResponsiveContainer> : <div className="rounded-lg border border-dashed bg-muted/20 p-8 text-center text-xs text-muted-foreground">No data yet.</div>}</DataPanel>;
}
