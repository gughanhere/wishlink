import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowLeft, 
  ArrowRight,
  Gift, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { GIFT_CARD_BRANDS, GIFT_AMOUNTS } from '@/types';
import type { GiftCard } from '@/types';

interface GiftCardSelectorProps {
  onBack: () => void;
  onNext: (giftCard?: GiftCard) => void;
  onSkip: () => void;
  initialGiftCard?: GiftCard;
}

export function GiftCardSelector({ onBack, onNext, onSkip, initialGiftCard }: GiftCardSelectorProps) {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(initialGiftCard?.brand || null);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(initialGiftCard?.amount || null);
  const [customAmount, setCustomAmount] = useState(initialGiftCard?.amount?.toString() || '');
  const [giftMessage, setGiftMessage] = useState(initialGiftCard?.message || '');
  const [step, setStep] = useState(1);

  const selectedBrandData = GIFT_CARD_BRANDS.find(b => b.id === selectedBrand);

  const handleContinue = () => {
    if (step === 1 && selectedBrand) {
      setStep(2);
    } else if (step === 2 && (selectedAmount || customAmount)) {
      setStep(3);
    } else if (step === 3) {
      const amount = selectedAmount || parseInt(customAmount) || 0;
      const giftCard: GiftCard = {
        brand: selectedBrand!,
        brandLogo: selectedBrandData?.logo || '🎁',
        amount,
        currency: '$',
        code: `GC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        message: giftMessage || `Enjoy your ${selectedBrandData?.name} gift card!`,
      };
      onNext(giftCard);
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Add a Gift Card</h3>
              <p className="text-gray-500">Choose a brand for your e-gift card</p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {GIFT_CARD_BRANDS.map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => setSelectedBrand(brand.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedBrand === brand.id
                      ? 'border-purple-600 bg-purple-50 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  <div className="text-3xl mb-2">{brand.logo}</div>
                  <p className="text-xs font-medium text-gray-700">{brand.name}</p>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-6">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: selectedBrandData?.colors[0] || '#9333ea' }}
              >
                <span className="text-3xl">{selectedBrandData?.logo}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Select Amount</h3>
              <p className="text-gray-500">How much would you like to gift?</p>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {GIFT_AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount('');
                  }}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedAmount === amount
                      ? 'border-purple-600 bg-purple-50 shadow-lg'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <p className="text-lg font-bold text-gray-900">${amount}</p>
                </button>
              ))}
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-sm text-gray-500">or enter custom amount</span>
              </div>
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
              <Input
                type="number"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(null);
                }}
                placeholder="Enter amount"
                className="pl-10 py-6 text-lg"
                min="5"
                max="1000"
              />
            </div>
          </div>
        );

      case 3:
        const amount = selectedAmount || parseInt(customAmount) || 0;
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Add a Message</h3>
              <p className="text-gray-500">Personalize your gift card</p>
            </div>

            {/* Gift Card Preview */}
            <Card 
              className="overflow-hidden"
              style={{ 
                background: `linear-gradient(135deg, ${selectedBrandData?.colors[0] || '#9333ea'} 0%, ${selectedBrandData?.colors[1] || '#ec4899'} 100%)`
              }}
            >
              <CardContent className="p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{selectedBrandData?.logo}</span>
                  <span className="text-2xl font-bold">${amount}</span>
                </div>
                <p className="text-white/80 text-sm">{selectedBrandData?.name} Gift Card</p>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-xs text-white/60">Code: ****-****-****</p>
                </div>
              </CardContent>
            </Card>

            <div>
              <Label htmlFor="giftMessage">Personal Message (Optional)</Label>
              <textarea
                id="giftMessage"
                value={giftMessage}
                onChange={(e) => setGiftMessage(e.target.value)}
                placeholder={`Enjoy your ${selectedBrandData?.name} gift! Treat yourself to something special.`}
                className="w-full mt-2 p-4 border border-gray-200 rounded-xl min-h-[100px] focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                maxLength={200}
              />
              <p className="text-xs text-gray-500 mt-1">{giftMessage.length}/200 characters</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canContinue = () => {
    switch (step) {
      case 1:
        return !!selectedBrand;
      case 2:
        return !!selectedAmount || (customAmount && parseInt(customAmount) >= 5);
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={step === 1 ? onBack : () => setStep(step - 1)} className="mr-4">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <div className="flex justify-center gap-1">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-2 w-12 rounded-full transition-colors ${
                    s <= step ? 'bg-purple-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="w-10" />
        </div>

        <Card className="shadow-xl border-0">
          <CardContent className="p-6">
            {renderStep()}

            {/* Navigation */}
            <div className="flex gap-3 mt-8">
              {step === 1 && (
                <Button
                  variant="outline"
                  onClick={handleSkip}
                  className="flex-1"
                >
                  Skip Gift Card
                </Button>
              )}
              <Button
                onClick={handleContinue}
                disabled={!canContinue()}
                className={`bg-purple-600 hover:bg-purple-700 ${step === 1 ? 'flex-1' : 'flex-1'}`}
              >
                {step === 3 ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Add Gift Card
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
