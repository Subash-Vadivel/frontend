import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// FastAPI errors arrive as a string, a {code, message} object, or a 422 validation list.
export function getErrorMessage(err, fallback) {
  const detail = err?.response?.data?.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) return detail[0]?.msg || fallback;
  if (detail?.message) {
    if (detail.code === 'rate_limited' && detail.retryAfterSeconds) {
      return `${detail.message} Try again in ${formatDuration(detail.retryAfterSeconds)}.`;
    }
    return detail.message;
  }
  return fallback;
}

export function formatDuration(seconds) {
  if (seconds >= 3600) return `${Math.ceil(seconds / 3600)} hour(s)`;
  if (seconds >= 60) return `${Math.ceil(seconds / 60)} minute(s)`;
  return `${seconds} second(s)`;
}
