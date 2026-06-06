const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
});

const monthFormatter = new Intl.DateTimeFormat('en-IN', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

export const formatCurrency = (value) => inrFormatter.format(Number(value) || 0);

export const formatMonthYear = (value) => {
  const match = /^(\d{4})-(\d{2})$/.exec(value || '');
  if (!match) return value;

  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  if (monthIndex < 0 || monthIndex > 11) return value;

  const [month, formattedYear] = monthFormatter
    .formatToParts(new Date(Date.UTC(year, monthIndex, 1)))
    .filter((part) => part.type === 'month' || part.type === 'year')
    .map((part) => part.value);

  return month && formattedYear ? `${month} - ${formattedYear}` : value;
};
