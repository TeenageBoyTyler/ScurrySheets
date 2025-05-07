<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { supabase } from '$lib/supabase';

  let error = '';
  let loading = true;

  onMount(async () => {
    // Process the OAuth callback
    const { data, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('Auth error:', authError);
      error = 'Authentication failed. Please try again.';
      loading = false;
      return;
    }

    if (!data.session) {
      error = 'No session found. Please try logging in again.';
      loading = false;
      return;
    }

    // Successfully authenticated
    // Check if the user has a Vision API key
    const { data: profile, error: profileError } = await supabase
      .from('user_settings')
      .select('vision_api_key')
      .eq('user_id', data.session.user.id)
      .single();

    if (profileError) {
      console.error('Profile error:', profileError);
      // Continue to home page anyway, we'll handle this there
      goto('/');
      return;
    }

    // If no Vision API key is set, redirect to the setup page
    if (!profile?.vision_api_key) {
      goto('/profile/setup-api');
    } else {
      // Otherwise, go to the main page
      goto('/');
    }
  });
</script>

<div class="flex h-screen w-screen items-center justify-center bg-background">
  {#if loading}
    <div class="text-center">
      <div class="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      <p class="text-secondary">Completing authentication...</p>
    </div>
  {:else if error}
    <div class="text-center">
      <div class="mb-4 text-6xl text-error">⚠️</div>
      <h2 class="mb-4 text-2xl font-bold">Authentication Error</h2>
      <p class="mb-6 text-secondary">{error}</p>
      <button 
        class="rounded-full bg-primary px-6 py-2 text-white transition-transform hover:scale-105"
        on:click={() => goto('/')}
      >
        Return Home
      </button>
    </div>
  {/if}
</div>