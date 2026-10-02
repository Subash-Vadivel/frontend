import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils.js';

export function Loader({ label = 'Loading', fullScreen = false, className, ...props }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn('flex w-full flex-col items-center justify-center gap-3 text-muted-foreground', fullScreen ? 'min-h-screen bg-background' : 'min-h-48 py-10', className)}
      {...props}
    >
      <Loader2 className={cn('animate-spin text-primary', fullScreen ? 'h-8 w-8' : 'h-6 w-6')} aria-hidden="true" />
      {label && <span className="text-xs">{label}</span>}
    </div>
  );
}
