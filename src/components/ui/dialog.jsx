import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils.js';
export const Dialog=DialogPrimitive.Root; export const DialogTrigger=DialogPrimitive.Trigger; export const DialogPortal=DialogPrimitive.Portal; export const DialogClose=DialogPrimitive.Close;
export function DialogOverlay({className,...props}){return <DialogPrimitive.Overlay className={cn('fixed inset-0 z-50 bg-background/80 backdrop-blur-sm',className)} {...props}/>}
export function DialogContent({className,children,...props}){return <DialogPortal><DialogOverlay/><DialogPrimitive.Content className={cn('fixed left-1/2 top-1/2 z-50 grid w-[calc(100%-2rem)] max-w-2xl max-h-[90vh] -translate-x-1/2 -translate-y-1/2 gap-4 overflow-auto rounded-lg border bg-background p-6 shadow-lg focus:outline-none',className)} {...props}>{children}<DialogPrimitive.Close className="absolute right-4 top-4 rounded-md opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring"><X className="h-4 w-4"/><span className="sr-only">Close</span></DialogPrimitive.Close></DialogPrimitive.Content></DialogPortal>}
export function DialogHeader({className,...props}){return <div className={cn('flex flex-col space-y-1.5 text-left',className)} {...props}/>}
export function DialogFooter({className,...props}){return <div className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',className)} {...props}/>}
export const DialogTitle=DialogPrimitive.Title; export const DialogDescription=DialogPrimitive.Description;
