import { Lock, Mail, ShieldCheck, Sprout, User } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../api/authApi';
import ThemeToggle from '../components/theme/ThemeToggle.jsx';

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signup(form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to create account');
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
            <p className="eyebrow">Start organized</p>
            <h1>Build a focused finance workspace for every rupee moving through the farm.</h1>
          </div>
          <div className="auth-proof">
            <ShieldCheck size={18} />
            <span>Track entries, categories, custom fields, and integrations from day one.</span>
          </div>
        </section>
        <form className="auth-card" onSubmit={submit}>
          <div className="auth-card-top">
            <div>
              <p className="eyebrow">Create workspace</p>
              <h2>Sign up</h2>
            </div>
            <ThemeToggle className="compact-toggle" />
          </div>
          <label>
            Name
            <span className="input-shell">
              <User size={17} />
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </span>
          </label>
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
              <input type="password" minLength="8" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </span>
          </label>
          {error && <p className="error-message">{error}</p>}
          <button className="primary-button" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
          <p className="auth-switch">Already registered? <Link to="/login">Login</Link></p>
        </form>
      </div>
    </main>
  );
}
