import { supabase } from '$lib/supabase';
import { browser } from '$app/environment';

/**
 * Validates that the Supabase client is properly configured
 * This is useful for checking environment variables in development
 */
export async function validateSupabaseClient(): Promise<{ valid: boolean; message: string }> {
  if (!browser) {
    return { valid: false, message: 'Must run in browser environment' };
  }
  
  try {
    // Try to get settings from user_settings table to verify connection
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .limit(1);
      
    if (error) {
      if (error.code === 'PGRST116') {
        // This error means the table doesn't exist, which is fine for validation
        // It still proves we can connect to Supabase
        return { valid: true, message: 'Connected to Supabase but user_settings table not found' };
      }
      
      if (error.message.includes('Failed to fetch')) {
        return { 
          valid: false, 
          message: 'Could not connect to Supabase. Check your network connection and environment variables.' 
        };
      }
      
      return { valid: false, message: `Supabase error: ${error.message}` };
    }
    
    return { valid: true, message: 'Supabase client configured correctly' };
  } catch (error) {
    return { 
      valid: false, 
      message: `Unexpected error: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
}