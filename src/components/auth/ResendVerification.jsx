import { MailCheck, RotateCw } from 'lucide-react';
import { useState } from 'react';
import { resendVerification } from '../../api/authApi.js';
import { getErrorMessage } from '../../lib/utils.js';
import { Button } from '../ui/button.jsx';

const MAX_RESENDS = 3;

export default function ResendVerification({ email, initialRemaining = MAX_RESENDS }) {
  const [remaining, setRemaining] = useState(initialRemaining ?? MAX_RESENDS);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const resend = async () => {
    setSending(true); setNotice(''); setError('');
    try {
      const response = await resendVerification(email);
      setRemaining(response.remainingAttempts ?? Math.max(0, remaining - 1));
      setNotice(`A new verification link was sent to ${email}.`);
    } catch (err) {
      if (err.response?.status === 429) setRemaining(0);
      setError(getErrorMessage(err, 'Unable to resend verification email'));
    } finally { setSending(false); }
  };

  return (
    <div className="grid gap-3">
      <div className="flex items-start gap-3 rounded-lg border bg-muted/20 p-3">
        <MailCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p className="text-sm text-muted-foreground">We sent a verification link to <span className="font-medium text-foreground break-all">{email}</span>. Click the link in that email to activate your account.</p>
      </div>
      {notice && <p className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-300">{notice}</p>}
      {error && <p className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
      <Button type="button" variant="outline" onClick={resend} disabled={sending || remaining <= 0}><RotateCw /> {sending ? 'Sending...' : 'Resend verification email'}</Button>
      <p className="text-center text-xs text-muted-foreground">{remaining > 0 ? `${remaining} of ${MAX_RESENDS} resends left in the next 24 hours` : 'Resend limit reached. Please try again in 24 hours.'}</p>
    </div>
  );
}
