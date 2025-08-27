import React, { useState } from 'react';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
      const success = await login(email, password);
      if (!success) {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-l-4 border-blue-900">
              <h4 className="text-sm font-bold text-blue-900 mb-3 uppercase tracking-wide">Demo Credentials:</h4>
              <div className="space-y-2 text-sm text-blue-800 font-medium">
                <div>Email: demo@company.com</div>
                <div>Password: demo123</div>
              </div>
            </div>
            
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