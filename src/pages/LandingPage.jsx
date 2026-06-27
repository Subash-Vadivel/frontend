import { BarChart3, CalendarDays, DatabaseZap, FolderTree, KeyRound, Layers3, ReceiptText, ShieldCheck, Sprout, TrendingUp, WalletCards } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthModal from '../components/auth/AuthModal.jsx';
import ThemeToggle from '../components/theme/ThemeToggle.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const features = [
  { icon: BarChart3, title: 'Finance overview', copy: 'Track income, expenses, net balance, and category movement from one executive dashboard.' },
  { icon: ReceiptText, title: 'Transaction control', copy: 'Filter ledgers, inspect entries, and keep farm records clean across every reporting period.' },
  { icon: FolderTree, title: 'Custom categories', copy: 'Model crop sales, labor, supplies, and custom field details around the way the farm works.' },
  { icon: KeyRound, title: 'MCP access', copy: 'Manage endpoint access and API keys for trusted connected clients.' },
];

const trustMetrics = [
  { value: 'All-time', label: 'default reporting view' },
  { value: 'Custom', label: 'category field capture' },
  { value: 'Secure', label: 'MCP key management' },
  { value: 'Live', label: 'income and expense clarity' },
];

const workflow = [
  { icon: ReceiptText, title: 'Capture', copy: 'Record income and expenses with the right date, category, amount, notes, and custom fields.' },
  { icon: FolderTree, title: 'Categorize', copy: 'Keep a farm-specific taxonomy for revenue streams, operating costs, labor, inputs, and assets.' },
  { icon: BarChart3, title: 'Analyze', copy: 'Review monthly movement, net balance, and category contribution without rebuilding spreadsheets.' },
  { icon: DatabaseZap, title: 'Connect', copy: 'Use MCP access and API keys to bring farm finance data into trusted connected tools.' },
];

const surfaces = [
  { title: 'Dashboard', copy: 'Executive summary cards, monthly comparison, and category charts in one calm view.' },
  { title: 'Ledger', copy: 'Income and expense tables designed for repeated review, filtering, and inspection.' },
  { title: 'Categories', copy: 'Configurable category directory with custom field counts and operational structure.' },
  { title: 'MCP', copy: 'Endpoint visibility and key controls for secure client access.' },
];

const useCases = [
  { icon: WalletCards, title: 'Income tracking', copy: 'Follow crop sales, service income, grants, and other farm revenue with consistent records.' },
  { icon: ReceiptText, title: 'Expense control', copy: 'Understand supplies, labor, maintenance, transport, and operating costs by period.' },
  { icon: Layers3, title: 'Custom field detail', copy: 'Add the extra context that generic finance tools miss, from crop type to field-level notes.' },
  { icon: ShieldCheck, title: 'Access governance', copy: 'Create and disable MCP keys so connected workflows stay controlled.' },
];

