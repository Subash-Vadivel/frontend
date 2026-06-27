import { labelForRange, rangeOptions } from '../../utils/dateRanges';

export default function DateRangeFilter({ label, rangeMode, dateRange, onChange }) {
  const customLabel = rangeMode === 'custom' ? labelForRange(rangeMode, dateRange) : '';

  return (
    <div className="dashboard-filter">
      {customLabel && <span>{customLabel}</span>}
      <select value={rangeMode} onChange={(event) => onChange(event.target.value)} aria-label={label}>
        {rangeOptions.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
}
