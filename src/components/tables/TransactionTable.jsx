import { ArrowDown, ArrowUp, ArrowUpDown, Eye, Trash2 } from 'lucide-react';
import { Button } from '../ui/button.jsx';
import { Badge } from '../ui/badge.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table.jsx';
import { formatCurrency } from '../../utils/formatters.js';

function SortHeader({ sortKey, sort, onSort, children }) {
  const active = sort.key === sortKey;
  const Icon = !active ? ArrowUpDown : sort.dir === 'asc' ? ArrowUp : ArrowDown;
  return (
    <button className={`inline-flex items-center gap-1 ${active ? 'text-foreground' : ''}`} type="button" onClick={() => onSort(sortKey)}>
      {children}<Icon className="h-3 w-3" />
    </button>
  );
}

// Sorting happens on the server; this table just renders the current page and reports header clicks.
export default function TransactionTable({ entries, onView, onDelete, sort, onSortChange, canDelete = true, emptyMessage = 'No matching entries.' }) {
  const rows = entries;
  const toggleSort = (key) => onSortChange(sort.key === key ? { key, dir: sort.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: key === 'category' ? 'asc' : 'desc' });
  if (!rows.length) return <div className="rounded-lg border border-dashed bg-muted/20 p-10 text-center text-xs text-muted-foreground">{emptyMessage}</div>;
  return (
    <Table>
      <TableHeader><TableRow><TableHead><SortHeader sortKey="date" sort={sort} onSort={toggleSort}>Date</SortHeader></TableHead><TableHead><SortHeader sortKey="category" sort={sort} onSort={toggleSort}>Category</SortHeader></TableHead><TableHead>Description</TableHead><TableHead className="text-right"><SortHeader sortKey="amount" sort={sort} onSort={toggleSort}>Amount</SortHeader></TableHead><TableHead className="w-24 text-right">Actions</TableHead></TableRow></TableHeader>
      <TableBody>{rows.map((entry) => <TableRow key={entry.id} className="cursor-pointer" onClick={() => onView(entry)}><TableCell className="font-mono text-xs">{entry.date}</TableCell><TableCell><Badge variant="outline">{entry.categoryName}</Badge></TableCell><TableCell className="max-w-[360px] truncate">{entry.description || '-'}</TableCell><TableCell className="text-right font-medium text-foreground">{formatCurrency(entry.amount)}</TableCell><TableCell className="text-right"><div className="flex justify-end gap-1"><Button type="button" variant="ghost" size="icon" title="View entry" onClick={(event) => { event.stopPropagation(); onView(entry); }}><Eye /></Button>{canDelete && <Button type="button" variant="ghost" size="icon" title="Delete entry" className="text-destructive hover:text-destructive" onClick={(event) => { event.stopPropagation(); onDelete(entry.id); }}><Trash2 /></Button>}</div></TableCell></TableRow>)}</TableBody>
    </Table>
  );
}
