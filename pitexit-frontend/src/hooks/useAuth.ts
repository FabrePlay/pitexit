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
      console.log('🔍 Attempting to query users table with auth_user_id:', authUserId);
      console.log('🔍 Supabase client status:', supabase ? 'initialized' : 'not initialized');
      
      // --- TEMPORAL: Usar fetch directo para probar la conectividad de red ---
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      const requestUrl = `${SUPABASE_URL}/rest/v1/users?select=*&auth_user_id=eq.${authUserId}`;
      console.log('🌐 Attempting raw fetch to:', requestUrl);
      
      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      console.log('🌐 Raw fetch response received:', response.status, response.statusText);
      const data = await response.json();
      console.log('🌐 Raw fetch data:', data);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, data: ${JSON.stringify(data)}`);
      }
      // --- FIN DEL BLOQUE TEMPORAL ---

      // const { data, error } = await supabase // Línea original, comentada por ahora
      //   .from('users')
      //   .select('*')
      //   .eq('auth_user_id', authUserId)
      //   .single();

      console.log('✅ Raw fetch query completed successfully');
      console.log('📊 Profile query completed:', { data, error: null });

      // Verificar si se encontró el perfil
      if (Array.isArray(data) && data.length > 0) {
        console.log('✅ Profile found successfully:', data);
        setUserProfile(data[0]); // Tomar el primer elemento del array
        setLoading(false);
      } else if (Array.isArray(data) && data.length === 0) {
        console.log('👤 Profile not found, creating new profile...');
        await createUserProfile(authUserId);
        return;
      } else {
        console.log('✅ Profile found successfully:', data);
        setUserProfile(data);
        setLoading(false);
      }
    } catch (error) {
      console.error('💥 Catch block - Error fetching user profile:', error);
      
      // Verificar si es un error de "no encontrado" o similar
      if (error.message?.includes('No rows') || 
          error.message?.includes('PGRST116') ||
          error.message?.includes('404')) {
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
          plan: 'Gratis',
          businesses: []
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
    console.log('🔧 useAuth.updateProfile called with:', updates);
    console.log('👤 Current userProfile in hook:', userProfile);
    console.log('🆔 UserProfile ID for update:', userProfile?.id);
    console.log('📧 UserProfile email for reference:', userProfile?.email);
    
    if (!userProfile) return { error: new Error('No user profile found') };

    try {
      console.log('📡 Calling Supabase update with:');
      console.log('  - Table: users');
      console.log('  - Updates object:', JSON.stringify(updates, null, 2));
      console.log('  - Where condition: id =', userProfile.id);
      
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userProfile.id)
        .select()
        .single();

      console.log('📥 Supabase response received:');
      console.log('  - Data:', data);
      console.log('  - Data content (detailed):', JSON.stringify(data, null, 2));
      console.log('  - Error:', error);
      console.log('  - Data type:', typeof data);
      console.log('  - Error type:', typeof error);
      
      if (error) throw error;
      
      console.log('🔄 About to set new userProfile state with:', data);
      console.log('🔄 Previous userProfile state was:', userProfile);
      setUserProfile(data);
      
      console.log('✅ setUserProfile called successfully');
      return { data, error: null };
    } catch (error) {
      console.error('💥 Error in updateProfile:');
      console.error('  - Error object:', error);
      console.error('  - Error message:', error.message);
      console.error('  - Error details:', error.details);
      console.error('  - Error hint:', error.hint);
      console.error('  - Error code:', error.code);
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