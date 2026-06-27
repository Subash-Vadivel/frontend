import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';

const readToken = (name) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export function useChartTheme() {
  const { theme } = useTheme();

  return useMemo(() => ({
    activeTheme: theme,
    axis: readToken('--chart-axis'),
    expense: readToken('--expense'),
    grid: readToken('--chart-grid'),
    income: readToken('--income'),
    tooltipBackground: readToken('--tooltip-bg'),
    tooltipBorder: readToken('--border-strong'),
    tooltipText: readToken('--text-primary'),
    palette: [
      readToken('--chart-blue'),
      readToken('--chart-green'),
      readToken('--chart-red'),
      readToken('--chart-amber'),
      readToken('--chart-purple'),
      readToken('--chart-cyan'),
      readToken('--chart-pink'),
    ],
  }), [theme]);
}
