import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { 
  Calendar as CalendarIcon, 
  Upload, 
  X, 
  Camera, 
  CheckCircle2,
  Copy,
  ArrowLeft,
  Sparkles,
  Phone,
  User,
  Gift,
  MessageSquare,
  CreditCard
} from 'lucide-react';
import { OCCASIONS, GIFT_CARD_BRANDS, GIFT_AMOUNTS } from '@/types';
import type { WishFormData, Wish, GiftCard } from '@/types';

interface CreateWishProps {
  onBack: () => void;
  onSubmit: (data: WishFormData) => Wish;
  initialData?: Wish | null;
  isEditing?: boolean;
}

export function CreateWish({ onBack, onSubmit, initialData, isEditing = false }: CreateWishProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<WishFormData>({
    senderName: initialData?.senderName || '',
    senderPhone: initialData?.senderPhone || '',
    recipientName: initialData?.recipientName || '',
    recipientPhone: initialData?.recipientPhone || '',
    occasion: initialData?.occasion || '',
    customOccasion: '',
    message: initialData?.message || '',
    photos: initialData?.photos || [],
    occasionDate: initialData?.occasionDate || '',
    giftCard: initialData?.giftCard,
  });
  const [createdWish, setCreatedWish] = useState<Wish | null>(null);
  const [copied, setCopied] = useState(false);
  const [showGiftCardSelector, setShowGiftCardSelector] = useState(false);
  const [giftCardStep, setGiftCardStep] = useState(1);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(initialData?.giftCard?.brand || null);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(initialData?.giftCard?.amount || null);
  const [customAmount, setCustomAmount] = useState(initialData?.giftCard?.amount?.toString() || '');
  const [giftMessage, setGiftMessage] = useState(initialData?.giftCard?.message || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedBrandData = GIFT_CARD_BRANDS.find(b => b.id === selectedBrand);

  const updateFormData = useCallback((field: keyof WishFormData, value: string | string[] | GiftCard | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (formData.photos.length >= 5) return;
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          photos: [...prev.photos, reader.result as string],
        }));
      };
      reader.readAsDataURL(file);
    });
  }, [formData.photos.length]);

  const removePhoto = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  }, []);

  const isStepValid = useCallback(() => {
    switch (step) {
      case 1:
        return formData.senderName && formData.senderPhone.length >= 10;
      case 2:
        return formData.recipientName && formData.recipientPhone.length >= 10;
      case 3:
        return formData.occasion && (formData.occasion !== 'other' || formData.customOccasion);
      case 4:
        return formData.occasionDate;
      case 5:
        return formData.message.length >= 10;
      default:
        return true;
    }
  }, [formData, step]);

  const handleSubmit = useCallback(() => {
    const wish = onSubmit(formData);
    setCreatedWish(wish);
  }, [formData, onSubmit]);

  const copyWishNumber = useCallback(() => {
    if (createdWish) {
      navigator.clipboard.writeText(createdWish.wishNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [createdWish]);

  const handleGiftCardContinue = () => {
    if (giftCardStep === 1 && selectedBrand) {
      setGiftCardStep(2);
    } else if (giftCardStep === 2 && (selectedAmount || customAmount)) {
      setGiftCardStep(3);
    } else if (giftCardStep === 3) {
      const amount = selectedAmount || parseInt(customAmount) || 0;
      const giftCard: GiftCard = {
        brand: selectedBrand!,
        brandLogo: selectedBrandData?.logo || '🎁',
        amount,
        currency: '$',
        code: `GC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        message: giftMessage || `Enjoy your ${selectedBrandData?.name} gift card!`,
      };
      updateFormData('giftCard', giftCard);
      setShowGiftCardSelector(false);
      setGiftCardStep(1);
    }
  };

  const skipGiftCard = () => {
    setShowGiftCardSelector(false);
    setGiftCardStep(1);
    setSelectedBrand(null);
    setSelectedAmount(null);
    setCustomAmount('');
    setGiftMessage('');
  };

  const removeGiftCard = () => {
    updateFormData('giftCard', undefined);
  };

  const renderGiftCardSelector = () => {
    switch (giftCardStep) {
      case 1:
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 text-center">Choose a brand for your e-gift card</p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-[300px] overflow-y-auto">
              {GIFT_CARD_BRANDS.map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => setSelectedBrand(brand.id)}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                    selectedBrand === brand.id
                      ? 'border-purple-600 bg-purple-50 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  <div className="text-2xl mb-1">{brand.logo}</div>
                  <p className="text-xs font-medium text-gray-700">{brand.name}</p>
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 text-center">Select amount for {selectedBrandData?.name}</p>
            <div className="grid grid-cols-4 gap-2">
              {GIFT_AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount('');
                  }}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 ${
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
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
              <Input
                type="number"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(null);
                }}
                placeholder="Custom amount"
                className="pl-8"
                min="5"
                max="1000"
              />
            </div>
          </div>
        );
      case 3:
        const amount = selectedAmount || parseInt(customAmount) || 0;
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 text-center">Add a personal message</p>
            <Card 
              className="overflow-hidden"
              style={{ 
                background: `linear-gradient(135deg, ${selectedBrandData?.colors[0] || '#9333ea'} 0%, ${selectedBrandData?.colors[1] || '#ec4899'} 100%)`
              }}
            >
              <CardContent className="p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">{selectedBrandData?.logo}</span>
                  <span className="text-xl font-bold">${amount}</span>
                </div>
                <p className="text-white/80 text-sm">{selectedBrandData?.name} Gift Card</p>
              </CardContent>
            </Card>
            <textarea
              value={giftMessage}
              onChange={(e) => setGiftMessage(e.target.value)}
              placeholder={`Enjoy your ${selectedBrandData?.name} gift!`}
              className="w-full p-3 border border-gray-200 rounded-xl min-h-[80px] focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm"
              maxLength={200}
            />
            <p className="text-xs text-gray-500 text-right">{giftMessage.length}/200</p>
          </div>
        );
      default:
        return null;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">About You</h3>
              <p className="text-gray-500">Tell us who you are</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="senderName">Your Name</Label>
                <Input
                  id="senderName"
                  value={formData.senderName}
                  onChange={(e) => updateFormData('senderName', e.target.value)}
                  placeholder="e.g., John Smith"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="senderPhone">Your Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="senderPhone"
                    type="tel"
                    value={formData.senderPhone}
                    onChange={(e) => updateFormData('senderPhone', e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g., 1234567890"
                    className="mt-1 pl-10"
                    maxLength={15}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">We'll use this to send you confirmations</p>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">About Recipient</h3>
              <p className="text-gray-500">Who are you wishing?</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="recipientName">Recipient's Name</Label>
                <Input
                  id="recipientName"
                  value={formData.recipientName}
                  onChange={(e) => updateFormData('recipientName', e.target.value)}
                  placeholder="e.g., Jane Doe"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="recipientPhone">Recipient's Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="recipientPhone"
                    type="tel"
                    value={formData.recipientPhone}
                    onChange={(e) => updateFormData('recipientPhone', e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g., 1234567890"
                    className="mt-1 pl-10"
                    maxLength={15}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">We'll send them the wish code on the special day</p>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Select Occasion</h3>
              <p className="text-gray-500">What's the special day?</p>
            </div>
            
            <div className="space-y-4">
              <Select
                value={formData.occasion}
                onValueChange={(value) => updateFormData('occasion', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose an occasion" />
                </SelectTrigger>
                <SelectContent>
                  {OCCASIONS.map((occ) => (
                    <SelectItem key={occ.value} value={occ.value}>
                      <span className="mr-2">{occ.icon}</span>
                      {occ.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {formData.occasion === 'other' && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <Label htmlFor="customOccasion">Custom Occasion</Label>
                  <Input
                    id="customOccasion"
                    value={formData.customOccasion}
                    onChange={(e) => updateFormData('customOccasion', e.target.value)}
                    placeholder="e.g., Promotion, Retirement"
                    className="mt-1"
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Select Date</h3>
              <p className="text-gray-500">When is the special day?</p>
            </div>
            
            <div className="space-y-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.occasionDate ? (
                      format(new Date(formData.occasionDate), 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <Calendar
                    mode="single"
                    selected={formData.occasionDate ? new Date(formData.occasionDate) : undefined}
                    onSelect={(date) => date && updateFormData('occasionDate', date.toISOString())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Your Message</h3>
              <p className="text-gray-500">Write something heartfelt</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="message">Personal Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => updateFormData('message', e.target.value)}
                  placeholder={`Dear ${formData.recipientName || 'friend'}, wishing you a wonderful...`}
                  className="mt-1 min-h-[150px]"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.message.length}/500 characters
                </p>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Add Photos</h3>
              <p className="text-gray-500">Upload memorable photos (optional)</p>
            </div>
            
            <div className="space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                multiple
                className="hidden"
              />
              
              {formData.photos.length < 5 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-32 border-dashed border-2 flex flex-col items-center justify-center gap-2"
                >
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-gray-500">Click to upload photos</span>
                  <span className="text-xs text-gray-400">{formData.photos.length}/5 photos</span>
                </Button>
              )}
              
              {formData.photos.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={photo}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Add a Gift Card</h3>
              <p className="text-gray-500">Send an e-gift card with your wish (optional)</p>
            </div>
            
            <div className="space-y-4">
              {formData.giftCard ? (
                <Card 
                  className="overflow-hidden relative"
                  style={{ 
                    background: `linear-gradient(135deg, ${GIFT_CARD_BRANDS.find(b => b.id === formData.giftCard?.brand)?.colors[0] || '#9333ea'} 0%, ${GIFT_CARD_BRANDS.find(b => b.id === formData.giftCard?.brand)?.colors[1] || '#ec4899'} 100%)`
                  }}
                >
                  <CardContent className="p-6 text-white">
                    <button
                      onClick={removeGiftCard}
                      className="absolute top-2 right-2 w-6 h-6 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-4xl">{formData.giftCard.brandLogo}</span>
                      <span className="text-2xl font-bold">${formData.giftCard.amount}</span>
                    </div>
                    <p className="text-white/80">
                      {GIFT_CARD_BRANDS.find(b => b.id === formData.giftCard?.brand)?.name} Gift Card
                    </p>
                    {formData.giftCard.message && (
                      <p className="text-white/60 text-sm mt-2 italic">"{formData.giftCard.message}"</p>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowGiftCardSelector(true)}
                  className="w-full h-32 border-dashed border-2 flex flex-col items-center justify-center gap-2 hover:border-purple-400 hover:bg-purple-50"
                >
                  <CreditCard className="w-8 h-8 text-gray-400" />
                  <span className="text-gray-500">Add E-Gift Card</span>
                  <span className="text-xs text-gray-400">Amazon, Starbucks, Netflix & more</span>
                </Button>
              )}
              
              {!formData.giftCard && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleSubmit}
                  className="w-full text-gray-500"
                >
                  Skip and {isEditing ? 'Save Changes' : 'Create Wish'}
                </Button>
              )}
              
              {formData.giftCard && (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {isEditing ? 'Save Changes' : 'Create Wish'}
                </Button>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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
          <div className="flex-1">
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                <div
                  key={s}
                  className={`h-2 w-6 rounded-full transition-colors ${
                    s <= step ? 'bg-purple-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="w-10" />
        </div>

        {/* Card */}
        <Card className="shadow-xl border-0">
          <CardContent className="p-6">
            {renderStep()}

            {/* Navigation */}
            {step < 7 && (
              <div className="flex gap-3 mt-8">
                {step > 1 && (
                  <Button
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                )}
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={!isStepValid()}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  Continue
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Gift Card Selector Dialog */}
      <Dialog open={showGiftCardSelector} onOpenChange={setShowGiftCardSelector}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              {giftCardStep === 1 && 'Select Brand'}
              {giftCardStep === 2 && 'Select Amount'}
              {giftCardStep === 3 && 'Add Message'}
            </DialogTitle>
          </DialogHeader>
          
          {/* Progress */}
          <div className="flex justify-center gap-1 mb-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 w-12 rounded-full transition-colors ${
                  s <= giftCardStep ? 'bg-purple-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          
          {renderGiftCardSelector()}
          
          <div className="flex gap-3 mt-4">
            {giftCardStep === 1 && (
              <Button
                variant="outline"
                onClick={skipGiftCard}
                className="flex-1"
              >
                Skip
              </Button>
            )}
            {giftCardStep > 1 && (
              <Button
                variant="outline"
                onClick={() => setGiftCardStep(giftCardStep - 1)}
                className="flex-1"
              >
                Back
              </Button>
            )}
            <Button
              onClick={handleGiftCardContinue}
              disabled={
                (giftCardStep === 1 && !selectedBrand) ||
                (giftCardStep === 2 && !selectedAmount && !customAmount)
              }
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              {giftCardStep === 3 ? 'Add Gift Card' : 'Continue'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={!!createdWish} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              {isEditing ? 'Wish Updated!' : 'Wish Created Successfully!'}
            </DialogTitle>
            <DialogDescription className="text-center">
              Share this code with {createdWish?.recipientName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 text-center">
            <p className="text-sm text-gray-600 mb-2">Wish Code</p>
            <p className="text-4xl font-bold tracking-widest text-purple-700 font-mono">
              {createdWish?.wishNumber}
            </p>
          </div>
          
          {createdWish?.giftCard && (
            <Card 
              className="overflow-hidden"
              style={{ 
                background: `linear-gradient(135deg, ${GIFT_CARD_BRANDS.find(b => b.id === createdWish.giftCard?.brand)?.colors[0] || '#9333ea'} 0%, ${GIFT_CARD_BRANDS.find(b => b.id === createdWish.giftCard?.brand)?.colors[1] || '#ec4899'} 100%)`
              }}
            >
              <CardContent className="p-4 text-white text-center">
                <Gift className="w-6 h-6 mx-auto mb-2" />
                <p className="font-semibold">Includes {GIFT_CARD_BRANDS.find(b => b.id === createdWish.giftCard?.brand)?.name} Gift Card</p>
                <p className="text-2xl font-bold">${createdWish.giftCard.amount}</p>
              </CardContent>
            </Card>
          )}
          
          <div className="space-y-3">
            <Button
              onClick={copyWishNumber}
              variant="outline"
              className="w-full"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Code
                </>
              )}
            </Button>
            
            <div className="text-sm text-gray-500 text-center space-y-1">
              <p>We'll send an SMS reminder to {createdWish?.recipientPhone}</p>
              <p>on {createdWish?.occasionDate && format(new Date(createdWish.occasionDate), 'MMMM do')} with this code.</p>
            </div>
            
            <Button
              onClick={onBack}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isEditing ? 'Done' : 'Create Another Wish'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
