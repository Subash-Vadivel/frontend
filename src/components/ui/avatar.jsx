import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from '../../lib/utils.js';
export function Avatar({className,...props}){return <AvatarPrimitive.Root className={cn('relative flex h-9 w-9 shrink-0 overflow-hidden rounded-lg',className)} {...props}/>}
export function AvatarImage({className,...props}){return <AvatarPrimitive.Image className={cn('aspect-square h-full w-full',className)} {...props}/>}
export function AvatarFallback({className,...props}){return <AvatarPrimitive.Fallback className={cn('flex h-full w-full items-center justify-center rounded-lg bg-muted text-sm font-medium',className)} {...props}/>}
