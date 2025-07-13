import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface AIRequest {
  prompt: string;
  businessId: string;
  businessName: string;
  businessDescription?: string;
  requestType?: 'hack_analysis' | 'work_plan' | 'content_reel_script' | 'table_comparison' | 'flow_diagram_textual';
}

interface AIResponse {
  success: boolean;
  data?: any;
  error?: string;
  type?: string;
}

export function useAIAgent() {
  const [loading, setLoading] = useState(false);

  const generateAIResponse = async (request: AIRequest): Promise<AIResponse> => {
    setLoading(true);
    
    try {
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('ai-agent', {
        body: request
      });

      if (error) {
        console.error('AI Agent Error:', error);
        return {
          success: false,
          error: error.message || 'Error calling AI agent'
        };
      }

      return data;
    } catch (error) {
      console.error('AI Agent Error:', error);
      return {
        success: false,
        error: 'Failed to connect to AI agent'
      };
    } finally {
      setLoading(false);
    }
  };

  const saveAIResult = async (businessId: string, userId: string, type: string, title: string, content: any) => {
    try {
      const { data, error } = await supabase
        .from('ai_results')
        .insert([{
          business_id: businessId,
          user_id: userId,
          type,
          title,
          content
        }])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const getAIResults = async (businessId: string) => {
    try {
      const { data, error } = await supabase
        .from('ai_results')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  return {
    loading,
    generateAIResponse,
    saveAIResult,
    getAIResults,
  };
}