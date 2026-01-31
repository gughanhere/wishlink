import { useState, useEffect, useCallback } from 'react';
import { Hero } from '@/sections/Hero';
import { CreateWish } from '@/sections/CreateWish';
import { ViewWish } from '@/sections/ViewWish';
import { ManageWishes } from '@/sections/ManageWishes';
import { useWish } from '@/hooks/useWish';
import { useAuth } from '@/hooks/useAuth';
import { useSmsScheduler } from '@/hooks/useSmsScheduler';
import type { WishFormData, Wish } from '@/types';
import { Toaster } from '@/components/ui/sonner';
import './styles.css';

type PageView = 'home' | 'create' | 'view' | 'manage';

function App() {
  const [currentView, setCurrentView] = useState<PageView>('home');
  const [viewWishNumber, setViewWishNumber] = useState<string>('');
  const [editingWish, setEditingWish] = useState<Wish | null>(null);
  
  const { 
    createWish, 
    updateWish,
    deleteWish,
    getWishByNumber, 
    getWishesBySenderPhone,
    getWishesByRecipientPhone,
    markSmsAsSent, 
    getPendingSmsWishes 
  } = useWish();

  const {
    isUserRegistered,
    registerUser,
    loginUser,
    logoutUser,
    currentUser,
  } = useAuth();
  
  // Initialize SMS scheduler
  useSmsScheduler({ getPendingSmsWishes, markSmsAsSent });

  const handleCreateWish = useCallback(() => {
    setEditingWish(null);
    setCurrentView('create');
  }, []);

  const handleViewWish = useCallback((wishNumber: string) => {
    setViewWishNumber(wishNumber);
    setCurrentView('view');
  }, []);

  const handleManageWishes = useCallback(() => {
    setCurrentView('manage');
  }, []);

  const handleBackToHome = useCallback(() => {
    setCurrentView('home');
    setViewWishNumber('');
    setEditingWish(null);
  }, []);

  const handleSubmitWish = useCallback((formData: WishFormData) => {
    if (editingWish) {
      const wish = updateWish(editingWish.id, formData);
      return wish || editingWish;
    }
    const wish = createWish(formData);
    return wish;
  }, [createWish, updateWish, editingWish]);

  const handleEditWish = useCallback((wish: Wish) => {
    setEditingWish(wish);
    setCurrentView('create');
  }, []);

  // Check for pending SMS on mount and periodically
  useEffect(() => {
    const checkPendingSms = () => {
      const pending = getPendingSmsWishes();
      pending.forEach(wish => {
        console.log(`[Scheduler] Pending SMS for ${wish.recipientName} - ${wish.occasion}`);
      });
    };

    checkPendingSms();
    const interval = setInterval(checkPendingSms, 60000);
    
    return () => clearInterval(interval);
  }, [getPendingSmsWishes]);

  return (
    <div className="min-h-screen bg-white">
      {currentView === 'home' && (
        <Hero 
          onCreateWish={handleCreateWish} 
          onViewWish={handleViewWish}
          onManageWishes={handleManageWishes}
        />
      )}
      
      {currentView === 'create' && (
        <CreateWish 
          onBack={handleBackToHome} 
          onSubmit={handleSubmitWish}
          initialData={editingWish}
          isEditing={!!editingWish}
        />
      )}
      
      {currentView === 'view' && (
        <ViewWish 
          initialWishNumber={viewWishNumber}
          onBack={handleBackToHome}
          getWishByNumber={getWishByNumber}
        />
      )}
      
      {currentView === 'manage' && (
        <ManageWishes
          onBack={handleBackToHome}
          onEditWish={handleEditWish}
          onViewWish={handleViewWish}
          getWishesBySenderPhone={getWishesBySenderPhone}
          getWishesByRecipientPhone={getWishesByRecipientPhone}
          deleteWish={deleteWish}
          isUserRegistered={isUserRegistered}
          registerUser={registerUser}
          loginUser={loginUser}
          logoutUser={logoutUser}
          currentUser={currentUser}
        />
      )}
      
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
