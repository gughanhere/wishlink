import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Wish, WishFormData } from '@/types';
import { useLocalStorage } from './useLocalStorage';

const WISHES_KEY = 'wishlink_wishes';

export function useWish() {
  const [wishes, setWishes] = useLocalStorage<Wish[]>(WISHES_KEY, []);

  const generateWishNumber = useCallback((): string => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }, []);

  const createWish = useCallback((formData: WishFormData): Wish => {
    const date = new Date(formData.occasionDate);
    const wishNumber = generateWishNumber();
    
    const newWish: Wish = {
      id: uuidv4(),
      wishNumber,
      senderName: formData.senderName,
      senderPhone: formData.senderPhone,
      recipientName: formData.recipientName,
      recipientPhone: formData.recipientPhone,
      occasion: formData.occasion === 'other' ? formData.customOccasion : formData.occasion,
      message: formData.message,
      photos: formData.photos,
      occasionDate: formData.occasionDate,
      occasionMonth: date.getMonth() + 1,
      occasionDay: date.getDate(),
      createdAt: new Date().toISOString(),
      smsSent: false,
      giftCard: formData.giftCard,
    };

    setWishes(prev => [...prev, newWish]);
    return newWish;
  }, [generateWishNumber, setWishes]);

  const updateWish = useCallback((wishId: string, formData: WishFormData): Wish | null => {
    const date = new Date(formData.occasionDate);
    
    const updatedWish: Wish = {
      id: wishId,
      wishNumber: '', // Will be preserved from existing
      senderName: formData.senderName,
      senderPhone: formData.senderPhone,
      recipientName: formData.recipientName,
      recipientPhone: formData.recipientPhone,
      occasion: formData.occasion === 'other' ? formData.customOccasion : formData.occasion,
      message: formData.message,
      photos: formData.photos,
      occasionDate: formData.occasionDate,
      occasionMonth: date.getMonth() + 1,
      occasionDay: date.getDate(),
      createdAt: new Date().toISOString(),
      smsSent: false,
      giftCard: formData.giftCard,
    };

    let result: Wish | null = null;
    setWishes(prev => prev.map(w => {
      if (w.id === wishId) {
        result = { ...updatedWish, wishNumber: w.wishNumber, createdAt: w.createdAt };
        return result;
      }
      return w;
    }));
    return result;
  }, [setWishes]);

  const deleteWish = useCallback((wishId: string) => {
    setWishes(prev => prev.filter(w => w.id !== wishId));
  }, [setWishes]);

  const getWishByNumber = useCallback((wishNumber: string): Wish | undefined => {
    return wishes.find(w => w.wishNumber.toUpperCase() === wishNumber.toUpperCase());
  }, [wishes]);

  const getWishesBySenderPhone = useCallback((phone: string): Wish[] => {
    return wishes.filter(w => w.senderPhone === phone);
  }, [wishes]);

  const getWishesByRecipientPhone = useCallback((phone: string): Wish[] => {
    return wishes.filter(w => w.recipientPhone === phone);
  }, [wishes]);

  const markSmsAsSent = useCallback((wishId: string) => {
    setWishes(prev => prev.map(w => 
      w.id === wishId ? { ...w, smsSent: true } : w
    ));
  }, [setWishes]);

  const getPendingSmsWishes = useCallback((): Wish[] => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();
    
    return wishes.filter(w => 
      !w.smsSent && 
      w.occasionMonth === currentMonth && 
      w.occasionDay === currentDay
    );
  }, [wishes]);

  return {
    wishes,
    createWish,
    updateWish,
    deleteWish,
    getWishByNumber,
    getWishesBySenderPhone,
    getWishesByRecipientPhone,
    markSmsAsSent,
    getPendingSmsWishes,
  };
}
