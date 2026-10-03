import { BarChart3, ChartArea, ChartLine, ChartPie, CircleDot, Plus, Save, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { queryWidget } from '../../api/reportApi';
import { cn, getErrorMessage } from '../../lib/utils.js';
import { Button } from '../ui/button.jsx';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog.jsx';
import { Input } from '../ui/input.jsx';
import { Label } from '../ui/label.jsx';
import { Loader } from '../ui/loader.jsx';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select.jsx';
import ReportChart from './ReportChart.jsx';
import { CHART_TYPES, INTERVALS, MAX_SERIES, PIE_TYPES, aggregationsFor, effectiveRange, newSeriesId } from './reportUtils.js';

const CHART_ICONS = { line: ChartLine, area: ChartArea, bar: BarChart3, pie: ChartPie, donut: CircleDot };
const PREVIEW_DELAY_MS = 400;

const metricValue = (metric) => (metric?.kind === 'field' ? `field:${metric.fieldId}` : 'amount');
const metricFromValue = (value) => (value.startsWith('field:') ? { kind: 'field', fieldId: value.slice(6) } : { kind: 'amount' });

function Segmented({ options, value, onChange }) {
  return (
    <div className="inline-flex rounded-md border bg-muted/30 p-0.5">
      {options.map((option) => (
        <button key={option.value} type="button" onClick={() => onChange(option.value)} className={cn('rounded px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors', value === option.value && 'bg-background text-foreground shadow-sm')}>
          {option.label}
        </button>
      ))}
    </div>
  );
}

function SeriesRow({ series, index, categories, onChange, onRemove, canRemove }) {
  const category = categories.find((c) => c.id === series.categoryId);
  const fields = category?.customFields || [];
  const fieldFor = (metric) => (metric?.kind === 'field' ? fields.find((f) => f.id === metric.fieldId) : null);
  const aggregations = aggregationsFor(fieldFor(series.metric));
  // Switching metric resets the aggregation when the old one doesn't apply (e.g. Sum on a text field).
  const changeMetric = (metric) => {
    const allowed = aggregationsFor(fieldFor(metric)).map((a) => a.value);
    onChange({ ...series, metric, aggregation: allowed.includes(series.aggregation) ? series.aggregation : allowed[0] });
  };
  const grouped = ['income', 'expense'].map((type) => ({ type, items: categories.filter((c) => c.type === type) })).filter((group) => group.items.length);
  return (
    <div className="grid gap-2 rounded-md border bg-muted/10 p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-muted-foreground">Series {index + 1}</span>
        {canRemove && <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={onRemove} title="Remove series"><Trash2 /></Button>}
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <Select value={series.categoryId || undefined} onValueChange={(categoryId) => onChange({ ...series, categoryId, metric: { kind: 'amount' }, aggregation: aggregationsFor(null).some((a) => a.value === series.aggregation) ? series.aggregation : 'sum' })}>
          <SelectTrigger aria-label="Category"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            {grouped.map((group) => (
              <SelectGroup key={group.type}>
                <div className="px-2 py-1.5 text-[11px] font-medium uppercase text-muted-foreground">{group.type}</div>
                {group.items.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
        <Select value={metricValue(series.metric)} onValueChange={(value) => changeMetric(metricFromValue(value))} disabled={!category}>
          <SelectTrigger aria-label="Metric"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="amount">Amount</SelectItem>
            {fields.map((field) => <SelectItem key={field.id} value={`field:${field.id}`}>{field.name}{field.type === 'NUMBER' ? '' : ` (${field.type.toLowerCase()})`}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={series.aggregation} onValueChange={(aggregation) => onChange({ ...series, aggregation })}>
          <SelectTrigger aria-label="Aggregation"><SelectValue /></SelectTrigger>
          <SelectContent>{aggregations.map((a) => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}</SelectContent>
        </Select>
        <Input value={series.label || ''} onChange={(event) => onChange({ ...series, label: event.target.value })} placeholder="Label (optional)" maxLength={80} />
      </div>
    </div>
  );
}

const blankSeries = () => ({ id: newSeriesId(), categoryId: '', metric: { kind: 'amount' }, aggregation: 'sum', label: '' });

export default function WidgetBuilderModal({ widget, categories, categoriesLoading, reportRange, onClose, onSave }) {
  const initial = widget?.config;
  const [title, setTitle] = useState(widget?.title || '');
  const [chartType, setChartType] = useState(widget?.chartType || 'line');
  const [interval, setBucketInterval] = useState(initial?.interval || 'month');
  const [rangeMode, setRangeMode] = useState(initial?.dateRange?.mode || 'report');
  const [customRange, setCustomRange] = useState({ startDate: initial?.dateRange?.startDate || '', endDate: initial?.dateRange?.endDate || '' });
  const [series, setSeries] = useState(initial?.series?.length ? initial.series.map((s) => ({ ...s, label: s.label || '' })) : [blankSeries()]);
  const [preview, setPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const requestId = useRef(0);

  const isPie = PIE_TYPES.has(chartType);
  const readySeries = series.filter((s) => s.categoryId);
  const rangeIssue = rangeMode === 'custom' && (!customRange.startDate || !customRange.endDate || customRange.startDate > customRange.endDate)
    ? 'Pick a valid start and end date for the custom range.' : '';
  const config = useMemo(() => ({
    interval,
    dateRange: rangeMode === 'custom' ? { mode: 'custom', ...customRange } : { mode: 'report' },
    series: readySeries.map(({ label, ...rest }) => ({ ...rest, label: label?.trim() || null })),
  }), [interval, rangeMode, customRange, readySeries]);
  const configKey = JSON.stringify([chartType, config, reportRange]);

  useEffect(() => {
    if (!config.series.length || rangeIssue) { setPreview(null); setPreviewError(''); return undefined; }
    const current = ++requestId.current;
    setPreviewLoading(true);
    const timer = setTimeout(async () => {
      try {
        const data = await queryWidget({ chartType, config }, effectiveRange(config, reportRange));
        if (current === requestId.current) { setPreview(data); setPreviewError(''); }
      } catch (err) {
        if (current === requestId.current) { setPreview(null); setPreviewError(getErrorMessage(err, 'Unable to load preview')); }
      } finally {
        if (current === requestId.current) setPreviewLoading(false);
      }
    }, PREVIEW_DELAY_MS);
    return () => clearTimeout(timer);
    // configKey captures every input that changes the query.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configKey]);

  const updateSeries = (index, next) => setSeries((all) => all.map((s, i) => (i === index ? next : s)));
  const save = async () => {
    setError('');
    if (!config.series.length) { setError('Add at least one series with a category.'); return; }
    if (rangeIssue) { setError(rangeIssue); return; }
    setSaving(true);
    try {
      const fallbackTitle = preview?.series?.[0]?.label || 'Untitled widget';
      await onSave({ title: title.trim() || fallbackTitle, chartType, config });
    } catch (err) { setError(getErrorMessage(err, 'Unable to save widget')); setSaving(false); }
  };

  return (
    <Dialog open onOpenChange={(open) => { if (!open && !saving) onClose(); }}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogDescription>{widget ? 'Edit widget' : 'New widget'}</DialogDescription>
          <DialogTitle>{title.trim() || 'Widget builder'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,380px)_1fr]">
          <div className="grid content-start gap-4">
            <div className="grid gap-1.5"><Label htmlFor="widget-title">Title</Label><Input id="widget-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Drumstick rate per week" maxLength={120} /></div>
            <div className="grid gap-1.5">
              <Label>Chart type</Label>
              <div className="grid grid-cols-5 gap-1.5">
                {CHART_TYPES.map(({ value, label }) => {
                  const Icon = CHART_ICONS[value];
                  return (
                    <button key={value} type="button" onClick={() => setChartType(value)} className={cn('flex flex-col items-center gap-1 rounded-md border px-1 py-2 text-[11px] text-muted-foreground transition-colors hover:bg-accent', chartType === value && 'border-primary bg-primary/5 text-foreground')}>
                      <Icon className="h-4 w-4" />{label}
                    </button>
                  );
                })}
              </div>
            </div>
            {isPie ? (
              <p className="rounded-md border bg-muted/20 p-2 text-xs text-muted-foreground">Pie and donut charts show each series' total for the date range, one slice per series.</p>
            ) : (
              <div className="grid gap-1.5">
                <Label>X axis</Label>
                <div className="flex flex-wrap items-center gap-2">
                  <Select value="date" disabled><SelectTrigger className="w-[150px]" aria-label="X axis"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="date">Date histogram</SelectItem></SelectContent></Select>
                  <Segmented options={INTERVALS} value={interval} onChange={setBucketInterval} />
                </div>
              </div>
            )}
            <div className="grid gap-1.5">
              <Label>Date range</Label>
              <Segmented options={[{ value: 'report', label: 'Use report range' }, { value: 'custom', label: 'Custom' }]} value={rangeMode} onChange={setRangeMode} />
              {rangeMode === 'custom' && (
                <div className="grid grid-cols-2 gap-2">
                  <Input type="date" aria-label="Start date" value={customRange.startDate} onChange={(event) => setCustomRange({ ...customRange, startDate: event.target.value })} />
                  <Input type="date" aria-label="End date" value={customRange.endDate} onChange={(event) => setCustomRange({ ...customRange, endDate: event.target.value })} />
                </div>
              )}
            </div>
            <div className="grid gap-1.5">
              <Label>{isPie ? 'Slices' : 'Y axis series'}</Label>
              {categoriesLoading ? <Loader className="min-h-20" /> : !categories.length ? (
                <p className="rounded-md border border-dashed p-3 text-xs text-muted-foreground">Create a category first to chart its entries.</p>
              ) : (
                <div className="grid gap-2">
                  {series.map((s, index) => <SeriesRow key={s.id} series={s} index={index} categories={categories} canRemove={series.length > 1} onChange={(next) => updateSeries(index, next)} onRemove={() => setSeries((all) => all.filter((_, i) => i !== index))} />)}
                  {series.length < MAX_SERIES && <Button type="button" variant="outline" size="sm" onClick={() => setSeries((all) => [...all, blankSeries()])}><Plus /> Add series</Button>}
                </div>
              )}
            </div>
          </div>
          <div className="grid content-start gap-2 rounded-lg border bg-muted/10 p-3">
            <div className="flex items-center justify-between"><span className="text-xs font-medium">Preview</span>{previewLoading && <span className="text-[11px] text-muted-foreground">Updating...</span>}</div>
            {!config.series.length ? (
              <div className="flex h-[320px] items-center justify-center rounded-md border border-dashed text-xs text-muted-foreground">Pick a category to see a preview.</div>
            ) : rangeIssue || previewError ? (
              <div className="flex h-[320px] items-center justify-center rounded-md border border-dashed border-destructive/30 p-4 text-center text-xs text-destructive">{rangeIssue || previewError}</div>
            ) : preview ? <ReportChart chartType={chartType} data={preview} height={320} /> : <Loader className="h-[320px]" />}
          </div>
        </div>
        {error && <p className="rounded-md border border-destructive/20 bg-destructive/10 p-2 text-xs text-destructive">{error}</p>}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button type="button" onClick={save} disabled={saving || !config.series.length}><Save /> {saving ? 'Saving...' : widget ? 'Save widget' : 'Add widget'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
