import { CalendarRange, Copy, GripVertical, Loader2, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { queryWidget } from '../../api/reportApi';
import { getErrorMessage } from '../../lib/utils.js';
import { Badge } from '../ui/badge.jsx';
import { Button } from '../ui/button.jsx';
import { Card } from '../ui/card.jsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu.jsx';
import { Loader } from '../ui/loader.jsx';
import ReportChart from './ReportChart.jsx';
import { INTERVALS, PIE_TYPES, effectiveRange } from './reportUtils.js';

// Must match the grid's dragConfig.handle in ReportDetailPage.
export const DRAG_HANDLE_CLASS = 'widget-drag-handle';

export default function WidgetCard({ widget, reportRange, canEdit, canDrag, onEdit, onClone, onDelete }) {
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

  return (
    <Card className="flex h-full flex-col overflow-hidden bg-background">
      <div className="group flex items-start gap-1.5 border-b bg-muted/15 px-2 py-2.5">
        {canDrag ? (
          <span className={`${DRAG_HANDLE_CLASS} mt-0.5 flex h-6 w-5 shrink-0 cursor-grab items-center justify-center rounded text-muted-foreground opacity-0 transition-opacity hover:bg-accent active:cursor-grabbing group-hover:opacity-100`} title="Drag to move">
            <GripVertical className="h-3.5 w-3.5" />
          </span>
        ) : <span className="w-1.5 shrink-0" />}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold">{widget.title}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="capitalize">{widget.chartType}</span>
            {!PIE_TYPES.has(widget.chartType) && <><span>·</span><span>{intervalLabel}</span></>}
            {ownRange && <Badge variant="outline" className="gap-1 text-[10px]"><CalendarRange className="h-3 w-3" />{widget.config.dateRange.startDate} to {widget.config.dateRange.endDate}</Badge>}
          </div>
        </div>
        {canEdit && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="ghost" size="icon" className="h-7 w-7 shrink-0" title="Widget options"><MoreHorizontal /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={onEdit}><Pencil /> Edit</DropdownMenuItem>
              <DropdownMenuItem onSelect={onClone}><Copy /> Clone</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={onDelete} className="text-destructive focus:bg-destructive/10 focus:text-destructive"><Trash2 /> Delete widget</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className="relative min-h-0 flex-1 p-3">
        {loading && !data ? <Loader className="h-full" /> : error ? (
          <div className="flex h-full items-center justify-center rounded-md border border-dashed border-destructive/30 p-4 text-center text-xs text-destructive">{error}</div>
        ) : <div className={`h-full transition-opacity ${loading ? 'opacity-40' : ''}`}><ReportChart chartType={widget.chartType} data={data} height="100%" /></div>}
        {/* Refetching (e.g. the report date range changed): keep the old chart dimmed under a spinner. */}
        {loading && data && <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>}
      </div>
    </Card>
  );
}
