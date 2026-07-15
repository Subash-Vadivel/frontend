import { ArrowUpDown, Eye, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '../ui/button.jsx';
import { Badge } from '../ui/badge.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table.jsx';
import { formatCurrency } from '../../utils/formatters.js';

function SortHeader({ sortKey, onSort, children }) {
  return (
    <button className="inline-flex items-center gap-1" type="button" onClick={() => onSort(sortKey)}>
      {children}<ArrowUpDown className="h-3 w-3" />
    </button>
  );
}

export default function TransactionTable({ entries, onView, onDelete, query = '' }) {
  const [sort, setSort] = useState({ key: 'date', dir: 'desc' });
  const rows = useMemo(() => {
    const q = query.toLowerCase().trim();
    return entries
      .filter((entry) => !q || `${entry.date} ${entry.categoryName} ${entry.description} ${entry.amount}`.toLowerCase().includes(q))
      .sort((a, b) => {
        const dir = sort.dir === 'asc' ? 1 : -1;
        if (sort.key === 'amount') return ((Number(a.amount)||0) - (Number(b.amount)||0)) * dir;
        return String(a[sort.key] || '').localeCompare(String(b[sort.key] || '')) * dir;
      });
  }, [entries, query, sort]);
  const toggleSort = (key) => setSort((current) => current.key === key ? { key, dir: current.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' });
  if (!rows.length) return <div className="rounded-lg border border-dashed bg-muted/20 p-10 text-center text-xs text-muted-foreground">No matching entries.</div>;
  return (
    <Table>
      <TableHeader><TableRow><TableHead><SortHeader sortKey="date" onSort={toggleSort}>Date</SortHeader></TableHead><TableHead><SortHeader sortKey="categoryName" onSort={toggleSort}>Category</SortHeader></TableHead><TableHead>Description</TableHead><TableHead className="text-right"><SortHeader sortKey="amount" onSort={toggleSort}>Amount</SortHeader></TableHead><TableHead className="w-24 text-right">Actions</TableHead></TableRow></TableHeader>
      <TableBody>{rows.map((entry) => <TableRow key={entry.id} className="cursor-pointer" onClick={() => onView(entry)}><TableCell className="font-mono text-xs">{entry.date}</TableCell><TableCell><Badge variant="outline">{entry.categoryName}</Badge></TableCell><TableCell className="max-w-[360px] truncate">{entry.description || '-'}</TableCell><TableCell className="text-right font-medium text-foreground">{formatCurrency(entry.amount)}</TableCell><TableCell className="text-right"><div className="flex justify-end gap-1"><Button type="button" variant="ghost" size="icon" title="View entry" onClick={(event) => { event.stopPropagation(); onView(entry); }}><Eye /></Button><Button type="button" variant="ghost" size="icon" title="Delete entry" className="text-destructive hover:text-destructive" onClick={(event) => { event.stopPropagation(); onDelete(entry.id); }}><Trash2 /></Button></div></TableCell></TableRow>)}</TableBody>
    </Table>
  );
}
