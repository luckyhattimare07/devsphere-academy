import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function formatDate(d: string | Date): string {
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(d));
}

export function diffColor(diff: string) {
  if (diff === 'Easy')   return 'text-ds-green';
  if (diff === 'Medium') return 'text-ds-amber';
  return 'text-red-400';
}

export function statusColor(status: string) {
  if (status === 'Accepted') return 'text-green-400';
  if (status === 'Wrong Answer') return 'text-red-400';
  return 'text-amber-400';
}
