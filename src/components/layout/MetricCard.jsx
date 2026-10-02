import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Card, CardContent } from '../ui/card.jsx';
import { cn } from '../../lib/utils.js';

const toneStyles = { income: 'text-income bg-income/10', expense: 'text-expense bg-expense/10', balance: 'text-balance bg-balance/10', neutral: 'text-muted-foreground bg-muted' };
const deltaStyles = { up: 'text-income', down: 'text-expense', flat: 'text-muted-foreground' };

export default function MetricCard({ label, value, detail, icon: Icon, tone = 'neutral', delta, deltaDirection = 'flat' }) {
  const DeltaIcon = deltaDirection === 'down' ? ArrowDownRight : ArrowUpRight;
  return (
    <Card className="bg-background">
      <CardContent className="p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
          {Icon && <span className={cn('flex h-7 w-7 items-center justify-center rounded-md', toneStyles[tone] || toneStyles.neutral)}><Icon className="h-3.5 w-3.5" /></span>}
        </div>
        <strong className="block truncate text-2xl font-semibold tracking-tight text-foreground">{value}</strong>
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          {delta && <span className={cn('inline-flex items-center gap-1 font-medium', deltaStyles[deltaDirection])}><DeltaIcon className="h-3 w-3" />{delta}</span>}
          {detail && <span className="truncate">{detail}</span>}
        </div>
      </CardContent>
    </Card>
  );
}
