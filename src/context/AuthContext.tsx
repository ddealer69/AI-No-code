import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://kabdokfowpwrdgywjtfv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthYmRva2Zvd3B3cmRneXdqdGZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMzM3NTUsImV4cCI6MjA3MTgwOTc1NX0.8Nt4Lc1TvnotyTXKUHAhq3W14Imx-QfbMpIw1f15pG4';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthYmRva2Zvd3B3cmRneXdqdGZ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjIzMzc1NSwiZXhwIjoyMDcxODA5NzU1fQ.aPol0IadRzWQnG-7u_8u7-HZ7lwNq9zK1y4DrjMF6g4';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const supabaseService = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Check Supabase for user
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, email, first_name, last_name, password, is_admin')
      .eq('email', email)
      .single();

    if (error || !profile) {
      return false;
    }
    // Simple password check (for demo, not secure)
    if (profile.password !== password) {
      return false;
    }
    setUser({ id: profile.id, email: profile.email, name: profile.first_name + ' ' + profile.last_name });
    setIsAdmin(profile.is_admin || false);
    return true;
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    // Split name into first and last
    const [first_name, ...rest] = name.split(' ');
    const last_name = rest.join(' ');
    // Use service key for insert
    const now = new Date().toISOString();
    const id = crypto.randomUUID();
    const user_id = crypto.randomUUID();
    const { error } = await supabaseService
      .from('profiles')
      .insert([
        {
          id,
          user_id,
          email,
          first_name,
          last_name,
          password,
          created_at: now,
          updated_at: now,
          is_admin: false
        }
      ]);
    if (error) {
      return false;
    }
    // Do not log in automatically after signup
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};