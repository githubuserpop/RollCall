import { formatDistance, format, isToday, isYesterday } from 'date-fns';

export function formatPollDeadline(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  
  return formatDistance(date, now, { addSuffix: true });
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  
  if (isToday(date)) {
    return format(date, "'Today at' h:mm a");
  }
  
  if (isYesterday(date)) {
    return format(date, "'Yesterday at' h:mm a");
  }
  
  return format(date, 'MMM d, yyyy');
}

export function formatMessageTime(dateString: string): string {
  const date = new Date(dateString);
  
  if (isToday(date)) {
    return format(date, 'h:mm a');
  }
  
  if (isYesterday(date)) {
    return 'Yesterday';
  }
  
  return format(date, 'MMM d');
}

export function formatPollResults(votes: string[], total: number): { percent: number; count: number } {
  if (total === 0) return { percent: 0, count: 0 };
  
  const count = votes.length;
  const percent = Math.round((count / total) * 100);
  
  return { percent, count };
}

export function calculateTimeRemaining(deadline: string): string {
  const deadlineDate = new Date(deadline);
  const now = new Date();
  
  if (deadlineDate <= now) {
    return 'Expired';
  }
  
  return formatDistance(deadlineDate, now, { addSuffix: false });
}