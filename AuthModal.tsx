import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Lock, Phone, CheckCircle2, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber: string;
  isNewUser: boolean;
  onLogin: (phone: string, password: string) => boolean;
  onRegister: (phone: string, password: string) => boolean;
  onSuccess: () => void;
}

export function AuthModal({ 
  isOpen, 
  onClose, 
  phoneNumber, 
  isNewUser, 
  onLogin, 
  onRegister,
  onSuccess 
}: AuthModalProps) {
  const [activeTab, setActiveTab] = useState(isNewUser ? 'register' : 'login');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validatePassword = (pass: string): string | null => {
    if (pass.length < 6) return 'Password must be at least 6 characters';
    if (!/[a-zA-Z]/.test(pass)) return 'Password must contain at least one letter';
    if (!/[0-9]/.test(pass)) return 'Password must contain at least one number';
    return null;
  };

  const handleSubmit = async () => {
    setError('');
    setIsLoading(true);

    // Simulate network delay for security
    await new Promise(resolve => setTimeout(resolve, 500));

    if (activeTab === 'register') {
      const validationError = validatePassword(password);
      if (validationError) {
        setError(validationError);
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }

      const success = onRegister(phoneNumber, password);
      if (success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 1000);
      } else {
        setError('Failed to create account. Please try again.');
      }
    } else {
      const success = onLogin(phoneNumber, password);
      if (success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 1000);
      } else {
        setError('Invalid password. Please try again.');
      }
    }

    setIsLoading(false);
  };

  const resetForm = () => {
    setPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        resetForm();
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-purple-600" />
            </div>
            Secure Access
          </DialogTitle>
          <DialogDescription className="text-center">
            {isNewUser 
              ? 'Create a password to secure your wishes' 
              : 'Enter your password to access your wishes'}
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {activeTab === 'register' ? 'Account Created!' : 'Welcome Back!'}
            </p>
            <p className="text-gray-500">Redirecting...</p>
          </div>
        ) : (
          <>
            <Tabs value={activeTab} onValueChange={(v) => {
              setActiveTab(v);
              resetForm();
            }} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4 mt-4">
                <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-700">{phoneNumber}</span>
                </div>

                <div>
                  <Label htmlFor="loginPassword">Password</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="loginPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="pl-10 pr-10"
                      onKeyDown={(e) => e.key === 'Enter' && password && handleSubmit()}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={!password || isLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {isLoading ? 'Verifying...' : 'Access My Wishes'}
                </Button>
              </TabsContent>

              <TabsContent value="register" className="space-y-4 mt-4">
                <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-700">{phoneNumber}</span>
                </div>

                <div>
                  <Label htmlFor="regPassword">Create Password</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="regPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 chars, 1 letter, 1 number"
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Must be at least 6 characters with 1 letter and 1 number
                  </p>
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="pl-10"
                      onKeyDown={(e) => e.key === 'Enter' && password && confirmPassword && handleSubmit()}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={!password || !confirmPassword || isLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {isLoading ? 'Creating Account...' : 'Create Secure Account'}
                </Button>
              </TabsContent>
            </Tabs>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="text-xs text-gray-500 text-center">
              <p>Your password is securely hashed and stored locally.</p>
              <p>Never share your password with anyone.</p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
