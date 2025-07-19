import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, Profile } from '../config/supabase';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  synthesisCount: number;
  canCreateSynthesis: boolean;
  showMobileModal: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, mobileNumber: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  incrementSynthesisCount: () => Promise<void>;
  setShowMobileModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [synthesisCount, setSynthesisCount] = useState(0);
  const [showMobileModal, setShowMobileModal] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        // For non-authenticated users, get count from localStorage
        const localCount = parseInt(localStorage.getItem('synthesisCount') || '0');
        setSynthesisCount(localCount);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email || 'No user');
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        // User signed out or session expired
        setProfile(null);
        setShowMobileModal(false);
        // Reset to localStorage count for anonymous users
        const localCount = parseInt(localStorage.getItem('synthesisCount') || '0');
        setSynthesisCount(localCount);
        
        if (event === 'SIGNED_OUT') {
          console.log('User signed out, state cleared');
        }
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create one
        const newProfile = {
          id: userId,
          email: user?.email || '',
          mobile_number: user?.user_metadata?.mobile_number || '',
          synthesis_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
          toast.error('Error creating profile');
        } else {
          setProfile(createdProfile);
          setSynthesisCount(createdProfile.synthesis_count);
          toast.success('Profile created successfully!');
          
          // Update auth user phone field if mobile number exists
          await updateAuthUserPhone(createdProfile.mobile_number);
        }
      } else if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
        setSynthesisCount(data.synthesis_count);
        
        // Update auth user phone field if not already set
        if (data.mobile_number && !user?.phone) {
          await updateAuthUserPhone(data.mobile_number);
        }
        
        // Check if this is a Google sign-in user without mobile number
        if (!data.mobile_number && user?.app_metadata?.provider === 'google') {
          setShowMobileModal(true);
        }
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    }
  };

  const updateAuthUserPhone = async (mobileNumber: string) => {
    if (!mobileNumber || !user) return;
    
    try {
      // Convert to international format for Supabase
      const internationalMobile = mobileNumber.startsWith('0') 
        ? `+94${mobileNumber.substring(1)}` 
        : `+94${mobileNumber}`;
      
      console.log('Updating auth user phone field:', mobileNumber, '-> international:', internationalMobile);
      
      const { data: updateData, error: updateError } = await supabase.auth.updateUser({
        phone: internationalMobile,
        data: {
          mobile_number: mobileNumber,
        }
      });
      
      if (updateError) {
        console.error('Error updating auth user phone:', updateError);
      } else {
        console.log('Successfully updated auth user phone:', updateData);
      }
    } catch (error) {
      console.error('Error in updateAuthUserPhone:', error);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error('Error signing in with email:', error);
      toast.error(error.message);
      throw error;
    } else {
      toast.success('Successfully signed in!');
    }
  };

  const signUpWithEmail = async (email: string, password: string, mobileNumber: string) => {
    // Validate mobile number (10 digits)
    const mobileRegex = /^[0-9]{10}$/;
    const cleanMobile = mobileNumber.replace(/\D/g, '');
    console.log('signUpWithEmail called with:', { email, mobileNumber, cleanMobile });
    
    if (!mobileRegex.test(cleanMobile)) {
      const error = new Error('Mobile number must be exactly 10 digits');
      toast.error('Mobile number must be exactly 10 digits');
      throw error;
    }

    // Convert to international format for Supabase (assuming Sri Lankan numbers starting with 0)
    const internationalMobile = cleanMobile.startsWith('0') 
      ? `+94${cleanMobile.substring(1)}` 
      : `+94${cleanMobile}`;

    console.log('Attempting to sign up user with mobile:', cleanMobile, 'International format:', internationalMobile);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          mobile_number: cleanMobile,
          phone: internationalMobile,
        },
      },
    });
    
    if (error) {
      console.error('Error signing up with email:', error);
      toast.error(error.message);
      throw error;
    }
    
    if (data.user) {
      console.log('User created:', data.user);
      toast.success('Registration successful! Please check your email for verification.');
      
      // We'll update the phone field after the user is confirmed and signed in
      // The onAuthStateChange listener will handle this in fetchProfile
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}`,
      },
    });
    if (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('SignOut function called');
      
      // First clear the state to immediately update the UI
      setUser(null);
      setProfile(null);
      setSession(null);
      setShowMobileModal(false);
      
      // Reset synthesis count to 0 for anonymous users
      setSynthesisCount(0);
      localStorage.removeItem('synthesisCount');
      
      // Clear any other auth-related items from localStorage
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('supabase') || key.includes('auth'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Also clear sessionStorage
      sessionStorage.clear();
      
      // Then call Supabase signOut
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out from Supabase:', error);
        // Even if Supabase signOut fails, we've already cleared local state
        // This ensures the UI updates properly
        toast.error('Warning: There was an issue with the sign out process, but you have been logged out locally.');
      } else {
        console.log('Supabase signOut successful');
        toast.success('Successfully signed out!');
      }
      
      console.log('State cleared successfully');
    } catch (error) {
      console.error('Error during sign out:', error);
      // Ensure we still clear local state even if there's an error
      setUser(null);
      setProfile(null);
      setSession(null);
      setShowMobileModal(false);
      setSynthesisCount(0);
      localStorage.removeItem('synthesisCount');
      sessionStorage.clear();
      toast.error('You have been signed out, but there was an error with the sign out process.');
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;
    
    console.log('updateProfile called with:', updates);
    console.log('Current user:', user);

    // Validate mobile number if it's being updated
    if (updates.mobile_number) {
    //   const mobileRegex = /^[0-9]{10}$/;
      const cleanMobile = updates.mobile_number.replace(/\D/g, '');
      console.log('Original mobile:', updates.mobile_number, 'Clean mobile:', cleanMobile);
      
    //   if (!mobileRegex.test(cleanMobile)) {
    //     const error = new Error('Mobile number must be exactly 10 digits');
    //     toast.error('Mobile number must be exactly 10 digits');
    //     throw error;
    //   }
      updates.mobile_number = cleanMobile;
      
      // Update the user's phone field in auth.users table
      try {
        // Convert to international format for Supabase
        const internationalMobile = cleanMobile.startsWith('0') 
          ? `+94${cleanMobile.substring(1)}` 
          : `+94${cleanMobile}`;
          
        console.log('Updating auth user with phone:', cleanMobile, '-> international:', internationalMobile);
        const { data: authData, error: authUpdateError } = await supabase.auth.updateUser({
          phone: internationalMobile,
          data: {
            mobile_number: cleanMobile,
          }
        });
        
        if (authUpdateError) {
          console.error('Error updating user phone in auth:', authUpdateError);
          toast.error('Failed to update mobile number in auth');
          throw authUpdateError;
        } else {
          console.log('Successfully updated auth user:', authData);
          toast.success('Mobile number saved to user account!');
        }
      } catch (authError) {
        console.error('Error updating auth user phone:', authError);
        toast.error('Failed to update mobile number');
        throw authError;
      }
    }

    const { error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile');
      throw error;
    } else {
      toast.success('Profile updated successfully!');
    }

    // Refresh profile data
    await fetchProfile(user.id);
  };

  const incrementSynthesisCount = async () => {
    if (user && profile) {
      // For authenticated users - unlimited synthesis
      const newCount = profile.synthesis_count + 1;
      await updateProfile({ synthesis_count: newCount });
      setSynthesisCount(newCount);
    } else {
      // For anonymous users - limit to 5 synthesis
      if (synthesisCount >= 5) {
        toast.error('You have reached the maximum of 5 free syntheses. Please sign up to continue.');
        return;
      }
      
      const newCount = synthesisCount + 1;
      setSynthesisCount(newCount);
      localStorage.setItem('synthesisCount', newCount.toString());
      
      if (newCount >= 5) {
        toast.error('You have used all 5 free syntheses. Sign up to get unlimited access!', {
          duration: 4000,
        });
      }
    }
  };

  const canCreateSynthesis = user ? true : synthesisCount < 5;

  const value = {
    user,
    profile,
    session,
    loading,
    synthesisCount,
    canCreateSynthesis,
    showMobileModal,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
    updateProfile,
    incrementSynthesisCount,
    setShowMobileModal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
