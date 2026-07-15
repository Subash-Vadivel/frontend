import { labelForRange, rangeOptions } from '../../utils/dateRanges';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select.jsx';

export default function DateRangeFilter({ label, rangeMode, dateRange, onChange }) {
  const customLabel = rangeMode === 'custom' ? labelForRange(rangeMode, dateRange) : '';
  return (
    <div className="flex flex-wrap items-center gap-2">
      {customLabel && <span className="text-sm text-muted-foreground">{customLabel}</span>}
      <Select value={rangeMode} onValueChange={onChange}>
        <SelectTrigger className="w-[180px]" aria-label={label}><SelectValue /></SelectTrigger>
        <SelectContent>
          {rangeOptions.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}
