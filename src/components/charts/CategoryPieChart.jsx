import { useMemo, useState } from 'react';
import { Pie, PieChart, Sector } from 'recharts';
import { useChartTheme } from '../../hooks/useChartTheme.js';
import { cn } from '../../lib/utils.js';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip.jsx';
import DataPanel from '../layout/DataPanel.jsx';
import { formatCurrency } from '../../utils/formatters';

const MAX_SLICES = 6;
const SIZE = 216;

const groupSlices = (data) => {
  const sorted = data
    .map((item) => ({ name: item.categoryName, value: Number(item.total) || 0 }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);
  if (sorted.length <= MAX_SLICES) return sorted;
  const rest = sorted.slice(MAX_SLICES - 1);
  return [...sorted.slice(0, MAX_SLICES - 1), { name: `Other (${rest.length})`, value: rest.reduce((sum, item) => sum + item.value, 0) }];
};

const formatPercent = (value, total) => `${total ? ((value / total) * 100).toFixed(1) : '0.0'}%`;

const EXPANDED_SIZE = 380;

export default function CategoryPieChart({ title, data }) {
  const chartTheme = useChartTheme();
  const slices = useMemo(() => groupSlices(data).map((slice, index) => ({ ...slice, fill: chartTheme.palette[index % chartTheme.palette.length] })), [data, chartTheme.palette]);
  const total = useMemo(() => slices.reduce((sum, slice) => sum + slice.value, 0), [slices]);
  return (
    <DataPanel title={title} description="Category contribution for the selected date range." renderExpanded={slices.length ? () => <div className="flex h-full items-center justify-center"><DonutBody slices={slices} total={total} size={EXPANDED_SIZE} /></div> : undefined}>
      {slices.length ? <DonutBody slices={slices} total={total} size={SIZE} /> : <div className="rounded-lg border border-dashed bg-muted/20 p-8 text-center text-xs text-muted-foreground">No data yet.</div>}
    </DataPanel>
  );
}

function DonutBody({ slices, total, size }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const active = activeIndex == null ? null : slices[activeIndex];

  const renderSlice = (props, index) => {
    const isActive = index === activeIndex;
    const isDimmed = activeIndex != null && !isActive;
    return (
      <g style={{ transformOrigin: `${props.cx}px ${props.cy}px`, transform: isActive ? 'scale(1.06)' : 'scale(1)', opacity: isDimmed ? 0.35 : 1, transition: 'transform 220ms cubic-bezier(.2,.8,.2,1), opacity 220ms ease' }}>
        <Sector {...props} stroke="none" />
      </g>
    );
  };

  return (
    <div className={cn('flex w-full flex-col items-center gap-5 sm:flex-row sm:items-center', size > SIZE && 'max-w-4xl')}>
      <div className="relative shrink-0" style={{ width: size, height: size }} onMouseLeave={() => setActiveIndex(null)}>
        <PieChart width={size} height={size} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <Pie
            data={slices}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={Math.round(size * 0.305)}
            outerRadius={Math.round(size * 0.444)}
            paddingAngle={slices.length > 1 ? 2.5 : 0}
            cornerRadius={6}
            startAngle={90}
            endAngle={-270}
            stroke="none"
            rootTabIndex={-1}
            animationBegin={0}
            animationDuration={900}
            animationEasing="ease-out"
            shape={renderSlice}
            onMouseEnter={(_, index) => setActiveIndex(index)}
          />
        </PieChart>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-12 text-center">
          <span className="max-w-full truncate text-[11px] text-muted-foreground">{active ? active.name : 'Total'}</span>
          <span className="mt-0.5 max-w-full truncate text-base font-semibold tabular-nums">{formatCurrency(active ? active.value : total)}</span>
          <span className="mt-0.5 text-[11px] tabular-nums text-muted-foreground">{active ? formatPercent(active.value, total) : `${slices.length} ${slices.length === 1 ? 'category' : 'categories'}`}</span>
        </div>
      </div>
      <TooltipProvider delayDuration={150}>
        <ul className="grid w-full min-w-0 gap-1 sm:w-auto sm:flex-1" onMouseLeave={() => setActiveIndex(null)}>
          {slices.map((slice, index) => (
            <Tooltip key={slice.name}>
              <TooltipTrigger asChild>
                <li
                  onMouseEnter={() => setActiveIndex(index)}
                  className={cn('flex min-w-0 cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-[background-color,opacity] duration-200', activeIndex === index && 'bg-muted/60', activeIndex != null && activeIndex !== index && 'opacity-50')}
                >
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: slice.fill }} />
                  <span className="min-w-0 flex-1 truncate">{slice.name}</span>
                  <span className="max-w-[45%] shrink-0 truncate font-medium tabular-nums">{formatCurrency(slice.value)}</span>
                  <span className="w-11 shrink-0 text-right tabular-nums text-muted-foreground">{formatPercent(slice.value, total)}</span>
                </li>
              </TooltipTrigger>
              <TooltipContent side="top" align="start" className="max-w-xs">
                <div className="flex items-center gap-2 font-medium"><span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: slice.fill }} /><span className="break-words">{slice.name}</span></div>
                <div className="mt-0.5 tabular-nums text-muted-foreground">{formatCurrency(slice.value)} · {formatPercent(slice.value, total)}</div>
              </TooltipContent>
            </Tooltip>
          ))}
        </ul>
      </TooltipProvider>
    </div>
  );
}
