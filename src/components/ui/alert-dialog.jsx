import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { cn } from '../../lib/utils.js';
import { buttonVariants } from './button.jsx';
export const AlertDialog=AlertDialogPrimitive.Root; export const AlertDialogTrigger=AlertDialogPrimitive.Trigger; export const AlertDialogPortal=AlertDialogPrimitive.Portal;
export function AlertDialogOverlay({className,...props}){return <AlertDialogPrimitive.Overlay className={cn('fixed inset-0 z-50 bg-background/80 backdrop-blur-sm',className)} {...props}/>}
export function AlertDialogContent({className,...props}){return <AlertDialogPortal><AlertDialogOverlay/><AlertDialogPrimitive.Content className={cn('fixed left-1/2 top-1/2 z-50 grid w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 rounded-lg border bg-background p-6 shadow-lg focus:outline-none',className)} {...props}/></AlertDialogPortal>}
export function AlertDialogHeader({className,...props}){return <div className={cn('flex flex-col space-y-2 text-left',className)} {...props}/>}
export function AlertDialogFooter({className,...props}){return <div className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',className)} {...props}/>}
export const AlertDialogTitle=AlertDialogPrimitive.Title; export const AlertDialogDescription=AlertDialogPrimitive.Description;
export function AlertDialogAction({className,...props}){return <AlertDialogPrimitive.Action className={cn(buttonVariants({variant:'destructive'}),className)} {...props}/>}
export function AlertDialogCancel({className,...props}){return <AlertDialogPrimitive.Cancel className={cn(buttonVariants({variant:'outline'}),className)} {...props}/>}
