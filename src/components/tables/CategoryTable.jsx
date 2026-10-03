import { Trash2 } from 'lucide-react';
import { Badge } from '../ui/badge.jsx';
import { Button } from '../ui/button.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table.jsx';
const formatDate = (value) => { if (!value) return '-'; return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value)); };
const typeLabel = { income: 'Income', expense: 'Expense' };
export default function CategoryTable({ categories, onDelete }) {
  if (!categories.length) return <div className="rounded-lg border border-dashed bg-muted/20 p-10 text-center text-xs text-muted-foreground">No categories match this view.</div>;
  return <Table><TableHeader><TableRow><TableHead>Category</TableHead><TableHead>Type</TableHead><TableHead className="text-right">Custom fields</TableHead><TableHead>Created</TableHead>{onDelete && <TableHead className="w-16 text-right">Actions</TableHead>}</TableRow></TableHeader><TableBody>{categories.map((category) => <TableRow key={category.id}><TableCell className="font-medium text-foreground">{category.name}</TableCell><TableCell><Badge variant={category.type}>{typeLabel[category.type] || category.type}</Badge></TableCell><TableCell className="text-right">{category.customFields?.length || 0}</TableCell><TableCell className="font-mono text-xs">{formatDate(category.createdAt)}</TableCell>{onDelete && <TableCell className="text-right"><Button type="button" variant="ghost" size="icon" className="text-destructive hover:text-destructive" title="Delete category" onClick={() => onDelete(category)}><Trash2 /></Button></TableCell>}</TableRow>)}</TableBody></Table>;
}
