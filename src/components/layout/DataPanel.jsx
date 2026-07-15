import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card.jsx';
import { cn } from '../../lib/utils.js';

export default function DataPanel({ title, eyebrow, description, action, children, className = '' }) {
  return (
    <Card className={cn('overflow-hidden bg-background', className)}>
      {(title || eyebrow || description || action) && (
        <CardHeader className="flex flex-col gap-3 space-y-0 border-b bg-muted/15 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            {eyebrow && <p className="mb-1 text-[11px] font-medium uppercase text-muted-foreground">{eyebrow}</p>}
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription className="mt-1">{description}</CardDescription>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </CardHeader>
      )}
      <CardContent className={(title || eyebrow || description || action) ? 'p-4' : 'p-4'}>{children}</CardContent>
    </Card>
  );
}
