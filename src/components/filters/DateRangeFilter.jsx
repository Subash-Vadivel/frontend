import { labelForRange, rangeOptions } from '../../utils/dateRanges';

export default function DateRangeFilter({ label, rangeMode, dateRange, onChange }) {
  return (
    <div className="dashboard-filter">
      <span>{labelForRange(rangeMode, dateRange)}</span>
      <select value={rangeMode} onChange={(event) => onChange(event.target.value)} aria-label={label}>
        {rangeOptions.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
}
