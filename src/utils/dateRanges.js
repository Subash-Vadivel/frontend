const dateToInputValue = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const rangeOptions = [
  { value: 'thisMonth', label: 'This month' },
  { value: '30', label: 'Last 30 days' },
  { value: '60', label: 'Last 60 days' },
  { value: '90', label: 'Last 90 days' },
  { value: 'all', label: 'All Time' },
  { value: 'custom', label: 'Custom' },
];

export const thisMonthRange = () => {
  const end = new Date();
  const start = new Date(end.getFullYear(), end.getMonth(), 1);
  return { startDate: dateToInputValue(start), endDate: dateToInputValue(end) };
};

export const presetRange = (days) => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - (days - 1));
  return { startDate: dateToInputValue(start), endDate: dateToInputValue(end) };
};

export const rangeForMode = (mode) => {
  if (mode === 'thisMonth') return thisMonthRange();
  if (mode === 'all') return {};
  return presetRange(Number(mode));
};

export const labelForRange = (mode, range) => {
  if (mode === 'custom' && range.startDate && range.endDate) {
    return `${range.startDate} to ${range.endDate}`;
  }
  return rangeOptions.find((option) => option.value === mode)?.label || '';
};
