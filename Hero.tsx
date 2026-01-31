import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Gift, Search, Sparkles, Heart, FolderOpen, CreditCard } from 'lucide-react';

interface HeroProps {
  onCreateWish: () => void;
  onViewWish: (wishNumber: string) => void;
  onManageWishes: () => void;
}

export function Hero({ onCreateWish, onViewWish, onManageWishes }: HeroProps) {
  const [wishNumber, setWishNumber] = useState('');

  const handleViewWish = () => {
    if (wishNumber.trim()) {
      onViewWish(wishNumber.trim().toUpperCase());
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-pink-500">
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 5}s`,
              }}
            >
              <Sparkles 
                className="text-white/20" 
                size={16 + Math.random() * 24}
              />
            </div>
          ))}
        </div>
        
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-400/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo/Icon */}
        <div className="mb-8 inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl shadow-2xl">
          <Gift className="w-12 h-12 text-white" />
        </div>

        {/* Title */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
          Wish<span className="text-yellow-300">Link</span>
        </h1>
        
        <p className="text-xl sm:text-2xl text-white/90 mb-4 font-medium">
          Create Magical Moments for Special Occasions
        </p>
        
        <p className="text-lg text-white/70 mb-12 max-w-2xl mx-auto">
          Generate a unique wish code, add photos and messages, and let us remind your loved ones on their special day.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button
            onClick={onCreateWish}
            size="lg"
            className="bg-white text-purple-600 hover:bg-white/90 hover:scale-105 transition-all duration-300 text-lg px-8 py-6 rounded-2xl shadow-xl font-semibold group"
          >
            <Heart className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
            Create a Wish
          </Button>
          <Button
            onClick={onManageWishes}
            size="lg"
            variant="outline"
            className="bg-white/10 text-white border-white/30 hover:bg-white/20 hover:scale-105 transition-all duration-300 text-lg px-8 py-6 rounded-2xl font-semibold group"
          >
            <FolderOpen className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
            My Wishes
          </Button>
        </div>

        {/* View Wish Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20">
          <p className="text-white/80 mb-4 text-sm uppercase tracking-wider font-medium">
            Received a wish code?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <Input
                type="text"
                placeholder="Enter your 6-digit code (e.g., ABC123)"
                value={wishNumber}
                onChange={(e) => setWishNumber(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleViewWish()}
                className="pl-12 pr-4 py-6 bg-white/20 border-white/30 text-white placeholder:text-white/50 rounded-xl text-center tracking-widest font-mono text-lg focus:bg-white/30 focus:border-white/50 transition-all"
                maxLength={6}
              />
            </div>
            <Button
              onClick={handleViewWish}
              disabled={!wishNumber.trim()}
              className="bg-yellow-400 text-purple-900 hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-6 rounded-xl font-semibold text-lg transition-all"
            >
              View Wish
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 text-white/80">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="text-sm">Unique Wish Codes</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
              <Heart className="w-6 h-6" />
            </div>
            <p className="text-sm">Photos & Messages</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
              <CreditCard className="w-6 h-6" />
            </div>
            <p className="text-sm">E-Gift Cards</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
              <Gift className="w-6 h-6" />
            </div>
            <p className="text-sm">SMS Reminders</p>
          </div>
        </div>
      </div>
    </section>
  );
}
