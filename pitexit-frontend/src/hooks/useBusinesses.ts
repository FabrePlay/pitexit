import { useState, useEffect } from 'react';
import { supabase, Business } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useBusinesses() {
  const { userProfile, updateProfile } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile) {
      fetchBusinesses();
    } else {
      setBusinesses([]);
      setLoading(false);
    }
  }, [userProfile]);

  const fetchBusinesses = async () => {
    if (!userProfile) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', userProfile.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching businesses:', error);
      } else {
        setBusinesses(data || []);
      }
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const createBusiness = async (businessData: Omit<Business, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!userProfile) return { data: null, error: new Error('No user profile found') };

    try {
      const { data, error } = await supabase
        .from('businesses')
        .insert([{
          ...businessData,
          user_id: userProfile.id,
        }])
        .select()
        .single();

      if (error) throw error;
      
      setBusinesses(prev => [data, ...prev]);
      
      // Update user profile to include the new business name
      const currentBusinessNames = Array.isArray(userProfile.businesses) ? userProfile.businesses : [];
      const updatedBusinessNames = [...currentBusinessNames, data.name];
      
      await updateProfile({
        businesses: updatedBusinessNames
      });
      
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const updateBusiness = async (businessId: string, updates: Partial<Business>) => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .update(updates)
        .eq('id', businessId)
        .select()
        .single();

      if (error) throw error;
      
      setBusinesses(prev => prev.map(b => b.id === businessId ? data : b));
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const deleteBusiness = async (businessId: string) => {
    try {
      const { error } = await supabase
        .from('businesses')
        .delete()
        .eq('id', businessId);

      if (error) throw error;
      
      setBusinesses(prev => prev.filter(b => b.id !== businessId));
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  return {
    businesses,
    loading,
    createBusiness,
    updateBusiness,
    deleteBusiness,
    refetch: fetchBusinesses,
  };
}