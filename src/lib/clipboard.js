import { toast } from 'sonner';
import { getErrorMessage } from './utils.js';

// Accepts a string or a promise of one. With a promise, ClipboardItem keeps the click's user
// activation alive while the value loads (Safari rejects writeText after an await).
export async function copyToClipboard(value, successMessage = 'Copied to clipboard') {
  try {
    if (typeof value !== 'string' && typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
      const blob = Promise.resolve(value).then((text) => new Blob([text], { type: 'text/plain' }));
      await navigator.clipboard.write([new ClipboardItem({ 'text/plain': blob })]);
    } else {
      await navigator.clipboard.writeText(await value);
    }
    toast.success(successMessage);
    return true;
  } catch (err) {
    toast.error(getErrorMessage(err, 'Could not copy to clipboard'));
    return false;
  }
}