export default function LandingPage({ initialAuthMode = null }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [authMode, setAuthMode] = useState(initialAuthMode);

  useEffect(() => {
    setAuthMode(initialAuthMode);
  }, [initialAuthMode]);

  const destination = useMemo(
    () => location.state?.from?.pathname || '/dashboard',
    [location.state],
  );

  const openAuth = (mode) => {
    setAuthMode(mode);
    navigate(`/${mode}`, { replace: false, state: location.state });
  };

  const closeAuth = () => {
    setAuthMode(null);
    navigate('/', { replace: true });
  };

  const openDashboard = () => navigate('/dashboard');

  return (
    <main className="landing-page">
      <nav className="landing-nav" aria-label="Public navigation">
        <button className="landing-brand" type="button" onClick={() => navigate('/')}>
          <span className="brand-mark"><Sprout size={22} /></span>
          <span>Farm Accounts</span>
        </button>
        <div className="landing-nav-actions">
          <ThemeToggle className="compact-toggle" />
          {isAuthenticated ? (
            <button className="primary-button" type="button" onClick={openDashboard}>Open dashboard</button>
          ) : (
            <>
              <button className="ghost-button" type="button" onClick={() => openAuth('login')}>Login</button>
              <button className="primary-button" type="button" onClick={() => openAuth('signup')}>Sign up</button>
            </>
          )}
        </div>
      </nav>

      <section className="landing-hero">
        <div className="landing-hero-copy">
          <p className="eyebrow">Enterprise farm finance</p>
          <h1>Run farm accounts with the clarity of a modern SaaS workspace.</h1>
          <p>
            A polished command center for income, expenses, categories, reporting,
            and secure MCP access. Built for operators who need clean records
            without spreadsheet sprawl.
          </p>
          <div className="landing-actions">
            {isAuthenticated ? (
              <button className="primary-button" type="button" onClick={openDashboard}>Open dashboard</button>
            ) : (
              <>
                <button className="primary-button" type="button" onClick={() => openAuth('signup')}>Start free</button>
                <button className="ghost-button" type="button" onClick={() => openAuth('login')}>Login</button>
              </>
            )}
          </div>
        </div>

        <div className="landing-product" aria-label="Farm Accounts product preview">
          <div className="preview-window">
            <div className="preview-topbar">
              <span />
              <span />
              <span />
            </div>
            <div className="preview-content">
              <div className="preview-metric income">
                <WalletCards size={18} />
                <span>Total income</span>
                <strong>₹8.42L</strong>
              </div>
              <div className="preview-metric expense">
                <ReceiptText size={18} />
                <span>Total expense</span>
                <strong>₹3.18L</strong>
              </div>
              <div className="preview-chart">
                <span style={{ height: '42%' }} />
                <span style={{ height: '68%' }} />
                <span style={{ height: '54%' }} />
                <span style={{ height: '82%' }} />
                <span style={{ height: '64%' }} />
              </div>
              <div className="preview-row"><TrendingUp size={16} /> Net balance improved across selected period</div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-feature-grid" aria-label="Product capabilities">
        {features.map(({ icon: Icon, title, copy }) => (
          <article className="landing-feature" key={title}>
            <span><Icon size={19} /></span>
            <h2>{title}</h2>
            <p>{copy}</p>
          </article>
        ))}
      </section>

      <section className="landing-trust-strip" aria-label="Platform highlights">
        {trustMetrics.map((metric) => (
          <div key={metric.label}>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </div>
        ))}
      </section>

      <section className="landing-section">
        <div className="landing-section-heading">
          <p className="eyebrow">Operating workflow</p>
          <h2>From entry capture to connected reporting.</h2>
          <p>Farm Accounts is structured around the daily rhythm of finance work: enter clean records, classify them correctly, analyze the picture, and connect trusted tools.</p>
        </div>
        <div className="landing-workflow-grid">
          {workflow.map(({ icon: Icon, title, copy }) => (
            <article className="workflow-card" key={title}>
              <span><Icon size={18} /></span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-product-section">
        <div className="landing-section-heading">
          <p className="eyebrow">Product surfaces</p>
          <h2>Every module has a job, and every view is built for repeat use.</h2>
        </div>
        <div className="surface-grid">
          {surfaces.map((surface) => (
            <article className="surface-card" key={surface.title}>
              <h3>{surface.title}</h3>
              <p>{surface.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-section-heading">
          <p className="eyebrow">Built for farm operators</p>
          <h2>Less admin drag, more confidence in the numbers.</h2>
        </div>
        <div className="use-case-grid">
          {useCases.map(({ icon: Icon, title, copy }) => (
            <article className="use-case-card" key={title}>
              <Icon size={20} />
              <div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-cta">
        <div>
          <p className="eyebrow">Ready when your records are</p>
          <h2>Bring farm finance into one professional workspace.</h2>
          <p>Start with clean categories, all-time visibility, and an app that feels steady enough for daily use.</p>
        </div>
        <div className="landing-actions">
          {isAuthenticated ? (
            <button className="primary-button" type="button" onClick={openDashboard}>Open dashboard</button>
          ) : (
            <>
              <button className="primary-button" type="button" onClick={() => openAuth('signup')}>Sign up</button>
              <button className="ghost-button" type="button" onClick={() => openAuth('login')}>Login</button>
            </>
          )}
        </div>
      </section>

      <footer className="landing-footer">
        <div>
          <button className="landing-brand" type="button" onClick={() => navigate('/')}>
            <span className="brand-mark"><Sprout size={20} /></span>
            <span>Farm Accounts</span>
          </button>
          <p>Premium finance control for farm operations.</p>
        </div>
        <div>
          <h3>Product</h3>
          <button type="button" onClick={() => navigate('/')}>Overview</button>
          <button type="button" onClick={isAuthenticated ? openDashboard : () => openAuth('signup')}>Dashboard</button>
          <button type="button" onClick={isAuthenticated ? () => navigate('/mcp') : () => openAuth('signup')}>MCP access</button>
        </div>
        <div>
          <h3>Account</h3>
          {isAuthenticated ? (
            <button type="button" onClick={openDashboard}>Open dashboard</button>
          ) : (
            <>
              <button type="button" onClick={() => openAuth('login')}>Login</button>
              <button type="button" onClick={() => openAuth('signup')}>Sign up</button>
            </>
          )}
        </div>
        <p className="footer-copy">© 2026 Farm Accounts. Built for clear farm records.</p>
      </footer>

      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={closeAuth}
          onModeChange={(nextMode) => {
            setAuthMode(nextMode);
            navigate(`/${nextMode}`, { replace: true, state: location.state });
          }}
          onSuccess={() => navigate(destination, { replace: true })}
        />
      )}
    </main>
  );
}
