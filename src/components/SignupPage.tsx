import React, { useState } from 'react';
import { Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '../context/AuthContext';

const supabase = createClient(
  'https://kabdokfowpwrdgywjtfv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthYmRva2Zvd3B3cmRneXdqdGZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMzM3NTUsImV4cCI6MjA3MTgwOTc1NX0.8Nt4Lc1TvnotyTXKUHAhq3W14Imx-QfbMpIw1f15pG4'
);

interface SignupPageProps {
  onShowLogin: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onShowLogin }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      // Generate UUIDs for id and user_id
      const uuid = () => crypto.randomUUID();
      const newProfile = {
        id: uuid(),
        user_id: uuid(),
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        // You should hash the password in production!
        password: formData.password,
        is_admin: false,
      };
      const { data, error: insertError } = await supabase
        .from('profiles')
        .insert([newProfile])
        .select();

      if (insertError) throw insertError;
      onShowLogin(); // Go back to login page after signup
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 premium-gradient flex items-center justify-center classic-shadow">
            <span className="text-white font-bold text-2xl font-serif">AI</span>
          </div>
        </div>
        <h2 className="mt-8 text-center text-4xl font-bold text-gray-900 font-serif">
          Create your account
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

            <div className="flex space-x-4">
              <div className="w-1/2">
                <label htmlFor="first_name" className="block text-sm font-bold text-gray-800 uppercase tracking-wide mb-2">
                  First Name
                </label>
                <div className="mt-1 relative">
                  <User className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    required
                    value={formData.first_name}
                    onChange={handleChange}
                    className="pl-12 classic-input block w-full placeholder-gray-400 focus:outline-none"
                    placeholder="First name"
                  />
                </div>
              </div>
              <div className="w-1/2">
                <label htmlFor="last_name" className="block text-sm font-bold text-gray-800 uppercase tracking-wide mb-2">
                  Last Name
                </label>
                <div className="mt-1 relative">
                  <User className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    required
                    value={formData.last_name}
                    onChange={handleChange}
                    className="pl-12 classic-input block w-full placeholder-gray-400 focus:outline-none"
                    placeholder="Last name"
                  />
                </div>
              </div>
            </div>

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
                  value={formData.email}
                  onChange={handleChange}
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
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-12 classic-input block w-full placeholder-gray-400 focus:outline-none"
                  placeholder="Create a password"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-800 uppercase tracking-wide mb-2">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <CheckCircle className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-12 classic-input block w-full placeholder-gray-400 focus:outline-none"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full classic-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="mt-4 text-center">
              <span className="text-sm text-gray-600 font-medium">Already have an account? </span>
              <button
                onClick={onShowLogin}
                className="text-sm font-bold text-blue-900 hover:text-blue-700 transition-colors uppercase tracking-wide"
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;