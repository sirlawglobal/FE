import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../contexts/authContext';
import { AlertCircle, CheckCircle, Mail } from 'lucide-react';
import { Logo } from '../components/ui/Logo';

export const VerifyOtpPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp, resendOtp, isLoading, error, clearError, registrationEmail } = useAuthStore();
  const searchParams = new URLSearchParams(location.search);
  const email = (location.state as { email?: string })?.email || searchParams.get('email') || registrationEmail || '';
  const [otp, setOtp] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(true);

  useEffect(() => {
    // Redirect if no email provided
    if (!email) {
      navigate('/auth/register');
    }
  }, [email, navigate]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !canResend) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timeLeft, canResend]);

  const handleBackspace = (index: number) => {
    if (otp[index] === '' && index > 0) {
      setOtp((prev) => {
        const arr = prev.split('');
        arr[index - 1] = '';
        return arr.join('');
      });
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    if (!/^[0-9]*$/.test(value)) return;

    const newOtp = otp.split('');
    newOtp[index] = value;
    const otpString = newOtp.join('');

    setOtp(otpString.slice(0, 6));
    setLocalError(null);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
      nextInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    setOtp(pastedData);
    setLocalError(null);

    // Focus reaching the last input or the next one
    const nextIndex = Math.min(pastedData.length, 5);
    const nextInput = document.getElementById(`otp-${nextIndex}`) as HTMLInputElement;
    nextInput?.focus();
  };

  useEffect(() => {
    // Auto-focus first input on mount
    const firstInput = document.getElementById('otp-0') as HTMLInputElement;
    firstInput?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (otp.length !== 6) {
      setLocalError('Please enter all 6 digits');
      return;
    }

    try {
      await verifyOtp(email, otp);
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'OTP verification failed';
      setLocalError(errorMsg);
    }
  };

  const handleResendOtp = async () => {
    clearError();
    try {
      await resendOtp(email);
      setCanResend(false);
      setTimeLeft(60);
      setOtp('');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to resend OTP';
      setLocalError(errorMsg);
    }
  };

  const displayError = localError || error;

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 transition-colors duration-300">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-light-green/10 rounded-[32px] mb-8 animate-bounce-subtle">
            <CheckCircle className="w-12 h-12 text-light-green" />
          </div>
          <h2 className="text-4xl font-display font-bold text-foreground mb-3 tracking-tight">Identity Verified</h2>
          <p className="text-foreground/40 font-medium text-lg">Your gateway to learning is now open...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 relative transition-colors duration-300">
      {/* Logo */}
      <div className="absolute top-8 left-8">
        <Logo size="lg" />
      </div>

      <div className="w-full max-w-md">
        <div className="card shadow-2xl p-8 border border-border">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-teal/10 text-primary-teal rounded-[24px] mb-6">
              <Mail className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-display font-bold text-foreground mb-2 tracking-tight">Verify Securely</h1>
            <p className="text-foreground/50 font-medium">Enter the 6-digit access code sent to</p>
            <p className="text-primary-teal font-black mt-1 break-all px-2">{email}</p>
          </div>

          {displayError && (
            <div className="mb-6 flex items-start gap-4 bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-500 font-medium text-sm leading-relaxed">{displayError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-between gap-2 px-1">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={otp[index] || ''}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onPaste={handlePaste}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace') {
                      handleBackspace(index);
                    }
                  }}
                  disabled={isLoading}
                  className="w-12 h-16 text-center text-3xl font-display font-black bg-background border-2 border-border rounded-2xl text-foreground focus:outline-none focus:ring-4 focus:ring-primary-teal/20 focus:border-primary-teal transition-all disabled:opacity-50"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="w-full btn-primary py-4 mt-4 text-lg font-bold"
            >
              {isLoading ? 'Verifying Identity...' : 'Confirm Secure Code'}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-border">
            <p className="text-foreground/40 text-center text-sm font-medium mb-6">
              {canResend ? "Code not arrived?" : `Resubmit in ${timeLeft}s`}
            </p>
            <button
              onClick={handleResendOtp}
              disabled={!canResend || isLoading}
              className="w-full py-4 text-primary-teal bg-primary-teal/5 hover:bg-primary-teal/10 rounded-2xl font-bold disabled:text-foreground/20 disabled:bg-transparent disabled:cursor-not-allowed transition-all"
            >
              Request New Pulse
            </button>
            <p className="text-foreground/50 text-center text-sm mt-8">
              <Link to="/auth/login" className="text-primary-teal hover:opacity-80 font-bold transition">
                Return to Sanctuary
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
