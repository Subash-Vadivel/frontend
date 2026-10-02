import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalSearch } from '../../hooks/useGlobalSearch.js';
import { Badge } from '../ui/badge.jsx';
import { Loader } from '../ui/loader.jsx';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog.jsx';
import { Input } from '../ui/input.jsx';
import { APP_NAME } from '../../lib/brand.js';

export default function CommandPalette({ open, onOpenChange }) {
  const navigate = useNavigate();
  const { load, search, loading, error, total } = useGlobalSearch();
  const [query, setQuery] = useState('');
  useEffect(() => { if (open) load(); }, [load, open]);
  useEffect(() => { if (!open) setQuery(''); }, [open]);
  const results = useMemo(() => search(query), [query, search]);
  const go = (to) => {
    onOpenChange(false);
    navigate(to);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-[18%] max-w-2xl translate-y-0 p-0">
        <DialogHeader className="sr-only"><DialogTitle>Command search</DialogTitle><DialogDescription>Search pages, transactions, categories, and MCP keys.</DialogDescription></DialogHeader>
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 text-muted-foreground" />
          <Input className="h-12 border-0 px-0 text-sm shadow-none focus-visible:ring-0" autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${APP_NAME}...`} />
        </div>
        <div className="max-h-[420px] overflow-auto p-2">
          {error && <div className="mb-2 rounded-md border border-destructive/20 bg-destructive/10 p-2 text-xs text-destructive">{error}</div>}
          {loading && <Loader label="Indexing app data" className="min-h-0 py-6" />}
          {!loading && results.length === 0 && <div className="p-8 text-center text-xs text-muted-foreground">No results found.</div>}
          {!loading && results.map((result) => {
            const Icon = result.icon;
            return (
              <button key={result.id} className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left hover:bg-accent" type="button" onClick={() => go(result.to)}>
                <span className="flex h-8 w-8 items-center justify-center rounded-md border bg-background"><Icon className="h-4 w-4" /></span>
                <span className="min-w-0 flex-1"><span className="block truncate text-[13px] font-medium">{result.label}</span><span className="block truncate text-xs text-muted-foreground">{result.description}</span></span>
                <Badge variant="outline">{result.kind}</Badge>
              </button>
            );
          })}
        </div>
        <div className="flex items-center justify-between border-t px-3 py-2 text-[11px] text-muted-foreground"><span>{total} indexed items</span><span>Press Enter by selecting a result</span></div>
      </DialogContent>
    </Dialog>
  );
}
