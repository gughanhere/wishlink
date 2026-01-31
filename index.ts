export interface Wish {
  id: string;
  wishNumber: string;
  senderName: string;
  senderPhone: string;
  recipientName: string;
  recipientPhone: string;
  occasion: string;
  customOccasion?: string;
  message: string;
  photos: string[];
  occasionDate: string;
  occasionMonth: number;
  occasionDay: number;
  createdAt: string;
  smsSent: boolean;
  giftCard?: GiftCard;
}

export interface GiftCard {
  brand: string;
  brandLogo: string;
  amount: number;
  currency: string;
  code: string;
  message: string;
}

export interface UserProfile {
  phone: string;
  passwordHash: string;
  createdAt: string;
}

export interface WishFormData {
  senderName: string;
  senderPhone: string;
  recipientName: string;
  recipientPhone: string;
  occasion: string;
  customOccasion: string;
  message: string;
  photos: string[];
  occasionDate: string;
  giftCard?: GiftCard;
  password?: string;
}

export type OccasionType = 
  | 'birthday'
  | 'anniversary'
  | 'wedding'
  | 'graduation'
  | 'new_year'
  | 'valentine'
  | 'mothers_day'
  | 'fathers_day'
  | 'christmas'
  | 'diwali'
  | 'eid'
  | 'other';

export const OCCASIONS: { value: OccasionType; label: string; icon: string }[] = [
  { value: 'birthday', label: 'Birthday', icon: '🎂' },
  { value: 'anniversary', label: 'Anniversary', icon: '💕' },
  { value: 'wedding', label: 'Wedding', icon: '💍' },
  { value: 'graduation', label: 'Graduation', icon: '🎓' },
  { value: 'new_year', label: 'New Year', icon: '🎉' },
  { value: 'valentine', label: 'Valentine\'s Day', icon: '❤️' },
  { value: 'mothers_day', label: 'Mother\'s Day', icon: '👩‍👧' },
  { value: 'fathers_day', label: 'Father\'s Day', icon: '👨‍👧' },
  { value: 'christmas', label: 'Christmas', icon: '🎄' },
  { value: 'diwali', label: 'Diwali', icon: '🪔' },
  { value: 'eid', label: 'Eid', icon: '🌙' },
  { value: 'other', label: 'Other', icon: '✨' },
];

export const GIFT_CARD_BRANDS: { id: string; name: string; logo: string; colors: string[] }[] = [
  { id: 'amazon', name: 'Amazon', logo: '📦', colors: ['#FF9900', '#232F3E'] },
  { id: 'starbucks', name: 'Starbucks', logo: '☕', colors: ['#00704A', '#FFFFFF'] },
  { id: 'apple', name: 'Apple', logo: '🍎', colors: ['#555555', '#000000'] },
  { id: 'google', name: 'Google Play', logo: '▶️', colors: ['#4285F4', '#34A853', '#FBBC05', '#EA4335'] },
  { id: 'netflix', name: 'Netflix', logo: '🎬', colors: ['#E50914', '#000000'] },
  { id: 'spotify', name: 'Spotify', logo: '🎵', colors: ['#1DB954', '#191414'] },
  { id: 'uber', name: 'Uber', logo: '🚗', colors: ['#000000', '#FFFFFF'] },
  { id: 'doordash', name: 'DoorDash', logo: '🍔', colors: ['#FF3008', '#FFFFFF'] },
  { id: 'target', name: 'Target', logo: '🎯', colors: ['#CC0000', '#FFFFFF'] },
  { id: 'walmart', name: 'Walmart', logo: '🛒', colors: ['#0071CE', '#FFC220'] },
  { id: 'nike', name: 'Nike', logo: '👟', colors: ['#111111', '#FFFFFF'] },
  { id: 'adidas', name: 'Adidas', logo: '⚽', colors: ['#000000', '#FFFFFF'] },
  { id: 'sephora', name: 'Sephora', logo: '💄', colors: ['#000000', '#FF0000'] },
  { id: 'ubereats', name: 'Uber Eats', logo: '🍕', colors: ['#06C167', '#000000'] },
  { id: 'airbnb', name: 'Airbnb', logo: '🏠', colors: ['#FF5A5F', '#FFFFFF'] },
];

export const GIFT_AMOUNTS = [10, 25, 50, 100, 150, 200, 250, 500];

// Simple hash function for passwords (client-side only - not for production)
export function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(16, '0');
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}
