import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

interface EmployeeProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'manager' | 'supervisor' | 'safety_officer' | 'staff';
  factory_id?: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: EmployeeProfile | null;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  signOut: async () => {},
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // -------------------------------------------------------------
    // MOCK AUTHENTICATION FOR DEMO PURPOSES
    // -------------------------------------------------------------
    const isPlaceholder = import.meta.env.VITE_SUPABASE_URL?.includes('placeholder');
    if (isPlaceholder) {
      const mockUser = { id: 'mock-123', email: 'admin@hse.com' } as User;
      const mockProfile: EmployeeProfile = {
        id: 'mock-123',
        email: 'admin@hse.com',
        full_name: 'Nguyễn Văn Admin',
        role: 'admin'
      };
      
      setSession({ user: mockUser } as Session);
      setUser(mockUser);
      setProfile(mockProfile);
      setIsLoading(false);
      return;
    }
    // -------------------------------------------------------------

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user || null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (!error && data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
