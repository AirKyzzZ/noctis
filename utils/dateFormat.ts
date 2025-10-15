/**
 * Simple date formatting utility
 * Format tokens:
 * - yyyy: 4-digit year
 * - MMM: Short month name
 * - MM: 2-digit month
 * - dd: 2-digit day
 * - hh: 2-digit hours (12-hour)
 * - mm: 2-digit minutes
 * - a: AM/PM
 */
export function format(date: Date, formatStr: string): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  
  const hours12 = hours % 12 || 12;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  const pad = (num: number) => String(num).padStart(2, '0');
  
  return formatStr
    .replace('yyyy', String(year))
    .replace('MMM', months[month])
    .replace('MM', pad(month + 1))
    .replace('dd', pad(day))
    .replace('hh', pad(hours12))
    .replace('mm', pad(minutes))
    .replace('a', ampm);
}

/**
 * Format date with predefined format types
 */
export function formatDate(date: Date, type: 'full' | 'short' | 'date' | 'time'): string {
  switch (type) {
    case 'full':
      return format(date, 'MMM dd, yyyy hh:mm a');
    case 'short':
      return format(date, 'MMM dd, yyyy');
    case 'date':
      return format(date, 'yyyy-MM-dd');
    case 'time':
      return format(date, 'hh:mm a');
    default:
      return format(date, 'MMM dd, yyyy hh:mm a');
  }
}

