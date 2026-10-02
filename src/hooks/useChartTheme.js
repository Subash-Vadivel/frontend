import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';

const readToken = (name) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

// shadcn-style tokens store bare HSL components ("158 64% 34%"), which SVG can't use as a fill.
const readHslToken = (name) => {
  const value = readToken(name);
  return value ? `hsl(${value})` : undefined;
};

const readChartTheme = () => ({
  axis: readToken('--chart-axis'),
  expense: readHslToken('--expense'),
  grid: readToken('--chart-grid'),
  income: readHslToken('--income'),
  balance: readHslToken('--balance'),
  tooltipBackground: readToken('--tooltip-bg'),
  tooltipBorder: readHslToken('--border'),
  tooltipText: readHslToken('--popover-foreground'),
  palette: [
    readToken('--chart-blue'),
    readToken('--chart-green'),
    readToken('--chart-red'),
    readToken('--chart-amber'),
    readToken('--chart-purple'),
    readToken('--chart-cyan'),
    readToken('--chart-pink'),
  ],
});

export function useChartTheme() {
  const { theme } = useTheme();
  const [colors, setColors] = useState(readChartTheme);

  // ThemeProvider toggles the `dark` class in an effect that runs after this component renders,
  // so re-read the tokens whenever the root element's class or theme attribute actually changes.
  useEffect(() => {
    const root = document.documentElement;
    const refresh = () => setColors(readChartTheme());
    refresh();
    const observer = new MutationObserver(refresh);
    observer.observe(root, { attributes: true, attributeFilter: ['class', 'data-theme'] });
    return () => observer.disconnect();
  }, []);

  return { activeTheme: theme, ...colors };
}
