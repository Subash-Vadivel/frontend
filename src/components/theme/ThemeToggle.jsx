import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';
import { Button } from '../ui/button.jsx';
import { cn } from '../../lib/utils.js';

export default function ThemeToggle({ className = '', compact = false }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const Icon = isDark ? Sun : Moon;

  return (
    <Button
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(compact && 'w-10 px-0', className)}
      onClick={toggleTheme}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      type="button"
      variant="outline"
      size={compact ? 'icon' : 'default'}
    >
      <Icon />
      {!compact && <span>{isDark ? 'Light' : 'Dark'}</span>}
    </Button>
  );
}
