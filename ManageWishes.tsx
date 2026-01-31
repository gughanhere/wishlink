import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  ArrowLeft, 
  Search, 
  Edit2, 
  Trash2, 
  Gift, 
  Calendar, 
  Phone,
  Eye,
  Sparkles,
  Copy,
  CheckCircle2,
  Heart,
  Lock,
  LogOut
} from 'lucide-react';
import type { Wish } from '@/types';
import { OCCASIONS, GIFT_CARD_BRANDS } from '@/types';
import { format, parseISO, isPast, isToday } from 'date-fns';
import { AuthModal } from './AuthModal';

interface ManageWishesProps {
  onBack: () => void;
  onEditWish: (wish: Wish) => void;
  onViewWish: (wishNumber: string) => void;
  getWishesBySenderPhone: (phone: string) => Wish[];
  getWishesByRecipientPhone: (phone: string) => Wish[];
  deleteWish: (wishId: string) => void;
  isUserRegistered: (phone: string) => boolean;
  registerUser: (phone: string, password: string) => boolean;
  loginUser: (phone: string, password: string) => boolean;
  logoutUser: () => void;
  currentUser: string | null;
}

export function ManageWishes({ 
  onBack, 
  onEditWish, 
  onViewWish, 
  getWishesBySenderPhone, 
  getWishesByRecipientPhone,
  deleteWish,
  isUserRegistered,
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
}: ManageWishesProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [searched, setSearched] = useState(false);
  const [createdWishes, setCreatedWishes] = useState<Wish[]>([]);
  const [receivedWishes, setReceivedWishes] = useState<Wish[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authPhone, setAuthPhone] = useState<string>('');

  const handleSearch = () => {
    if (phoneNumber.length >= 10) {
      // Check if user is already authenticated for this phone
      if (currentUser === phoneNumber) {
        // Already logged in
        setCreatedWishes(getWishesBySenderPhone(phoneNumber));
        setReceivedWishes(getWishesByRecipientPhone(phoneNumber));
        setIsAuthenticated(true);
        setAuthPhone(phoneNumber);
        setSearched(true);
      } else {
        // Need to authenticate
        setAuthPhone(phoneNumber);
        setShowAuthModal(true);
      }
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    setIsAuthenticated(true);
    setCreatedWishes(getWishesBySenderPhone(authPhone));
    setReceivedWishes(getWishesByRecipientPhone(authPhone));
    setSearched(true);
  };

  const handleLogout = () => {
    logoutUser();
    setIsAuthenticated(false);
    setSearched(false);
    setPhoneNumber('');
    setCreatedWishes([]);
    setReceivedWishes([]);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getOccasionIcon = (occasion: string) => {
    const found = OCCASIONS.find(o => 
      o.label.toLowerCase() === occasion.toLowerCase() ||
      o.value === occasion.toLowerCase()
    );
    return found?.icon || '✨';
  };

  const getGiftCardBrand = (brandId: string) => {
    return GIFT_CARD_BRANDS.find(b => b.id === brandId);
  };

  const getStatusBadge = (wish: Wish) => {
    const date = parseISO(wish.occasionDate);
    if (isToday(date)) {
      return <Badge className="bg-green-500">Today</Badge>;
    } else if (isPast(date)) {
      return <Badge variant="secondary">Past</Badge>;
    } else {
      return <Badge className="bg-blue-500">Upcoming</Badge>;
    }
  };

  const WishCard = ({ wish, isCreated }: { wish: Wish; isCreated: boolean }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getOccasionIcon(wish.occasion)}</span>
            <div>
              <p className="font-semibold text-gray-900">{wish.occasion}</p>
              <p className="text-xs text-gray-500">
                {isCreated ? `For ${wish.recipientName}` : `From ${wish.senderName}`}
              </p>
            </div>
          </div>
          {getStatusBadge(wish)}
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{format(parseISO(wish.occasionDate), 'MMMM do, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-4 h-4" />
            <span>{isCreated ? wish.recipientPhone : wish.senderPhone}</span>
          </div>
          {wish.giftCard && (
            <div className="flex items-center gap-2 text-sm">
              <Gift className="w-4 h-4 text-purple-600" />
              <span className="text-purple-600 font-medium">
                {getGiftCardBrand(wish.giftCard.brand)?.name} Gift ${wish.giftCard.amount}
              </span>
            </div>
          )}
        </div>

        <div className="bg-gray-100 rounded-lg p-3 mb-3">
          <p className="text-sm text-gray-700 line-clamp-2">{wish.message}</p>
        </div>

        {isCreated && (
          <div className="flex items-center justify-between bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3 mb-3">
            <div>
              <p className="text-xs text-gray-600">Wish Code</p>
              <p className="font-mono font-bold text-purple-700">{wish.wishNumber}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyCode(wish.wishNumber)}
            >
              {copiedCode === wish.wishNumber ? (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onViewWish(wish.wishNumber)}
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
          {isCreated && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onEditWish(wish)}
              >
                <Edit2 className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:bg-red-50"
                onClick={() => setDeleteConfirm(wish.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <section className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-2xl font-bold text-gray-900 flex-1">Manage Wishes</h2>
          {isAuthenticated && (
            <Button variant="outline" onClick={handleLogout} className="text-red-600">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          )}
        </div>

        {/* Security Notice */}
        {!searched && (
          <Card className="mb-6 border-purple-200 bg-purple-50/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-purple-900">Secure Access</p>
                <p className="text-sm text-purple-700">
                  Your wishes are protected. You'll need to create a password or login to access them.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Phone Search */}
        {!searched ? (
          <Card className="shadow-xl border-0">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Find Your Wishes
                </h3>
                <p className="text-gray-500">
                  Enter your phone number to see created and received wishes
                </p>
              </div>

              <div className="space-y-4 max-w-md mx-auto">
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Enter your phone number"
                    className="pl-12 pr-4 py-6 text-lg"
                    maxLength={15}
                  />
                </div>

                <Button
                  onClick={handleSearch}
                  disabled={phoneNumber.length < 10}
                  className="w-full bg-purple-600 hover:bg-purple-700 py-6 text-lg"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Find Wishes
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Lock className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-gray-600">
                  Securely viewing wishes for <span className="font-semibold">{authPhone}</span>
                </p>
              </div>
              <Button variant="outline" onClick={() => setSearched(false)}>
                Change Number
              </Button>
            </div>

            <Tabs defaultValue="created" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="created">
                  <Heart className="w-4 h-4 mr-2" />
                  Created ({createdWishes.length})
                </TabsTrigger>
                <TabsTrigger value="received">
                  <Gift className="w-4 h-4 mr-2" />
                  Received ({receivedWishes.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="created">
                {createdWishes.length === 0 ? (
                  <div className="text-center py-12">
                    <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No wishes created yet</p>
                    <Button 
                      onClick={onBack} 
                      variant="outline" 
                      className="mt-4"
                    >
                      Create Your First Wish
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {createdWishes.map(wish => (
                      <WishCard key={wish.id} wish={wish} isCreated={true} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="received">
                {receivedWishes.length === 0 ? (
                  <div className="text-center py-12">
                    <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No wishes received yet</p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {receivedWishes.map(wish => (
                      <WishCard key={wish.id} wish={wish} isCreated={false} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Wish?</DialogTitle>
            </DialogHeader>
            <p className="text-gray-600 mb-4">
              This action cannot be undone. The wish code will no longer work.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => {
                  if (deleteConfirm) {
                    deleteWish(deleteConfirm);
                    setCreatedWishes(prev => prev.filter(w => w.id !== deleteConfirm));
                    setDeleteConfirm(null);
                  }
                }}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          phoneNumber={authPhone}
          isNewUser={!isUserRegistered(authPhone)}
          onLogin={loginUser}
          onRegister={registerUser}
          onSuccess={handleAuthSuccess}
        />
      </div>
    </section>
  );
}
