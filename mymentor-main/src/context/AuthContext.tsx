import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../supabaseClient';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';

// 1. Define our new User type, which includes the role
interface AppUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | null;
}

// 2. Define the context's value
interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // 1. Check for an active session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await fetchProfile(session.user);
      }
      setLoading(false);
    };

    getSession();

    // 2. Listen for auth changes (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await fetchProfile(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Helper function to get role from 'profiles' table
  const fetchProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role, name, email')
        .eq('id', supabaseUser.id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setUser({
          id: supabaseUser.id,
          email: data.email || supabaseUser.email || '',
          name: data.name || supabaseUser.user_metadata?.full_name || 'No Name',
          role: data.role,
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  // 3. Auth functions
  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin, // Redirect back to your app
      },
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const value = { user, loading, loginWithGoogle, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
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