import { BarChart3, Bot, Command, DatabaseZap, FolderTree, KeyRound, ReceiptText, ShieldCheck, TrendingUp, WalletCards } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthModal from '../components/auth/AuthModal.jsx';
import ThemeToggle from '../components/theme/ThemeToggle.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Button } from '../components/ui/button.jsx';
import { Card, CardContent } from '../components/ui/card.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { APP_NAME, APP_TAGLINE, BrandIcon } from '../lib/brand.js';
const features=[['Command search',Command,'Find any entry, category, or page instantly with ⌘K.'],['Dashboard',BarChart3,'See income, spending, and net balance by category and month at a glance.'],['Custom taxonomy',FolderTree,'Shape income and expense categories, plus custom fields, around how your business works.'],['Integrations',KeyRound,'Connect AI assistants and tools securely through MCP API keys you control.']];
export default function LandingPage({ initialAuthMode = null }) {
  const { isAuthenticated } = useAuth(); const navigate = useNavigate(); const location = useLocation(); const [authMode,setAuthMode]=useState(initialAuthMode); useEffect(()=>setAuthMode(initialAuthMode),[initialAuthMode]); const destination=useMemo(()=>location.state?.from?.pathname||'/dashboard',[location.state]); const openAuth=(mode)=>{setAuthMode(mode);navigate(`/${mode}`,{replace:false,state:location.state});}; const closeAuth=()=>{setAuthMode(null);navigate('/',{replace:true});}; const openDashboard=()=>navigate('/dashboard');
  return <main className="min-h-screen bg-background text-foreground"><nav className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur"><div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"><button className="flex items-center gap-2 text-[13px] font-semibold" type="button" onClick={()=>navigate('/')}><span className="flex h-8 w-8 items-center justify-center rounded-md border"><BrandIcon className="h-4 w-4 text-primary" /></span>{APP_NAME}</button><div className="flex items-center gap-2"><ThemeToggle compact />{isAuthenticated?<Button type="button" onClick={openDashboard}>Open dashboard</Button>:<><Button variant="ghost" type="button" onClick={()=>openAuth('login')}>Login</Button><Button type="button" onClick={()=>openAuth('signup')}>Sign up</Button></>}</div></div></nav>
    <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_560px] lg:px-8 lg:py-20"><div className="flex flex-col justify-center"><Badge variant="outline" className="mb-5 w-fit">Income &amp; expense tracking</Badge><h1 className="max-w-3xl text-4xl font-semibold tracking-[-.02em] sm:text-5xl">Know exactly where your money comes from and where it goes.</h1><p className="mt-5 max-w-2xl text-[15px] leading-7 text-muted-foreground">Track income and expenses for your business, shop, side project, or household in one shared workspace, with categories, reports, and team access built in.</p><div className="mt-7 flex flex-wrap gap-2">{isAuthenticated?<Button size="lg" type="button" onClick={openDashboard}>Open dashboard</Button>:<><Button size="lg" type="button" onClick={()=>openAuth('signup')}>Get started free</Button><Button size="lg" variant="outline" type="button" onClick={()=>openAuth('login')}>Login</Button></>}</div><div className="mt-8 grid max-w-lg grid-cols-3 gap-3 text-xs"><div><strong className="block text-foreground">Multi-business</strong><span className="text-muted-foreground">Separate workspaces</span></div><div><strong className="block text-foreground">Team</strong><span className="text-muted-foreground">Role-based access</span></div><div><strong className="block text-foreground">Reports</strong><span className="text-muted-foreground">Monthly &amp; by category</span></div></div></div>
      <Card className="overflow-hidden bg-muted/10 shadow-2xl shadow-black/5"><div className="flex h-10 items-center gap-2 border-b px-3"><span className="h-2.5 w-2.5 rounded-full bg-red-500"/><span className="h-2.5 w-2.5 rounded-full bg-yellow-500"/><span className="h-2.5 w-2.5 rounded-full bg-green-500"/><div className="ml-auto rounded-md border px-2 py-1 font-mono text-[10px] text-muted-foreground">⌘K</div></div><CardContent className="grid gap-3 p-4"><div className="grid gap-3 sm:grid-cols-3"><PreviewMetric icon={WalletCards} label="Income" value="₹8.42L" tone="text-income"/><PreviewMetric icon={ReceiptText} label="Expense" value="₹3.18L" tone="text-expense"/><PreviewMetric icon={TrendingUp} label="Net" value="₹5.24L" tone="text-balance"/></div><div className="grid gap-3 lg:grid-cols-[1fr_190px]"><div className="flex h-56 items-end gap-2 rounded-lg border bg-background p-4">{[42,68,54,82,64,72,88,61].map((h,i)=><span className="flex-1 rounded-t-sm bg-foreground" style={{height:`${h}%`,opacity:.12+i*.06}} key={`${h}-${i}`}/>)}</div><div className="grid gap-2">{['Client payment','Office rent','Product sales','Utilities'].map((item,i)=><div className="rounded-md border bg-background p-2" key={item}><div className="text-xs font-medium">{item}</div><div className="text-[11px] text-muted-foreground">{i%2?'Expense':'Income'}</div></div>)}</div></div></CardContent></Card>
    </section><section className="border-y bg-muted/15"><div className="mx-auto grid max-w-7xl gap-3 px-4 py-10 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">{features.map(([title,Icon,copy])=><div className="rounded-lg border bg-background p-4" key={title}><Icon className="mb-3 h-4 w-4 text-primary"/><h2 className="text-[13px] font-semibold">{title}</h2><p className="mt-2 text-xs leading-5 text-muted-foreground">{copy}</p></div>)}</div></section><McpSection /><section className="mx-auto grid max-w-7xl gap-4 px-4 py-14 sm:px-6 lg:grid-cols-3 lg:px-8"><div className="lg:col-span-2"><h2 className="text-2xl font-semibold">Built for everyday bookkeeping.</h2><p className="mt-3 text-sm text-muted-foreground">Add entries in seconds, keep every record searchable, and invite your accountant or team with the right level of access. Whatever you run, the numbers stay organized.</p></div><Card><CardContent className="p-4"><ShieldCheck className="mb-3 h-4 w-4 text-primary"/><h3 className="text-[13px] font-semibold">Controlled access</h3><p className="mt-2 text-xs text-muted-foreground">Owner, editor, and viewer roles keep each person to what they need. Integration keys can be turned off at any time.</p></CardContent></Card></section><footer className="border-t"><div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 text-xs text-muted-foreground sm:px-6 lg:px-8"><span>{APP_NAME}</span><span>{APP_TAGLINE}</span></div></footer>{authMode&&<AuthModal mode={authMode} onClose={closeAuth} onModeChange={(nextMode)=>{setAuthMode(nextMode);navigate(`/${nextMode}`,{replace:true,state:location.state});}} onSuccess={()=>navigate(destination,{replace:true})}/>}</main>;
}
function PreviewMetric({ icon: Icon, label, value, tone }) { return <div className="rounded-lg border bg-background p-3"><Icon className={`mb-3 h-4 w-4 ${tone}`} /><p className="text-[11px] text-muted-foreground">{label}</p><strong className="text-lg font-semibold">{value}</strong></div>; }

