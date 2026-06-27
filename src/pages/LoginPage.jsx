import { Lock, Mail, ShieldCheck, Sprout } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/theme/ThemeToggle.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form);
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <section className="auth-hero" aria-label="Farm Accounts overview">
          <div className="auth-brand"><span className="brand-mark"><Sprout /></span> Farm Accounts</div>
          <div>
            <p className="eyebrow">Farm finance dashboard</p>
            <h1>Command income, expenses, categories, and access keys in one calm workspace.</h1>
          </div>
          <div className="auth-proof">
            <ShieldCheck size={18} />
            <span>Secure access with clean records and fast reporting.</span>
          </div>
        </section>
        <form className="auth-card" onSubmit={submit}>
          <div className="auth-card-top">
            <div>
              <p className="eyebrow">Welcome back</p>
              <h2>Login</h2>
            </div>
            <ThemeToggle className="compact-toggle" />
          </div>
          <label>
            Email
            <span className="input-shell">
              <Mail size={17} />
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </span>
          </label>
          <label>
            Password
            <span className="input-shell">
              <Lock size={17} />
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </span>
          </label>
          {error && <p className="error-message">{error}</p>}
          <button className="primary-button" type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
          <p className="auth-switch">Need an account? <Link to="/signup">Sign up</Link></p>
        </form>
      </div>
    </main>
  );
}
