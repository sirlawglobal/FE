import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../contexts/authContext';
import { AlertCircle, UserPlus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Logo } from '../components/ui/Logo';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT' as 'STUDENT' | 'INSTRUCTOR',
  });
  const [localError, setLocalError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setLocalError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      setLocalError('All fields are required');
      return;
    }

    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    try {
      await register(formData.firstName, formData.lastName, formData.email, formData.password, formData.role);
      toast.success('Account created successfully! Please verify your email.');
      // Navigate to OTP verification page
      navigate('/auth/verify-otp', { state: { email: formData.email } });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Registration failed';
      setLocalError(errorMsg);
    }
  };

  const displayError = localError || error;

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
              <UserPlus className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-display font-bold text-foreground mb-2 tracking-tight">Create Account</h1>
            <p className="text-foreground/50 font-medium">Join the TalentFlow ecosystem today</p>
          </div>

          {displayError && (
            <div className="mb-6 flex items-start gap-4 bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-500 font-medium text-sm leading-relaxed">{displayError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-bold text-foreground/70 mb-2 uppercase tracking-widest px-1">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className="input"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-bold text-foreground/70 mb-2 uppercase tracking-widest px-1">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="input"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-foreground/70 mb-2 uppercase tracking-widest px-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="input"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-foreground/70 mb-2 uppercase tracking-widest px-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className="input"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-bold text-foreground/70 mb-2 uppercase tracking-widest px-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="input"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-bold text-foreground/70 mb-2 uppercase tracking-widest px-1">
                I am a
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input"
              >
                <option value="STUDENT">Learning Student</option>
                <option value="INSTRUCTOR">Expert Instructor</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-4 mt-6 text-lg font-bold"
            >
              {isLoading ? 'Processing...' : 'Create My Account'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-foreground/50 text-center text-sm font-medium">
              Existing member?{' '}
              <Link to="/auth/login" className="text-primary-teal hover:opacity-80 font-bold transition">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
