import React from 'react';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gradient-to-r from-[#1E3B5A] to-[#2C5A87] border-b-2 border-[#3076B4]/30 px-6 py-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="h-16">
            <img 
              src="/images/ai4profit-logo.svg" 
              alt="AI4PROFIT" 
              className="h-full" 
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Strategy Explorer</h1>
            <p className="text-xs text-blue-100 uppercase tracking-widest font-medium">Enterprise Intelligence Platform</p>
          </div>
        </div>
        
        {user && (
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3 text-white bg-[#3076B4]/30 px-4 py-2 border border-[#3076B4]/50 rounded">
              <User className="h-4 w-4" />
              <span className="text-sm font-semibold tracking-wide">{user.name}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 text-blue-100 hover:text-white hover:bg-[#3076B4]/30 transition-all duration-200 border border-[#3076B4]/50 rounded"
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