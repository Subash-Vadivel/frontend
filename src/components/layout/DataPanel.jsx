import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card.jsx';
import { ExpandButton } from '../ui/expand-button.jsx';
import { FullscreenDialog } from '../ui/fullscreen-dialog.jsx';
import { cn } from '../../lib/utils.js';

// renderExpanded: when set, shows a full-screen button; it renders the panel's content at full size.
export default function DataPanel({ title, eyebrow, description, action, children, className = '', renderExpanded }) {
  const [expanded, setExpanded] = useState(false);
  const headerAction = renderExpanded
    ? <div className="flex items-center gap-1">{action}<ExpandButton onClick={() => setExpanded(true)} /></div>
    : action;
  return (
    <>
      <Card className={cn('overflow-hidden bg-background', className)}>
        {(title || eyebrow || description || headerAction) && (
          <CardHeader className="flex flex-col gap-3 space-y-0 border-b bg-muted/15 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              {eyebrow && <p className="mb-1 text-[11px] font-medium uppercase text-muted-foreground">{eyebrow}</p>}
              {title && <CardTitle>{title}</CardTitle>}
              {description && <CardDescription className="mt-1">{description}</CardDescription>}
            </div>
            {headerAction && <div className="shrink-0">{headerAction}</div>}
          </CardHeader>
        )}
        <CardContent className="p-4">{children}</CardContent>
      </Card>
      {renderExpanded && (
        <FullscreenDialog open={expanded} onOpenChange={setExpanded} title={title} description={description}>
          {expanded && renderExpanded()}
        </FullscreenDialog>
      )}
    </>
  );
}
