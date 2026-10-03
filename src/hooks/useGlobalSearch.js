import { BarChart3, FolderTree, KeyRound, Plus, ReceiptText, Users, WalletCards } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { listAllCategories } from '../api/categoryApi';
import { listMcpApiKeys } from '../api/mcpApi';
import { listTransactions } from '../api/transactionApi';
import { formatCurrency } from '../utils/formatters';

const routeItems = [
  { id: 'route-dashboard', kind: 'Page', label: 'Dashboard', description: 'Executive overview and analytics', to: '/dashboard', icon: BarChart3 },
  { id: 'route-income', kind: 'Page', label: 'Income', description: 'Review and add revenue entries', to: '/income', icon: WalletCards },
  { id: 'route-expenses', kind: 'Page', label: 'Expenses', description: 'Review and add operating costs', to: '/expenses', icon: ReceiptText },
  { id: 'route-categories', kind: 'Page', label: 'Categories', description: 'Configure taxonomy and custom fields', to: '/categories', icon: FolderTree },
  { id: 'route-mcp', kind: 'Page', label: 'MCP API keys', description: 'Connect AI assistants (account-wide)', to: '/account/mcp', icon: KeyRound },
  { id: 'route-users', kind: 'Page', label: 'Users', description: 'Business members and invitations', to: '/users', icon: Users },
  { id: 'action-add-income', kind: 'Action', label: 'Add income entry', description: 'Open the income ledger and create a record', to: '/income?action=create', icon: Plus },
  { id: 'action-add-expense', kind: 'Action', label: 'Add expense entry', description: 'Open the expense ledger and create a record', to: '/expenses?action=create', icon: Plus },
];

// Only the most recent entries are indexed for quick search; the ledgers search the full history.
const RECENT_ENTRY_LIMIT = 100;

const normalize = (value) => String(value || '').toLowerCase();

export function useGlobalSearch() {
  const [items, setItems] = useState(routeItems);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (loaded || loading) return;
    setLoading(true);
    setError('');
    try {
      const [{ items: income }, { items: expenses }, incomeCategories, expenseCategories, apiKeys] = await Promise.all([
        listTransactions('income', {}, { limit: RECENT_ENTRY_LIMIT }),
        listTransactions('expense', {}, { limit: RECENT_ENTRY_LIMIT }),
        listAllCategories('income'),
        listAllCategories('expense'),
        listMcpApiKeys().catch(() => []),
      ]);
      const transactionItems = [
        ...income.map((entry) => ({
          id: `income-${entry.id}`,
          kind: 'Income',
          label: entry.description || entry.categoryName || 'Income entry',
          description: `${entry.date} · ${entry.categoryName} · ${formatCurrency(entry.amount)}`,
          to: `/income?entry=${entry.id}`,
          icon: WalletCards,
          searchText: `${entry.description} ${entry.categoryName} ${entry.date} ${entry.amount}`,
        })),
        ...expenses.map((entry) => ({
          id: `expense-${entry.id}`,
          kind: 'Expense',
          label: entry.description || entry.categoryName || 'Expense entry',
          description: `${entry.date} · ${entry.categoryName} · ${formatCurrency(entry.amount)}`,
          to: `/expenses?entry=${entry.id}`,
          icon: ReceiptText,
          searchText: `${entry.description} ${entry.categoryName} ${entry.date} ${entry.amount}`,
        })),
      ];
      const categoryItems = [...incomeCategories, ...expenseCategories].map((category) => ({
        id: `category-${category.id}`,
        kind: 'Category',
        label: category.name,
        description: `${category.type} · ${category.customFields?.length || 0} custom fields`,
        to: '/categories',
        icon: FolderTree,
        searchText: `${category.name} ${category.type}`,
      }));
      const keyItems = apiKeys.map((apiKey) => ({
        id: `mcp-${apiKey.id}`,
        kind: 'MCP key',
        label: apiKey.name,
        description: `${apiKey.enabled ? 'Enabled' : 'Disabled'} · ${apiKey.keyPrefix || 'key'}...`,
        to: '/account/mcp',
        icon: KeyRound,
        searchText: `${apiKey.name} ${apiKey.keyPrefix} ${apiKey.enabled ? 'enabled' : 'disabled'}`,
      }));
      setItems([...routeItems, ...transactionItems, ...categoryItems, ...keyItems]);
      setLoaded(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Search data could not be loaded');
      setItems(routeItems);
    } finally {
      setLoading(false);
    }
  }, [loaded, loading]);

  const search = useCallback((query) => {
    const q = normalize(query).trim();
    if (!q) return items.slice(0, 12);
    return items
      .map((item) => {
        const haystack = normalize(`${item.kind} ${item.label} ${item.description} ${item.searchText || ''}`);
        let score = haystack.includes(q) ? 1 : 0;
        if (normalize(item.label).startsWith(q)) score += 2;
        if (normalize(item.kind) === q) score += 1;
        return { item, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score || a.item.label.localeCompare(b.item.label))
      .slice(0, 20)
      .map(({ item }) => item);
  }, [items]);

  return useMemo(() => ({ load, search, loading, error, total: items.length }), [error, items.length, load, loading, search]);
}
