import { ArrowDown, ArrowUp, CalendarRange, Columns2, Copy, Pencil, RectangleHorizontal, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { queryWidget } from '../../api/reportApi';
import { getErrorMessage } from '../../lib/utils.js';
import { Badge } from '../ui/badge.jsx';
import { Button } from '../ui/button.jsx';
import { Card } from '../ui/card.jsx';
import { Loader } from '../ui/loader.jsx';
import ReportChart from './ReportChart.jsx';
import { INTERVALS, PIE_TYPES, effectiveRange } from './reportUtils.js';

export default function WidgetCard({ widget, reportRange, canEdit, isFirst, isLast, onEdit, onDuplicate, onMove, onToggleWidth, onDelete }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const range = effectiveRange(widget.config, reportRange);
  const queryKey = JSON.stringify([widget.chartType, widget.config, range]);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    queryWidget(widget, range)
      .then((result) => { if (!ignore) { setData(result); setError(''); } })
      .catch((err) => { if (!ignore) setError(getErrorMessage(err, 'Unable to load widget')); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
    // queryKey covers the widget config and the effective range.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey]);

  const ownRange = widget.config.dateRange?.mode === 'custom';
  const intervalLabel = INTERVALS.find((i) => i.value === widget.config.interval)?.label;
  const action = (Icon, title, onClick, props = {}) => <Button type="button" variant="ghost" size="icon" className="h-7 w-7" title={title} onClick={onClick} {...props}><Icon /></Button>;

  return (
    <Card className={`flex flex-col overflow-hidden bg-background ${widget.width === 'full' ? 'lg:col-span-2' : ''}`}>
      <div className="flex items-start justify-between gap-2 border-b bg-muted/15 px-4 py-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold">{widget.title}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="capitalize">{widget.chartType}</span>
            {!PIE_TYPES.has(widget.chartType) && <><span>·</span><span>{intervalLabel}</span></>}
            {ownRange && <Badge variant="outline" className="gap-1 text-[10px]"><CalendarRange className="h-3 w-3" />{widget.config.dateRange.startDate} to {widget.config.dateRange.endDate}</Badge>}
          </div>
        </div>
        {canEdit && (
          <div className="flex shrink-0 items-center">
            {action(Pencil, 'Edit widget', onEdit)}
            {action(Copy, 'Duplicate widget', onDuplicate)}
            {action(widget.width === 'full' ? Columns2 : RectangleHorizontal, widget.width === 'full' ? 'Make half width' : 'Make full width', onToggleWidth, { className: 'hidden h-7 w-7 lg:inline-flex' })}
            {action(ArrowUp, 'Move up', () => onMove(-1), { disabled: isFirst })}
            {action(ArrowDown, 'Move down', () => onMove(1), { disabled: isLast })}
            {action(Trash2, 'Delete widget', onDelete, { className: 'h-7 w-7 text-destructive hover:text-destructive' })}
          </div>
        )}
      </div>
      <div className="p-3">
        {loading && !data ? <Loader className="h-[280px]" /> : error ? (
          <div className="flex h-[280px] items-center justify-center rounded-md border border-dashed border-destructive/30 p-4 text-center text-xs text-destructive">{error}</div>
        ) : <ReportChart chartType={widget.chartType} data={data} />}
      </div>
    </Card>
  );
}
