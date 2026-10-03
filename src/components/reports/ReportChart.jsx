import { BarChart3 } from 'lucide-react';
import { useMemo } from 'react';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { useChartTheme } from '../../hooks/useChartTheme.js';
import { PIE_TYPES, formatAxis, formatValue } from './reportUtils.js';

function EmptyChart({ height, message }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed bg-muted/20 text-xs text-muted-foreground" style={{ height }}>
      <BarChart3 className="h-5 w-5" />
      {message}
    </div>
  );
}

export default function ReportChart({ chartType, data, height = 280 }) {
  const theme = useChartTheme();
  const colors = theme.palette.filter(Boolean);
  const colorFor = (index) => colors[index % colors.length] || theme.income;
  const tooltipStyle = { background: theme.tooltipBackground, border: `1px solid ${theme.tooltipBorder}`, borderRadius: 8, color: theme.tooltipText, fontSize: 12 };
  const series = useMemo(() => data?.series || [], [data]);
  const unitById = useMemo(() => Object.fromEntries(series.map((s) => [s.id, s.unit])), [series]);

  const rows = useMemo(
    () => (data?.buckets || []).map((bucket, index) => ({
      label: bucket.label,
      ...Object.fromEntries(series.map((s) => [s.id, s.values[index]])),
    })),
    [data, series],
  );

  if (!data) return <EmptyChart height={height} message="No data yet" />;

  if (PIE_TYPES.has(chartType)) {
    const slices = series.map((s, index) => ({ id: s.id, name: s.label, value: s.total || 0, unit: s.unit, color: colorFor(index) })).filter((s) => s.value > 0);
    if (!slices.length) return <EmptyChart height={height} message="No data in this range" />;
    return (
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie data={slices} dataKey="value" nameKey="name" innerRadius={chartType === 'donut' ? '58%' : 0} outerRadius="82%" paddingAngle={slices.length > 1 ? 2 : 0} stroke={theme.tooltipBackground}>
            {slices.map((slice) => <Cell key={slice.id} fill={slice.color} />)}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} formatter={(value, name, item) => [formatValue(value, item.payload.unit), name]} />
          <Legend wrapperStyle={{ color: theme.axis, fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  const hasValues = series.some((s) => s.values.some((value) => value !== null && value !== 0));
  if (!rows.length || !hasValues) return <EmptyChart height={height} message="No data in this range" />;

  // Mixed units (e.g. amount and kg) get a second axis so neither scale flattens the other.
  const units = [...new Set(series.map((s) => s.unit))];
  const leftUnit = units.includes('currency') ? 'currency' : units[0];
  const rightUnit = units.find((unit) => unit !== leftUnit);
  const axisFor = (unit) => (unit === leftUnit ? 'left' : 'right');
  const Chart = chartType === 'bar' ? BarChart : chartType === 'area' ? AreaChart : LineChart;
  const marks = series.map((s, index) => {
    const common = { key: s.id, dataKey: s.id, name: s.label, yAxisId: axisFor(s.unit) };
    if (chartType === 'bar') return <Bar {...common} fill={colorFor(index)} radius={[3, 3, 0, 0]} maxBarSize={40} />;
    if (chartType === 'area') return <Area {...common} type="monotone" stroke={colorFor(index)} fill={colorFor(index)} fillOpacity={0.15} strokeWidth={2} connectNulls />;
    return <Line {...common} type="monotone" stroke={colorFor(index)} strokeWidth={2} dot={rows.length <= 40 ? { r: 2.5 } : false} connectNulls />;
  });

  return (
    <ResponsiveContainer width="100%" height={height}>
      <Chart data={rows} margin={{ top: 8, right: 8, bottom: 4, left: 4 }}>
        <CartesianGrid stroke={theme.grid} vertical={false} />
        <XAxis dataKey="label" tick={{ fill: theme.axis, fontSize: 11 }} tickLine={false} axisLine={false} tickMargin={8} minTickGap={16} />
        <YAxis yAxisId="left" tick={{ fill: theme.axis, fontSize: 11 }} tickFormatter={(value) => formatAxis(value, leftUnit)} tickLine={false} axisLine={false} width={64} />
        {rightUnit && <YAxis yAxisId="right" orientation="right" tick={{ fill: theme.axis, fontSize: 11 }} tickFormatter={(value) => formatAxis(value, rightUnit)} tickLine={false} axisLine={false} width={52} />}
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: theme.grid }} formatter={(value, name, item) => [formatValue(value, unitById[item.dataKey]), name]} />
        <Legend wrapperStyle={{ color: theme.axis, fontSize: 12, paddingTop: 6 }} />
        {marks}
      </Chart>
    </ResponsiveContainer>
  );
}
