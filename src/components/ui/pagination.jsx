import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button.jsx';

export function Pagination({ total, limit, offset, onOffsetChange, disabled = false, itemLabel = 'entries' }) {
  if (!total) return null;
  const page = Math.floor(offset / limit) + 1;
  const pageCount = Math.max(1, Math.ceil(total / limit));
  const first = offset + 1;
  const last = Math.min(offset + limit, total);
  return (
    <div className="flex flex-col items-center justify-between gap-2 border-t pt-3 text-xs text-muted-foreground sm:flex-row">
      <span className="tabular-nums">Showing {first}–{last} of {total} {itemLabel}</span>
      {pageCount > 1 && (
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" disabled={disabled || page <= 1} onClick={() => onOffsetChange(Math.max(0, offset - limit))}><ChevronLeft /> Previous</Button>
          <span className="tabular-nums">Page {page} of {pageCount}</span>
          <Button type="button" variant="outline" size="sm" disabled={disabled || page >= pageCount} onClick={() => onOffsetChange(offset + limit)}>Next <ChevronRight /></Button>
        </div>
      )}
    </div>
  );
}
