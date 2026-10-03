import { Building2, ChartNoAxesCombined, Eye, Info, PencilLine } from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { Badge } from '../ui/badge.jsx';

// Mirrors backend/app/mcp/tool_registry.py. Keep in sync when tools are added or changed.
// workspaceId is added to "Requires" for every group except 'account', matching the schemas the
// server sends (ToolDefinition.to_mcp).
const toolGroups = [
  {
    id: 'account',
    title: 'Workspace tools',
    description: 'Find or create workspaces. Clients call list_workspaces first to get the workspaceId every other tool needs.',
    icon: Building2,
    tone: 'bg-primary/10 text-primary',
    badge: { variant: 'balance', label: 'Account' },
    tools: [
      { name: 'list_workspaces', summary: 'Lists the workspaces you belong to, with your role in each (owner, admin, manager or viewer).', required: [], optional: [], example: 'Which businesses can you see?' },
      { name: 'create_workspace', summary: 'Creates a new workspace. You become its owner.', required: ['name'], optional: ['legalName'], example: 'Create a workspace for my new dairy farm.' },
    ],
  },
  {
    id: 'read',
    title: 'Read tools',
    description: 'Look up data. These never change anything, and work for every role.',
    icon: Eye,
    tone: 'bg-balance/10 text-balance',
    badge: { variant: 'balance', label: 'Read-only' },
    tools: [
      { name: 'list_categories', summary: 'Lists income or expense categories with their custom fields. Category and field ids are what report widgets chart.', required: ['type'], optional: ['search', 'limit', 'offset'], example: 'What expense categories do we have?' },
      { name: 'list_income', summary: 'Lists income entries newest first, with optional date range, search and sorting. Also returns the total, average and count across every matching entry.', required: [], optional: ['startDate', 'endDate', 'search', 'sort', 'order', 'limit', 'offset'], example: 'Show income from last month.' },
      { name: 'list_expenses', summary: 'Lists expense entries newest first, with optional date range, search and sorting. Also returns the total, average and count across every matching entry.', required: [], optional: ['startDate', 'endDate', 'search', 'sort', 'order', 'limit', 'offset'], example: 'How much did we spend on feed this quarter?' },
      { name: 'get_summary', summary: 'Total income, total expense, net balance and the top 5 categories each way for a date range, in one call.', required: [], optional: ['startDate', 'endDate'], example: 'How did we do last month?' },
      { name: 'list_reports', summary: 'Lists the workspace’s reports with their widget counts.', required: [], optional: [], example: 'What reports do we have?' },
      { name: 'get_report', summary: 'Gets one report with all of its widgets and their settings.', required: ['reportId'], optional: [], example: 'What does the Vegetable prices report show?' },
      { name: 'get_widget_data', summary: 'Computes a widget’s numbers for a date range: values per day/week/month, totals, and the KPI change vs the previous period.', required: ['reportId', 'widgetId'], optional: ['startDate', 'endDate'], example: 'How did drumstick prices move this month?' },
    ],
  },
  {
    id: 'write',
    title: 'Ledger tools',
    description: 'Add, change, or remove entries and categories. Needs owner, admin or manager in that workspace.',
    icon: PencilLine,
    tone: 'bg-warning/10 text-warning',
    badge: { variant: 'warning', label: 'Changes data' },
    tools: [
      { name: 'create_category', summary: 'Creates a new income or expense category, with optional custom fields.', required: ['name', 'type'], optional: ['customFields'], example: 'Create an expense category called Feed with a NUMBER field kg.' },
      { name: 'create_category_bulk', summary: 'Creates up to 20 categories in one call. All are saved, or none if any is invalid.', required: ['categories'], optional: [], example: 'Set up categories for seeds, fertiliser, labour and diesel.' },
      { name: 'delete_category', summary: 'Deletes a category. Refused if any entries use it.', required: ['categoryId'], optional: [], example: 'Delete the Test category I made by mistake.', destructive: true },
      { name: 'create_income', summary: 'Records a new income entry in a category.', required: ['date', 'categoryId', 'amount'], optional: ['description', 'customFieldValues'], example: 'Add ₹15,000 income under Milk sales for today.' },
      { name: 'create_income_bulk', summary: 'Records up to 20 income entries in one call. All are saved, or none if any is invalid.', required: ['entries'], optional: [], example: 'Add this week’s daily milk sales.' },
      { name: 'update_income', summary: 'Edits an existing income entry. Only the fields you pass are changed.', required: ['id'], optional: ['date', 'categoryId', 'amount', 'description', 'customFieldValues'], example: 'Change yesterday’s milk income to ₹18,000.' },
      { name: 'delete_income', summary: 'Permanently deletes an income entry.', required: ['id'], optional: [], example: 'Delete the duplicate income entry from Monday.', destructive: true },
      { name: 'create_expense', summary: 'Records a new expense entry in a category.', required: ['date', 'categoryId', 'amount'], optional: ['description', 'customFieldValues'], example: 'Log ₹2,400 for diesel under Fuel.' },
      { name: 'create_expense_bulk', summary: 'Records up to 20 expense entries in one call. All are saved, or none if any is invalid.', required: ['entries'], optional: [], example: 'Log all the receipts from today’s market trip.' },
      { name: 'update_expense', summary: 'Edits an existing expense entry. Only the fields you pass are changed.', required: ['id'], optional: ['date', 'categoryId', 'amount', 'description', 'customFieldValues'], example: 'Move the ₹900 expense to the Transport category.' },
      { name: 'delete_expense', summary: 'Permanently deletes an expense entry.', required: ['id'], optional: [], example: 'Remove the test expense I added this morning.', destructive: true },
    ],
  },
  {
    id: 'reports',
    title: 'Report tools',
    description: 'Build dashboards for the workspace. Needs owner, admin or manager in that workspace.',
    icon: ChartNoAxesCombined,
    tone: 'bg-warning/10 text-warning',
    badge: { variant: 'warning', label: 'Changes reports' },
    tools: [
      { name: 'create_report', summary: 'Creates an empty report (dashboard) to add widgets to.', required: ['name'], optional: ['description'], example: 'Make a report to track vegetable prices.' },
      { name: 'update_report', summary: 'Renames a report or changes its description.', required: ['reportId'], optional: ['name', 'description'], example: 'Rename the report to Weekly vegetable prices.' },
      { name: 'create_widget', summary: 'Adds a line, area, bar, pie, donut or KPI widget charting category amounts or custom fields, by day, week or month.', required: ['reportId', 'title', 'chartType', 'config'], optional: [], example: 'Add a weekly line chart of the average drumstick price per kg.' },
      { name: 'update_widget', summary: 'Changes a widget in place (title, chart type or settings), keeping its position and size.', required: ['reportId', 'widgetId'], optional: ['title', 'chartType', 'config'], example: 'Make the drumstick price chart monthly instead of weekly.' },
      { name: 'delete_widget', summary: 'Removes one widget from a report.', required: ['reportId', 'widgetId'], optional: [], example: 'Remove the pie chart from the expenses report.', destructive: true },
      { name: 'delete_report', summary: 'Deletes a report and its widgets. Entries and categories are not affected.', required: ['reportId'], optional: [], example: 'Delete the old test report.', destructive: true },
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

function ToolCard({ tool, badge, needsWorkspace }) {
  const required = needsWorkspace ? ['workspaceId', ...tool.required] : tool.required;
  return (
    <div className="flex flex-col gap-2.5 rounded-lg border bg-background p-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <code className="font-mono text-[13px] font-semibold text-foreground">{tool.name}</code>
        {tool.destructive ? <Badge variant="expense">Permanent</Badge> : <Badge variant={badge.variant}>{badge.label}</Badge>}
      </div>
      <p className="text-xs leading-5 text-muted-foreground">{tool.summary}</p>
      <div className="grid gap-1.5">
        <ParamList label="Requires" params={required} required />
        <ParamList label="Optional" params={tool.optional} />
        {!required.length && !tool.optional.length && <span className="text-[11px] text-muted-foreground">No inputs</span>}
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
        <span>Connected AI clients call these tools on your behalf, as you. A key works in every workspace you belong to, with your role there, so viewers can only use read tools. Every tool except the workspace tools also needs a <code className="font-mono text-foreground">workspaceId</code>, which the client gets from <code className="font-mono text-foreground">list_workspaces</code>. List tools return results in pages of up to 50 (max 200); the client asks for the next page with <code className="font-mono text-foreground">offset</code>.</span>
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
            {tools.map((tool) => <ToolCard key={tool.name} tool={tool} badge={badge} needsWorkspace={id !== 'account'} />)}
          </div>
        </section>
      ))}
    </div>
  );
}
