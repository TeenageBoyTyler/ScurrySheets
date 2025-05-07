import { createClient } from '@supabase/supabase-js';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';
import { writable, type Writable } from 'svelte/store';

// Environment variables
// In production, these would be set in the environment
// For development, we'll use placeholders that will be replaced in .env files
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://localhost:54321';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'x-application-name': 'scurrysheets',
    },
  },
});

// Types for user session and profile
export type UserSession = {
  user: {
    id: string;
    email?: string | undefined;
    user_metadata: {
      full_name?: string;
      avatar_url?: string;
      name?: string;
      picture?: string;
    };
  } | null;
  session: any;
};

export type UserProfile = {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  vision_api_key?: string;
  vision_api_usage?: number;
  vision_api_limit?: number;
  created_at: string;
  updated_at: string;
};

// Create stores for user session and profile
export const userSession: Writable<UserSession | null> = writable(null);
export const userProfile: Writable<UserProfile | null> = writable(null);

// Initialize auth state
export const initAuth = async () => {
  // Only run in browser
  if (!browser) return;

  // Set up auth state listener
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
      if (session) {
        userSession.set({
          user: session.user,
          session,
        });
        
        // Fetch user profile when signed in
        fetchUserProfile(session.user.id);
      }
    } else if (event === 'SIGNED_OUT') {
      userSession.set(null);
      userProfile.set(null);
      
      // Redirect to home page on sign out
      goto('/');
    }
  });

  // Initialize with current session
  const { data } = await supabase.auth.getSession();
  if (data.session) {
    userSession.set({
      user: data.session.user,
      session: data.session,
    });
    
    // Fetch user profile on init
    fetchUserProfile(data.session.user.id);
  }
};

// Fetch user profile from the database
export const fetchUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      
      // If no profile exists, create one
      if (error.code === 'PGRST116') {
        createUserProfile(userId);
      }
      return;
    }

    if (data) {
      // Transform to match UserProfile structure
      const profile: UserProfile = {
        id: userId,
        email: data.email || '',
        full_name: data.full_name || '',
        avatar_url: data.avatar_url || '',
        vision_api_key: data.vision_api_key,
        vision_api_usage: data.api_usage_count,
        vision_api_limit: 1000, // Free tier limit
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString(),
      };
      
      userProfile.set(profile);
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
  }
};

// Create a new user profile
export const createUserProfile = async (userId: string) => {
  // Get user data from auth
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return;

  const user = userData.user;
  
  // Extract profile data from user metadata
  const email = user.email || '';
  const fullName = user.user_metadata.full_name || user.user_metadata.name || '';
  const avatarUrl = user.user_metadata.avatar_url || user.user_metadata.picture || '';
  
  // Insert into user_settings table
  const { error } = await supabase
    .from('user_settings')
    .insert([{
      user_id: userId,
      email: email,
      full_name: fullName,
      avatar_url: avatarUrl,
      api_usage_count: 0,
      api_usage_reset_date: new Date().toISOString().split('T')[0], // Today's date
      default_handwriting_removal: false
    }]);

  if (error) {
    console.error('Error creating user profile:', error);
    return;
  }

  // Fetch the newly created profile
  fetchUserProfile(userId);
};

// Update vision API key
export const updateVisionApiKey = async (apiKey: string) => {
  const session = await supabase.auth.getSession();
  const userId = session.data.session?.user.id;
  
  if (!userId) return { success: false, error: 'Not authenticated' };

  const { data, error } = await supabase
    .from('user_settings')
    .update({ 
      vision_api_key: apiKey,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating Vision API key:', error);
    return { success: false, error: error.message };
  }

  // Refresh the profile
  fetchUserProfile(userId);
  return { success: true };
};

// Google OAuth login
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      scopes: 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/monitoring.read',
    },
  });

  if (error) {
    console.error('Error signing in with Google:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
};

// Sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Error signing out:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
};

// Check if user has Vision API key
export const hasVisionApiKey = () => {
  let result = false;
  
  const unsubscribe = userProfile.subscribe(value => {
    if (value && value.vision_api_key) {
      result = true;
    }
  });
  unsubscribe();
  
  return result;
};

// Initialize auth on import
if (browser) {
  initAuth();
}