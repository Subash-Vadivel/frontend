export const CHART_TYPES = [
  { value: 'line', label: 'Line' },
  { value: 'area', label: 'Area' },
  { value: 'bar', label: 'Bar' },
  { value: 'pie', label: 'Pie' },
  { value: 'donut', label: 'Donut' },
  { value: 'kpi', label: 'KPI' },
];
export const PIE_TYPES = new Set(['pie', 'donut']);
// No date axis: one total per series over the range.
export const TOTAL_ONLY_TYPES = new Set(['pie', 'donut', 'kpi']);
export const INTERVALS = [
  { value: 'day', label: 'Daily' },
  { value: 'week', label: 'Weekly' },
  { value: 'month', label: 'Monthly' },
];
export const AGGREGATIONS = [
  { value: 'sum', label: 'Sum' },
  { value: 'avg', label: 'Average' },
  { value: 'min', label: 'Min' },
  { value: 'max', label: 'Max' },
  { value: 'count', label: 'Count' },
  { value: 'percent', label: 'Percentage' },
];
// Must match the backend: amount and NUMBER fields aggregate values; other field types count filled entries.
const AMOUNT_AGGREGATIONS = ['sum', 'avg', 'min', 'max', 'count'];
const NUMBER_FIELD_AGGREGATIONS = ['sum', 'avg', 'min', 'max'];
const OTHER_FIELD_AGGREGATIONS = ['count', 'percent'];

export const aggregationsFor = (field) => {
  const allowed = !field ? AMOUNT_AGGREGATIONS : field.type === 'NUMBER' ? NUMBER_FIELD_AGGREGATIONS : OTHER_FIELD_AGGREGATIONS;
  return AGGREGATIONS.filter((a) => allowed.includes(a.value));
};
export const MAX_SERIES = 8;

// Grid sizes per chart type in columns (of 12) and rows: create/clone use "default", resizing is
// limited to min..max. Keep in sync with WIDGET_SIZES in backend app/schemas/report.py.
const CHART_SIZE = { min: [2, 3], default: [2, 3], max: [12, 20] };
export const WIDGET_SIZES = {
  line: CHART_SIZE,
  area: CHART_SIZE,
  bar: CHART_SIZE,
  pie: CHART_SIZE,
  donut: CHART_SIZE,
  kpi: { min: [2, 2], default: [2, 2], max: [4, 4] },
};
export const sizeLimits = (chartType) => {
  const { min, max } = WIDGET_SIZES[chartType] || CHART_SIZE;
  return { minW: min[0], minH: min[1], maxW: max[0], maxH: max[1] };
};

export const newSeriesId = () => (globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`).slice(0, 36);

export const effectiveRange = (config, reportRange) =>
  config?.dateRange?.mode === 'custom'
    ? { startDate: config.dateRange.startDate, endDate: config.dateRange.endDate }
    : reportRange;

const numberFormatter = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 });
const compactFormatter = new Intl.NumberFormat('en-IN', { notation: 'compact', maximumFractionDigits: 1 });
const currencyFormatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });
const compactCurrencyFormatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', notation: 'compact', maximumFractionDigits: 1 });

export const formatValue = (value, unit) => {
  if (value === null || value === undefined) return '-';
  if (unit === 'percent') return `${numberFormatter.format(value)}%`;
  return unit === 'currency' ? currencyFormatter.format(value) : numberFormatter.format(value);
};

export const formatAxis = (value, unit) => {
  if (unit === 'percent') return `${compactFormatter.format(value)}%`;
  return unit === 'currency' ? compactCurrencyFormatter.format(value) : compactFormatter.format(value);
};
