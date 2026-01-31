import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  ArrowLeft, 
  Heart, 
  Calendar, 
  User, 
  Gift,
  Sparkles,
  Share2,
  Download
} from 'lucide-react';
import { OCCASIONS, GIFT_CARD_BRANDS } from '@/types';
import type { Wish } from '@/types';
import { format, parseISO } from 'date-fns';

interface ViewWishProps {
  initialWishNumber?: string;
  onBack: () => void;
  getWishByNumber: (wishNumber: string) => Wish | undefined;
}

export function ViewWish({ initialWishNumber = '', onBack, getWishByNumber }: ViewWishProps) {
  const [wishNumber, setWishNumber] = useState(initialWishNumber);
  const [wish, setWish] = useState<Wish | null>(null);
  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (initialWishNumber) {
      handleSearch(initialWishNumber);
    }
  }, [initialWishNumber]);

  useEffect(() => {
    if (wish) {
      setTimeout(() => setShowConfetti(true), 300);
    }
  }, [wish]);

  const handleSearch = (code: string) => {
    setIsSearching(true);
    setError('');
    
    const foundWish = getWishByNumber(code);
    
    if (foundWish) {
      setWish(foundWish);
    } else {
      setError('Wish not found. Please check the code and try again.');
      setWish(null);
    }
    
    setIsSearching(false);
  };

  const getOccasionIcon = (occasion: string) => {
    const found = OCCASIONS.find(o => 
      o.label.toLowerCase() === occasion.toLowerCase() ||
      o.value === occasion.toLowerCase()
    );
    return found?.icon || '✨';
  };

  const getOccasionLabel = (occasion: string) => {
    const found = OCCASIONS.find(o => o.value === occasion.toLowerCase());
    return found?.label || occasion;
  };

  if (!wish) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 py-8 px-4">
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              onClick={onBack}
              className="mr-4"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-xl font-bold text-gray-900">View Wish</h2>
          </div>

          <Card className="shadow-xl border-0">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Enter Wish Code
                </h3>
                <p className="text-gray-500">
                  Type the 6-digit code you received
                </p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    value={wishNumber}
                    onChange={(e) => setWishNumber(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && wishNumber && handleSearch(wishNumber)}
                    placeholder="Enter code (e.g., ABC123)"
                    className="pl-12 pr-4 py-6 text-center tracking-widest font-mono text-xl uppercase"
                    maxLength={6}
                  />
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center text-sm">
                    {error}
                  </div>
                )}

                <Button
                  onClick={() => wishNumber && handleSearch(wishNumber)}
                  disabled={!wishNumber || isSearching}
                  className="w-full bg-purple-600 hover:bg-purple-700 py-6 text-lg"
                >
                  {isSearching ? 'Searching...' : 'View Wish'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 py-4 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-gray-600"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="text-gray-600">
              <Share2 className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-600">
              <Download className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Wish Card */}
        <div className="relative">
          {/* Confetti Animation */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-confetti"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: '-20px',
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${3 + Math.random() * 2}s`,
                  }}
                >
                  <span
                    style={{
                      fontSize: `${12 + Math.random() * 16}px`,
                    }}
                  >
                    {['🎉', '✨', '🎊', '💝', '🎈', '🌟', '💖'][Math.floor(Math.random() * 7)]}
                  </span>
                </div>
              ))}
            </div>
          )}

          <Card className="shadow-2xl border-0 overflow-hidden">
            {/* Top Decoration */}
            <div className="h-32 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 relative overflow-hidden">
              <div className="absolute inset-0 opacity-30">
                {[...Array(10)].map((_, i) => (
                  <Sparkles
                    key={i}
                    className="absolute text-white"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      transform: `scale(${0.5 + Math.random()})`,
                    }}
                    size={20 + Math.random() * 20}
                  />
                ))}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
            </div>

            <CardContent className="p-6 -mt-8 relative">
              {/* Occasion Badge */}
              <div className="flex justify-center mb-6">
                <Badge 
                  variant="secondary" 
                  className="text-lg px-6 py-2 bg-white shadow-lg border-0"
                >
                  <span className="mr-2 text-2xl">{getOccasionIcon(wish.occasion)}</span>
                  <span className="font-semibold">{getOccasionLabel(wish.occasion)}</span>
                </Badge>
              </div>

              {/* Recipient Name */}
              <div className="text-center mb-8">
                <p className="text-gray-500 text-sm mb-1">For</p>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {wish.recipientName}
                </h2>
              </div>

              {/* Photos */}
              {wish.photos.length > 0 && (
                <div className="mb-8">
                  <div className={`grid gap-3 ${
                    wish.photos.length === 1 ? 'grid-cols-1' :
                    wish.photos.length === 2 ? 'grid-cols-2' :
                    'grid-cols-3'
                  }`}>
                    {wish.photos.map((photo, index) => (
                      <div 
                        key={index} 
                        className={`relative overflow-hidden rounded-xl shadow-lg ${
                          wish.photos.length === 1 ? 'aspect-video' : 'aspect-square'
                        }`}
                      >
                        <img
                          src={photo}
                          alt={`Memory ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Message */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-8 relative">
                <Heart className="absolute top-4 right-4 w-6 h-6 text-pink-400" />
                <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                  {wish.message}
                </p>
              </div>

              {/* Gift Card */}
              {wish.giftCard && (
                <div className="mb-8">
                  <Card 
                    className="overflow-hidden shadow-xl"
                    style={{ 
                      background: `linear-gradient(135deg, ${GIFT_CARD_BRANDS.find(b => b.id === wish.giftCard?.brand)?.colors[0] || '#9333ea'} 0%, ${GIFT_CARD_BRANDS.find(b => b.id === wish.giftCard?.brand)?.colors[1] || '#ec4899'} 100%)`
                    }}
                  >
                    <CardContent className="p-6 text-white">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-4xl">{wish.giftCard.brandLogo}</span>
                          <div>
                            <p className="font-semibold text-lg">{GIFT_CARD_BRANDS.find(b => b.id === wish.giftCard?.brand)?.name} Gift Card</p>
                            <p className="text-white/70 text-sm">A special gift from {wish.senderName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold">${wish.giftCard.amount}</p>
                        </div>
                      </div>
                      
                      {wish.giftCard.message && (
                        <div className="bg-white/10 rounded-lg p-3 mb-4">
                          <p className="text-white/90 italic">"{wish.giftCard.message}"</p>
                        </div>
                      )}
                      
                      <div className="bg-white/20 rounded-lg p-4 text-center">
                        <p className="text-xs text-white/60 mb-1">Gift Card Code</p>
                        <p className="text-xl font-mono font-bold tracking-wider">{wish.giftCard.code}</p>
                      </div>
                      
                      <p className="text-xs text-white/50 text-center mt-3">
                        Redeem at {GIFT_CARD_BRANDS.find(b => b.id === wish.giftCard?.brand)?.name} website or app
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Sender Info */}
              <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>From {wish.senderName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{format(parseISO(wish.occasionDate), 'MMMM do, yyyy')}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Made with love on WishLink
                  <Sparkles className="w-4 h-4" />
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Your Own */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 mb-4">Want to create a wish for someone special?</p>
          <Button
            onClick={onBack}
            variant="outline"
            className="border-purple-300 text-purple-600 hover:bg-purple-50"
          >
            <Heart className="w-4 h-4 mr-2" />
            Create Your Own Wish
          </Button>
        </div>
      </div>
    </section>
  );
}
