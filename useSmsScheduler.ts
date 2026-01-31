import { useEffect, useCallback, useRef } from 'react';
import type { Wish } from '@/types';

interface SmsSchedulerProps {
  getPendingSmsWishes: () => Wish[];
  markSmsAsSent: (wishId: string) => void;
}

export function useSmsScheduler({ getPendingSmsWishes, markSmsAsSent }: SmsSchedulerProps) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const sendSms = useCallback((wish: Wish) => {
    const message = `Hey ${wish.recipientName}! 🎉 ${wish.senderName} has a special wish for you on your ${wish.occasion}! Use this code: ${wish.wishNumber} at WishLink to see your surprise! ✨`;
    
    console.log(`[SMS Simulation] To: ${wish.recipientPhone}`);
    console.log(`[SMS Simulation] Message: ${message}`);
    
    // In a real implementation, you would call an SMS API here
    // Example: await twilioClient.messages.create({
    //   to: wish.recipientPhone,
    //   from: process.env.TWILIO_PHONE,
    //   body: message
    // });
    
    // Show browser notification if permitted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('WishLink SMS Sent!', {
        body: `SMS sent to ${wish.recipientName} for ${wish.occasion}`,
        icon: '/favicon.ico',
      });
    }
    
    markSmsAsSent(wish.id);
  }, [markSmsAsSent]);

  const checkAndSendSms = useCallback(() => {
    const pendingWishes = getPendingSmsWishes();
    
    pendingWishes.forEach(wish => {
      const now = new Date();
      const wishDate = new Date(wish.occasionDate);
      
      // Only send if it's the same day and time is around 9 AM
      const isSameDay = now.getDate() === wishDate.getDate() && 
                        now.getMonth() === wishDate.getMonth();
      
      if (isSameDay && now.getHours() >= 9) {
        sendSms(wish);
      }
    });
  }, [getPendingSmsWishes, sendSms]);

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Check every minute for pending SMS
    intervalRef.current = setInterval(checkAndSendSms, 60000);
    
    // Initial check
    checkAndSendSms();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [checkAndSendSms]);

  return { checkAndSendSms };
}
