import { formatDistanceToNow, format } from 'date-fns';

/**
 * Formats a date string into a relative time format (e.g., "5 minutes ago", "3 days ago")
 * Uses date-fns for accurate, locale-aware relative time formatting
 *
 * @param dateString - ISO date string to format
 * @returns Formatted relative time string
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * Formats a date string into a readable absolute format (e.g., "15 Jan 2025, 14:30")
 *
 * @param dateString - ISO date string to format
 * @returns Formatted absolute date string
 */
export function formatAbsoluteDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, 'd MMM yyyy, HH:mm');
}

/**
 * Formats a date string into a long absolute format (e.g., "15 January 2025, 14:30")
 *
 * @param dateString - ISO date string to format
 * @returns Formatted long date string
 */
export function formatLongDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, 'd MMMM yyyy, HH:mm');
}

/**
 * Formats a date string for join dates (e.g., "15 January 2025")
 *
 * @param dateString - ISO date string to format
 * @returns Formatted join date string
 */
export function formatJoinDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, 'd MMMM yyyy');
}
