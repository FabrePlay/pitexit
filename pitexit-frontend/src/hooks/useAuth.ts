import { useState, useEffect } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase, User } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setUserProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (authUserId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_user_id', authUserId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        // Si no existe el perfil, crearlo
        if (error.code === 'PGRST116') {
          await createUserProfile(authUserId);
          return;
        }
      } else {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const createUserProfile = async (authUserId: string) => {
    try {
      const { data: authUser } = await supabase.auth.getUser();
      if (!authUser.user) return;

      const username = authUser.user.email?.split('@')[0] + Math.floor(Math.random() * 1000);
      
      const { data, error } = await supabase
        .from('users')
        .insert([{
          auth_user_id: authUserId,
          email: authUser.user.email || '',
          username: username,
          first_name: '',
          last_name: '',
          phone: '',
          country: 'Chile',
          city: '',
          industry: '',
          experience: 'Principiante',
          plan: 'Gratis'
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating user profile:', error);
      } else {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error creating user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUserProfile(null);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!userProfile) return { error: new Error('No user profile found') };

    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userProfile.id)
        .select()
        .single();

      if (error) throw error;
      setUserProfile(data);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  return {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };
}