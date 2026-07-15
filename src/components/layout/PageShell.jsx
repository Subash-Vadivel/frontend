import { cn } from '../../lib/utils.js';

export default function PageShell({ title, eyebrow, description, actions, children, className = '' }) {
  return (
    <section className={cn('grid gap-4', className)}>
      <header className="flex flex-col gap-3 border-b pb-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          {eyebrow && <p className="mb-1 text-[11px] font-medium uppercase text-muted-foreground">{eyebrow}</p>}
          <h1 className="text-xl font-semibold tracking-normal text-foreground sm:text-2xl">{title}</h1>
          {description && <p className="mt-1 max-w-2xl text-[13px] text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2 lg:justify-end">{actions}</div>}
      </header>
      {children}
    </section>
  );
}
