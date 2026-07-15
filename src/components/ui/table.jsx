import { cn } from '../../lib/utils.js';
export function Table({className,...props}){return <div className="w-full overflow-auto rounded-lg border"><table className={cn('w-full caption-bottom text-[13px]',className)} {...props}/></div>}
export function TableHeader({className,...props}){return <thead className={cn('[&_tr]:border-b bg-muted/35',className)} {...props}/>}
export function TableBody({className,...props}){return <tbody className={cn('[&_tr:last-child]:border-0',className)} {...props}/>}
export function TableRow({className,...props}){return <tr className={cn('border-b transition-colors hover:bg-muted/35 data-[state=selected]:bg-muted',className)} {...props}/>}
export function TableHead({className,...props}){return <th className={cn('h-9 px-3 text-left align-middle text-[11px] font-medium uppercase tracking-normal text-muted-foreground',className)} {...props}/>}
export function TableCell({className,...props}){return <td className={cn('px-3 py-2.5 align-middle text-muted-foreground',className)} {...props}/>}
