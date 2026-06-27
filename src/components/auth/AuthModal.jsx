import { Lock, Mail, Sprout, User, X } from 'lucide-react';
import { useState } from 'react';
import { signup } from '../../api/authApi.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AuthModal({ mode, onClose, onModeChange, onSuccess }) {
  const { login } = useAuth();
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const isSignup = mode === 'signup';

  const switchMode = (nextMode) => {
    setError('');
    setNotice('');
    onModeChange(nextMode);
  };

  const submitLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(loginForm);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to login');
    } finally {
      setLoading(false);
    }
  };

  const submitSignup = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signup(signupForm);
      setLoginForm({ email: signupForm.email, password: '' });
      setSignupForm({ name: '', email: '', password: '' });
      setNotice('Account created. You can log in now.');
      onModeChange('login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop auth-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        aria-label={isSignup ? 'Sign up' : 'Login'}
        aria-modal="true"
        className="modal-panel compact-modal auth-modal"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="auth-card-top">
          <div>
            <div className="auth-brand modal-brand"><span className="brand-mark"><Sprout size={20} /></span> Farm Accounts</div>
            <p className="eyebrow">{isSignup ? 'Create workspace' : 'Welcome back'}</p>
            <h2>{isSignup ? 'Sign up' : 'Login'}</h2>
          </div>
          <div className="auth-modal-actions">
            <button className="icon-button" onClick={onClose} title="Close" type="button">
              <X size={18} />
            </button>
          </div>
        </div>

        {notice && <p className="success-message">{notice}</p>}

        {isSignup ? (
          <form className="auth-modal-form" onSubmit={submitSignup}>
            <label>
              Name
              <span className="input-shell">
                <User size={17} />
                <input value={signupForm.name} onChange={(event) => setSignupForm({ ...signupForm, name: event.target.value })} placeholder="Your name" required />
              </span>
            </label>
            <label>
              Email
              <span className="input-shell">
                <Mail size={17} />
                <input type="email" value={signupForm.email} onChange={(event) => setSignupForm({ ...signupForm, email: event.target.value })} placeholder="you@farm.com" required />
              </span>
            </label>
            <label>
              Password
              <span className="input-shell">
                <Lock size={17} />
                <input type="password" minLength="8" value={signupForm.password} onChange={(event) => setSignupForm({ ...signupForm, password: event.target.value })} placeholder="Create an 8+ character password" required />
              </span>
            </label>
            {error && <p className="error-message">{error}</p>}
            <button className="primary-button" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
            <p className="auth-switch">Already registered? <button type="button" onClick={() => switchMode('login')}>Login</button></p>
          </form>
        ) : (
          <form className="auth-modal-form" onSubmit={submitLogin}>
            <label>
              Email
              <span className="input-shell">
                <Mail size={17} />
                <input type="email" value={loginForm.email} onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })} placeholder="you@farm.com" required />
              </span>
            </label>
            <label>
              Password
              <span className="input-shell">
                <Lock size={17} />
                <input type="password" value={loginForm.password} onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })} placeholder="Enter your password" required />
              </span>
            </label>
            {error && <p className="error-message">{error}</p>}
            <button className="primary-button" type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
            <p className="auth-switch">Need an account? <button type="button" onClick={() => switchMode('signup')}>Sign up</button></p>
          </form>
        )}
      </section>
    </div>
  );
}
