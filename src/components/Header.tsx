import React from 'react';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b-2 border-gray-200 px-6 py-6 classic-shadow">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 premium-gradient flex items-center justify-center">
            <span className="text-white font-bold text-lg font-serif">AI</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-serif">Strategy Explorer</h1>
            <p className="text-xs text-gray-600 uppercase tracking-widest font-medium">Enterprise Intelligence Platform</p>
          </div>
        </div>
        
        {user && (
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3 text-gray-700 bg-gray-50 px-4 py-2 classic-border">
              <User className="h-4 w-4" />
              <span className="text-sm font-semibold tracking-wide">{user.name}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 border border-gray-200"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium uppercase tracking-wide">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;