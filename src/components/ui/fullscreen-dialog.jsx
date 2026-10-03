import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './dialog.jsx';

// A dialog that covers the whole viewport; children get the remaining height (use h-full inside).
export function FullscreenDialog({ open, onOpenChange, title, description, children }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="left-0 top-0 flex h-[100dvh] max-h-none w-screen max-w-none translate-x-0 translate-y-0 flex-col gap-3 rounded-none border-0 p-4 sm:p-6">
        <DialogHeader className="pr-8">
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : <DialogDescription className="sr-only">Full screen view</DialogDescription>}
        </DialogHeader>
        <div className="min-h-0 flex-1">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
