'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';
import { Loader2, Phone, Shield, Eye, EyeOff } from 'lucide-react';
import {
  NativeSelect,
  NativeSelectContent,
  NativeSelectItem,
  NativeSelectTrigger,
  NativeSelectValue,
} from '@/components/ui/native-select';
import { COUNTRY_CODES } from '@/lib/constants';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const [currentTab, setCurrentTab] = useState('mobile-login');
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [selectedCountry, setSelectedCountry] = useState('IN');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [loginMobileFormat, setLoginMobileFormat] = useState('');

  const { login, loginWithEmail, register, sendOTP, sendOTPNewUser, registerNewUser, registerUserDirect, sendResetOTP, resetPassword, loading } = useAuthStore();

  const dialCode = COUNTRY_CODES.find(c => c.code === selectedCountry)?.dial_code || '+91';

  const resetForm = () => {
    setStep('mobile');
    setSelectedCountry('IN');
    setMobile('');
    setOtp('');
    setName('');
    setEmail('');
    setPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setForgotPassword(false);
    setLoginMobileFormat('');
  };

  const validatePassword = (pass: string) => {
    if (pass.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (!specialCharRegex.test(pass)) {
      return 'Password must contain at least one special character';
    }
    return null;
  };

  const handleRegister = async () => {
    if (!name || !email || !password || !mobile || mobile.length < 10) {
      toast.error('Please fill all fields correctly');
      return;
    }
    if (!email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    const passwordError = validatePassword(password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    try {
      const cleanDialCode = dialCode.replace('+', '');
      const success = await registerUserDirect(name, email, `${cleanDialCode}${mobile}`, password);

      if (success) {
        toast.success('Account created successfully! Welcome to Wencuts.');
        onOpenChange(false);
        resetForm();
      } else {
        const errorMessage = useAuthStore.getState().error;
        toast.error(errorMessage || 'Registration failed');
      }
    } catch (error) {
      toast.error('Registration failed');
    }
  };

  const handleSendOTP = async () => {
    if (forgotPassword) {
      if (!email || !email.includes('@')) {
        toast.error('Please enter a valid email address');
        return;
      }
    } else if (!mobile || mobile.length < 10) {
      toast.error('Please enter a valid mobile number');
      return;
    }

    try {
      let success = false;

      if (forgotPassword) {
        success = await sendResetOTP({ email });
      } else if (currentTab === 'mobile-login') {
        const mobileWithCode = `91${mobile}`;
        success = await sendOTP(mobileWithCode);

        if (success) {
          setLoginMobileFormat(mobileWithCode);
        } else {
          const errorMsg = useAuthStore.getState().error;
          console.log('Retrying with legacy format...', errorMsg);

          success = await sendOTP(mobile);
          if (success) {
            setLoginMobileFormat(mobile);
            useAuthStore.setState({ error: null });
          }
        }
      }

      if (success) {
        setStep('otp');
        toast.success('OTP sent successfully!');
      } else {
        const errorMessage = useAuthStore.getState().error;
        toast.error(errorMessage || 'Failed to send OTP');
      }
    } catch (error) {
      toast.error('Failed to send OTP');
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      let success = false;

      if (forgotPassword) {
        if (newPassword !== confirmPassword) {
          toast.error('Passwords do not match');
          return;
        }
        const passwordError = validatePassword(newPassword);
        if (passwordError) {
          toast.error(passwordError);
          return;
        }
        success = await resetPassword({ email, otp, password: newPassword });
      } else if (currentTab === 'mobile-login') {
        // Use the format that successfully sent the OTP
        success = await login(loginMobileFormat, otp);
      } else {
        if (!name || !email) {
          toast.error('Please fill all fields');
          return;
        }
      }

      if (success) {
        toast.success(forgotPassword ? 'Password reset successful' : 'Authentication successful');
        onOpenChange(false);
        resetForm();
      } else {
        const errorMessage = useAuthStore.getState().error;
        toast.error(errorMessage || 'Authentication failed');
      }
    } catch (error) {
      toast.error('Authentication failed');
    }
  };

  const handleEmailLogin = async () => {
    if (!email || !password) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      const success = await loginWithEmail(email, password);
      if (success) {
        toast.success('Login successful');
        onOpenChange(false);
        resetForm();
      } else {
        const errorMessage = useAuthStore.getState().error;
        toast.error(errorMessage || 'Login failed');
      }
    } catch (error) {
      toast.error('Login failed');
    }
  };

  const handleDialogChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-md">
        {forgotPassword ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Reset Password
              </DialogTitle>
              <DialogDescription>
                {step === 'mobile'
                  ? 'Enter your email address to reset your password'
                  : 'Enter the OTP sent to your email and your new password'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {step === 'mobile' ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email Address</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setForgotPassword(false)}
                      className="flex-1"
                    >
                      Back to Login
                    </Button>
                    <Button
                      onClick={handleSendOTP}
                      disabled={loading}
                      className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Send OTP
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="reset-otp">Enter OTP</Label>
                    <Input
                      id="reset-otp"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setStep('mobile')}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleVerifyOTP}
                      disabled={loading}
                      className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Update Password
                    </Button>
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                Welcome to Wencuts
              </DialogTitle>
              <DialogDescription>
                Sign in or create an account to access courses
              </DialogDescription>
            </DialogHeader>

            <Tabs value={currentTab} onValueChange={(val) => {
              setCurrentTab(val);
              setStep('mobile');
            }} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="mobile-login">Mobile Login</TabsTrigger>
                <TabsTrigger value="email-login">Email Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="mobile-login" className="space-y-4 pt-4">
                {step === 'mobile' ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="login-mobile">Mobile Number</Label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 border border-r-0 border-border bg-muted rounded-l-md text-sm">
                          +91
                        </span>
                        <Input
                          id="login-mobile"
                          placeholder="Enter mobile number"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          className="rounded-l-none"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={handleSendOTP}
                      disabled={loading}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Send OTP
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="login-otp">Enter OTP</Label>
                      <Input
                        id="login-otp"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                      />
                      <p className="text-xs text-muted-foreground">
                        OTP sent to +91{mobile}.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setStep('mobile')}
                        className="flex-1"
                      >
                        Change Number
                      </Button>
                      <Button
                        onClick={handleVerifyOTP}
                        disabled={loading}
                        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Verify OTP
                      </Button>
                    </div>
                  </>
                )}
              </TabsContent>

              <TabsContent value="email-login" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button
                  onClick={handleEmailLogin}
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Login
                </Button>
                <Button
                  variant="link"
                  onClick={() => setForgotPassword(true)}
                  className="w-full text-primary hover:text-primary/80"
                >
                  Forgot Password?
                </Button>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">Full Name</Label>
                  <Input
                    id="register-name"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-mobile">Mobile Number</Label>
                  <div className="flex">
                    <NativeSelect value={selectedCountry} onValueChange={setSelectedCountry}>
                      <NativeSelectTrigger className="w-[100px] rounded-r-none border-r-0 focus:ring-0 bg-muted">
                        <NativeSelectValue placeholder="Code" />
                      </NativeSelectTrigger>
                      <NativeSelectContent>
                        {COUNTRY_CODES.map((country) => (
                          <NativeSelectItem key={country.code} value={country.code}>
                            <span className="flex items-center gap-2">
                              <span>{country.code}</span>
                              <span className="">{country.dial_code}</span>
                            </span>
                          </NativeSelectItem>
                        ))}
                      </NativeSelectContent>
                    </NativeSelect>
                    <Input
                      id="register-mobile"
                      placeholder="Enter mobile number"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="rounded-l-none"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleRegister}
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Create Account
                </Button>
              </TabsContent>
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog >
  );
}