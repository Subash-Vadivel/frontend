import { Eye, Info, PencilLine } from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { Badge } from '../ui/badge.jsx';

// Mirrors backend/app/mcp/tool_registry.py. Keep in sync when tools are added or changed.
const toolGroups = [
  {
    id: 'read',
    title: 'Read tools',
    description: 'Look up data. These never change anything in your workspace.',
    icon: Eye,
    tone: 'bg-balance/10 text-balance',
    badge: { variant: 'balance', label: 'Read-only' },
    tools: [
      { name: 'list_categories', summary: 'Lists the income or expense categories in this business, sorted by name, including any custom fields each one has. Can filter by name.', required: ['type'], optional: ['search', 'limit', 'offset'], example: 'What expense categories do we have?' },
      { name: 'list_income', summary: 'Lists income entries newest first, with optional date range, search and sorting. Also returns the total, average and count across every matching entry.', required: [], optional: ['startDate', 'endDate', 'search', 'sort', 'order', 'limit', 'offset'], example: 'Show all income from last month.' },
      { name: 'list_expenses', summary: 'Lists expense entries newest first, with optional date range, search and sorting. Also returns the total, average and count across every matching entry.', required: [], optional: ['startDate', 'endDate', 'search', 'sort', 'order', 'limit', 'offset'], example: 'How much did we spend between 1 and 15 September?' },
    ],
  },
  {
    id: 'write',
    title: 'Write tools',
    description: 'Add, change, or remove data. Entries are recorded under the person who created the API key.',
    icon: PencilLine,
    tone: 'bg-warning/10 text-warning',
    badge: { variant: 'warning', label: 'Changes data' },
    tools: [
      { name: 'create_category', summary: 'Creates a new income or expense category, with optional custom fields.', required: ['name', 'type'], optional: ['customFields'], example: 'Create an expense category called Travel with a Vendor text field.' },
      { name: 'create_income', summary: 'Records a new income entry in a category.', required: ['date', 'categoryId', 'amount'], optional: ['description', 'customFieldValues'], example: 'Add ₹15,000 income under Consulting for today.' },
      { name: 'update_income', summary: 'Edits an existing income entry. Only the fields you pass are changed.', required: ['id'], optional: ['date', 'categoryId', 'amount', 'description', 'customFieldValues'], example: 'Change yesterday’s consulting income to ₹18,000.' },
      { name: 'delete_income', summary: 'Permanently deletes an income entry.', required: ['id'], optional: [], example: 'Delete the duplicate income entry from Monday.', destructive: true },
      { name: 'create_expense', summary: 'Records a new expense entry in a category.', required: ['date', 'categoryId', 'amount'], optional: ['description', 'customFieldValues'], example: 'Log ₹2,400 for the internet bill under Utilities.' },
      { name: 'update_expense', summary: 'Edits an existing expense entry. Only the fields you pass are changed.', required: ['id'], optional: ['date', 'categoryId', 'amount', 'description', 'customFieldValues'], example: 'Move the ₹900 taxi expense to the Travel category.' },
      { name: 'delete_expense', summary: 'Permanently deletes an expense entry.', required: ['id'], optional: [], example: 'Remove the test expense I added this morning.', destructive: true },
    ],
  },
];

export const MCP_TOOL_COUNT = toolGroups.reduce((sum, group) => sum + group.tools.length, 0);

function ParamList({ label, params, required }) {
  if (!params.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-1">
      <span className="mr-0.5 text-[11px] text-muted-foreground">{label}</span>
      {params.map((param) => <code key={param} className={cn('rounded border px-1.5 py-0.5 font-mono text-[10px]', required ? 'bg-muted/50 text-foreground' : 'bg-background text-muted-foreground')}>{param}</code>)}
    </div>
  );
}

function ToolCard({ tool, badge }) {
  return (
    <div className="flex flex-col gap-2.5 rounded-lg border bg-background p-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <code className="font-mono text-[13px] font-semibold text-foreground">{tool.name}</code>
        {tool.destructive ? <Badge variant="expense">Permanent</Badge> : <Badge variant={badge.variant}>{badge.label}</Badge>}
      </div>
      <p className="text-xs leading-5 text-muted-foreground">{tool.summary}</p>
      <div className="grid gap-1.5">
        <ParamList label="Requires" params={tool.required} required />
        <ParamList label="Optional" params={tool.optional} />
        {!tool.required.length && !tool.optional.length && <span className="text-[11px] text-muted-foreground">No inputs</span>}
      </div>
      <p className="mt-auto rounded-md bg-muted/40 px-2.5 py-1.5 text-[11px] italic text-muted-foreground">“{tool.example}”</p>
    </div>
  );
}

export default function McpToolsCatalog() {
  return (
    <div className="grid gap-6">
      <div className="flex gap-2 rounded-md border bg-muted/20 p-3 text-xs text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span>Connected AI clients call these tools on your behalf. Every enabled API key can use all {MCP_TOOL_COUNT} tools and only sees this business's data. To cut off access, disable the key on the API keys tab. List tools return results in pages of up to 50 (max 200); the client asks for the next page with <code className="font-mono text-foreground">offset</code> when it needs more.</span>
      </div>
      {toolGroups.map(({ id, title, description, icon: Icon, tone, badge, tools }) => (
        <section key={id} className="grid gap-3">
          <div className="flex items-start gap-3">
            <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-md', tone)}><Icon className="h-4 w-4" /></span>
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold">{title}<span className="rounded-full bg-muted px-1.5 text-[10px] font-normal tabular-nums text-muted-foreground">{tools.length}</span></h3>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {tools.map((tool) => <ToolCard key={tool.name} tool={tool} badge={badge} />)}
          </div>
        </section>
      ))}
    </div>
  );
}
