
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function extractInterestsFromMessage(message: string): string[] {
  const commonTopics = [
    'politics', 'business', 'technology', 'science', 'health', 'sports',
    'entertainment', 'climate', 'economy', 'education', 'finance',
    'environment', 'space', 'ai', 'crypto', 'artificial intelligence'
  ];
  
  const messageLower = message.toLowerCase();
  return commonTopics.filter(topic => messageLower.includes(topic));
}

export function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