const mcpTools = ['list_income', 'create_income', 'update_income', 'delete_income', 'list_expenses', 'create_expense', 'update_expense', 'delete_expense', 'list_categories', 'create_category'];
const mcpSteps = [['Create a key', 'Generate a named API key from the MCP page. Only owners and admins can.'], ['Connect your client', 'Add the streamable HTTP endpoint and key to Claude or any MCP-compatible client.'], ['Just ask', 'Record, look up, and correct entries in plain language.']];

function McpSection() {
  return (
    <section className="border-b">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_520px] lg:px-8">
        <div className="flex flex-col justify-center">
          <Badge variant="outline" className="mb-4 w-fit"><Bot className="h-3 w-3" /> MCP support</Badge>
          <h2 className="text-2xl font-semibold sm:text-3xl">Manage your books from your AI assistant.</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">{APP_NAME} includes a built-in Model Context Protocol (MCP) server. Connect Claude or another MCP client and it can add, find, and fix income and expense entries in your workspace for you, so you don't have to open the app.</p>
          <ol className="mt-6 grid gap-3">
            {mcpSteps.map(([title, copy], index) => (
              <li className="flex gap-3" key={title}>
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border font-mono text-[11px]">{index + 1}</span>
                <div><p className="text-[13px] font-semibold">{title}</p><p className="text-xs text-muted-foreground">{copy}</p></div>
              </li>
            ))}
          </ol>
        </div>
        <Card className="overflow-hidden bg-muted/10">
          <div className="flex h-10 items-center gap-2 border-b px-3 text-xs text-muted-foreground"><Bot className="h-4 w-4 text-primary" /> AI assistant · connected to {APP_NAME}</div>
          <CardContent className="grid gap-3 p-4 text-xs">
            <div className="ml-auto max-w-[85%] rounded-lg bg-primary px-3 py-2 text-primary-foreground">Add ₹2,400 for the office internet bill under Utilities, paid today.</div>
            <div className="w-fit rounded-md border bg-background px-2 py-1 font-mono text-[11px] text-muted-foreground">→ create_expense</div>
            <div className="max-w-[85%] rounded-lg border bg-background px-3 py-2">Done. I recorded a ₹2,400 expense under Utilities with today's date.</div>
            <div className="mt-2 border-t pt-3">
              <p className="mb-2 text-[11px] text-muted-foreground">Available tools</p>
              <div className="flex flex-wrap gap-1.5">{mcpTools.map((tool) => <code className="rounded border bg-background px-1.5 py-0.5 font-mono text-[10px]" key={tool}>{tool}</code>)}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
