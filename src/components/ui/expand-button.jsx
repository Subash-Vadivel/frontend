import { Maximize2 } from 'lucide-react';
import { Button } from './button.jsx';

export function ExpandButton({ onClick, className = 'h-7 w-7' }) {
  return <Button type="button" variant="ghost" size="icon" className={className} title="Full screen" aria-label="Open full screen" onClick={onClick}><Maximize2 /></Button>;
}
