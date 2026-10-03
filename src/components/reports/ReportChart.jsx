import { BarChart3, TrendingDown, TrendingUp } from 'lucide-react';
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

// Change vs the previous period: null when there's nothing to compare (all time, or no prior data).
const changeFrom = (current, previous) => {
  if (previous === null || previous === undefined || current === null || current === undefined) return null;
  if (previous === 0) return current === 0 ? 0 : null;
  return ((current - previous) / Math.abs(previous)) * 100;
};

function KpiValue({ series, height }) {
  if (!series) return <EmptyChart height={height} message="No data yet" />;
  const change = changeFrom(series.total, series.previousTotal);
  const ChangeIcon = change > 0 ? TrendingUp : TrendingDown;
  return (
    <div className="flex flex-col items-center justify-center gap-0.5 [container-type:size] overflow-hidden text-center" style={{ height }} title={series.label}>
      <div className="max-w-full truncate text-xl font-semibold tabular-nums tracking-tight [@container(min-height:240px)]:text-6xl">{formatValue(series.total, series.unit)}</div>
      {change !== null && (
        <div className={`flex items-center gap-1 text-[11px] font-medium ${change > 0 ? 'text-emerald-600 dark:text-emerald-400' : change < 0 ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'}`}>
          {change !== 0 && <ChangeIcon className="h-3.5 w-3.5" />}
          {change > 0 ? '+' : ''}{change.toFixed(1)}% <span className="font-normal text-muted-foreground" title="vs the previous period of the same length">vs prev</span>
        </div>
      )}
    </div>
  );
}

// Small widgets get a one-line legend with small text so it doesn't crowd out the chart.
const legendProps = (theme, compact, extra = {}) => (compact
  ? { iconSize: 8, wrapperStyle: { color: theme.axis, fontSize: 10, lineHeight: '14px', maxHeight: 16, overflow: 'hidden', whiteSpace: 'nowrap', paddingTop: 2 } }
  : { wrapperStyle: { color: theme.axis, fontSize: 12, ...extra } });

export default function ReportChart({ chartType, data, height = 280, compact = false }) {
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

  if (chartType === 'kpi') return <KpiValue series={series[0]} height={height} />;

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
          <Legend {...legendProps(theme, compact)} />
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
        <Legend {...legendProps(theme, compact, { paddingTop: 6 })} />
        {marks}
      </Chart>
    </ResponsiveContainer>
  );
}
