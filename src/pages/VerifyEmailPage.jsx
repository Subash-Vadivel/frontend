import { CheckCircle2, XCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { verifyEmail } from '../api/authApi';
import ThemeToggle from '../components/theme/ThemeToggle.jsx';
import { Button } from '../components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Loader } from '../components/ui/loader.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getErrorMessage } from '../lib/utils.js';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();
  const [state, setState] = useState(token ? 'verifying' : 'error');
  const [error, setError] = useState(token ? '' : 'This verification link is missing its token.');
  // Tokens are single-use; StrictMode would otherwise submit twice in dev.
  const submitted = useRef(false);

  useEffect(() => {
    if (!token || submitted.current) return;
    submitted.current = true;
    verifyEmail(token)
      .then((response) => {
        loginWithToken(response.access_token);
        setState('done');
        setTimeout(() => navigate('/dashboard', { replace: true }), 1200);
      })
      .catch((err) => { setError(getErrorMessage(err, 'Unable to verify email')); setState('error'); });
  }, [token, loginWithToken, navigate]);

  return <main className="grid min-h-screen place-items-center bg-muted/20 px-4 py-6 text-foreground"><div className="absolute right-4 top-4"><ThemeToggle compact /></div><Card className="w-full max-w-md rounded-lg">{state === 'verifying' ? <CardContent className="p-6"><Loader className="min-h-44" /></CardContent> : state === 'done' ? <CardHeader><div className="mb-2 flex h-9 w-9 items-center justify-center rounded-md border"><CheckCircle2 className="h-4 w-4 text-primary" /></div><CardTitle>Email verified</CardTitle><CardDescription>Your account is active. Taking you to your workspace...</CardDescription></CardHeader> : <><CardHeader><div className="mb-2 flex h-9 w-9 items-center justify-center rounded-md border"><XCircle className="h-4 w-4 text-destructive" /></div><CardTitle>Verification failed</CardTitle><CardDescription>{error} Log in to request a new verification email.</CardDescription></CardHeader><CardContent><Button type="button" onClick={() => navigate('/login', { replace: true })}>Go to login</Button></CardContent></>}</Card></main>;
}
