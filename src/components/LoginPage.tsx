import React, { useState } from 'react';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://kabdokfowpwrdgywjtfv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthYmRva2Zvd3B3cmRneXdqdGZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMzM3NTUsImV4cCI6MjA3MTgwOTc1NX0.8Nt4Lc1TvnotyTXKUHAhq3W14Imx-QfbMpIw1f15pG4'
  
);

interface LoginPageProps {
  onShowSignup: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onShowSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Search for the email in profiles table and get password
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('email, password')
        .eq('email', email)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      if (!profile) {
        setError('No account found. Please create a new account.');
        setIsLoading(false);
        onShowSignup(); // Move to signup page
        return;
      }

      // Match password
      if (profile.password !== password) {
        setError('Invalid email or password');
        setIsLoading(false);
        return;
      }

      // If matched, continue to next page
      const success = await login(email, password);
      if (!success) {
        setError('Login failed.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img src="/images/IMG-20250912-WA0002.jpg" alt="AI4Profit Logo" className="w-48" />
        </div>
        <h2 className="mt-8 text-center text-4xl font-bold text-gray-900 font-serif">
          Sign in to Strategy Explorer
        </h2>
        <p className="mt-3 text-center text-sm text-gray-600 uppercase tracking-widest font-medium">
          Enterprise Intelligence Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-12 px-8 classic-shadow-lg classic-border sm:px-12">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="flex items-center space-x-3 text-red-700 bg-red-50 p-4 border-l-4 border-red-500">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-800 uppercase tracking-wide mb-2">
                Email address
              </label>
              <div className="mt-1 relative">
                <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 classic-input block w-full placeholder-gray-400 focus:outline-none"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-800 uppercase tracking-wide mb-2">
                Password
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 classic-input block w-full placeholder-gray-400 focus:outline-none"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full classic-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="mt-4 text-center">
              <span className="text-sm text-gray-600 font-medium">Don't have an account? </span>
              <button
                onClick={onShowSignup}
                className="text-sm font-bold text-blue-900 hover:text-blue-700 transition-colors uppercase tracking-wide"
              >
                Create account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;