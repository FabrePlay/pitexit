import { useState, useEffect } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase, User } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchingProfile, setFetchingProfile] = useState(false);

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
    // Evitar múltiples llamadas simultáneas
    if (fetchingProfile) {
      console.log('🚫 Profile fetch already in progress, skipping...');
      return;
    }
    
    setFetchingProfile(true);
    console.log('🔍 Fetching user profile for authUserId:', authUserId);
    
    try {
      console.log('📡 Starting Supabase query...');
      
      // Consulta simple sin timeout por ahora
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_user_id', authUserId)
        .single();

      console.log('📊 Profile query completed:', { data, error });

      if (error) {
        console.error('Error fetching user profile:', error);
        if (error.code === 'PGRST116') {
          console.log('👤 Profile not found, creating new profile...');
          await createUserProfile(authUserId);
          return;
        }
        throw error;
      } else {
        console.log('✅ Profile found successfully:', data);
        setUserProfile(data);
      }
    } catch (error) {
      console.error('💥 Catch block - Error fetching user profile:', error);
      // Solo crear perfil si es un error de "no encontrado"
      if (error.code === 'PGRST116' || error.message?.includes('No rows')) {
        console.log('🔄 Attempting to create profile due to not found error...');
        await createUserProfile(authUserId);
      } else {
        console.log('❌ Other error, setting loading to false without profile');
        setLoading(false);
      }
    } finally {
      console.log('🏁 fetchUserProfile finally block executed');
      setFetchingProfile(false);
    }
  };

  const createUserProfile = async (authUserId: string) => {
    console.log('🆕 Creating user profile for authUserId:', authUserId);
    try {
      const { data: authUser } = await supabase.auth.getUser();
      console.log('👤 Auth user data:', authUser);
      
      if (!authUser.user) return;

      const username = authUser.user.email?.split('@')[0] + Math.floor(Math.random() * 1000);
      console.log('📝 Creating profile with username:', username);
      
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

      console.log('💾 Profile creation result:', { data, error });

      if (error) {
        console.error('Error creating user profile:', error);
        setLoading(false);
      } else {
        console.log('✅ Profile created successfully:', data);
        setUserProfile(data);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error creating user profile:', error);
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