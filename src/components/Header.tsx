import React, { useState } from 'react';
import { User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobile = () => setMobileOpen(o => !o);
  const handleLogout = () => {
    logout();
    setMobileOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-[#1E3B5A] to-[#2C5A87] border-b-2 border-[#3076B4]/30 px-4 sm:px-6 py-3 sm:py-4 shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          {/* Brand */}
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
            <div className="h-12 sm:h-16 flex-shrink-0">
              <img
                src="/images/IMG-20250912-WA0002.jpg"
                alt="AI4PROFIT"
                className="h-full w-auto object-contain"
              />
            </div>
            <div className="leading-tight truncate">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate">AI Strategy Builder</h1>
              {/* <p className="text-[10px] sm:text-xs text-blue-100 uppercase tracking-widest font-medium">Enterprise Intelligence Platform</p> */}
            </div>
          </div>

          {/* Desktop User Section */}
          {user && (
            <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
              <div className="flex items-center space-x-2 lg:space-x-3 text-white bg-[#3076B4]/30 px-3 lg:px-4 py-2 border border-[#3076B4]/50 rounded backdrop-blur-sm">
                <User className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm font-semibold tracking-wide max-w-[12ch] truncate">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-blue-100 hover:text-white hover:bg-[#3076B4]/30 transition-all duration-200 border border-[#3076B4]/50 rounded"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium uppercase tracking-wide">Logout</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          {user && (
            <button
              onClick={toggleMobile}
              className="md:hidden inline-flex items-center justify-center p-2 rounded border border-[#3076B4]/50 text-blue-100 hover:text-white hover:bg-[#3076B4]/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1E3B5A] focus:ring-white"
              aria-label="Toggle user menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          )}
        </div>

        {/* Mobile Panel */}
        {user && (
          <div
            className={`md:hidden mt-3 origin-top transition-all duration-200 ease-out ${
              mobileOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
            }`}
            aria-hidden={!mobileOpen}
          >
            <div className="flex flex-col space-y-3 bg-[#21476B]/70 backdrop-blur-sm rounded-lg p-4 border border-[#3076B4]/40">
              <div className="flex items-center space-x-3 text-white bg-[#3076B4]/30 px-3 py-2 border border-[#3076B4]/50 rounded">
                <User className="h-4 w-4" />
                <span className="text-sm font-semibold tracking-wide">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center space-x-2 px-4 py-2 text-blue-100 hover:text-white hover:bg-[#3076B4]/40 transition-all duration-200 border border-[#3076B4]/50 rounded"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium uppercase tracking-wide">Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;