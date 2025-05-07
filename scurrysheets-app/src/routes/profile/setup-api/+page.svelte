<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { updateVisionApiKey, userSession } from '$lib/supabase';
  import { activePanel } from '$lib/stores/navigation';

  let apiKey = '';
  let loading = false;
  let error = '';
  let isAuthenticated = false;

  onMount(() => {
    // Set the active panel to profile
    activePanel.set('profile');

    // Check if user is authenticated
    userSession.subscribe(session => {
      isAuthenticated = !!session?.user;
      
      // If not authenticated, redirect to home
      if (!isAuthenticated) {
        goto('/');
      }
    });
  });

  async function handleSubmit() {
    if (!apiKey) {
      error = 'Please enter a Google Vision API key';
      return;
    }

    loading = true;
    error = '';

    try {
      // Update the Vision API key
      const result = await updateVisionApiKey(apiKey);
      
      if (result.success) {
        // Redirect to home on success
        goto('/');
      } else {
        error = result.error || 'Failed to save API key. Please try again.';
      }
    } catch (err) {
      console.error('Error saving API key:', err);
      error = 'An unexpected error occurred. Please try again.';
    } finally {
      loading = false;
    }
  }
</script>

<div class="api-setup mx-auto max-w-lg p-6">
  <h2 class="mb-6 text-2xl font-bold">Set Up Google Vision API</h2>
  
  <div class="mb-6 rounded-lg bg-surface/50 p-4 text-secondary">
    <p class="mb-2">
      ScurrySheets uses Google Cloud Vision API for document processing and handwriting removal.
    </p>
    <p>
      You need to provide your own API key to use these features. Your key is stored securely
      and all processing costs are managed through your Google Cloud account.
    </p>
  </div>
  
  <div class="setup-steps mb-8">
    <h3 class="mb-4 text-lg font-bold">How to get your API key:</h3>
    <ol class="ml-6 space-y-2 list-decimal">
      <li>Go to <a href="https://console.cloud.google.com/" target="_blank" class="text-primary underline">Google Cloud Console</a></li>
      <li>Create a new project or select an existing one</li>
      <li>Enable the "Cloud Vision API" for your project</li>
      <li>Go to "APIs & Services" > "Credentials"</li>
      <li>Click "Create credentials" > "API key"</li>
      <li>Copy your new API key and paste it below</li>
    </ol>
  </div>
  
  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <div class="form-group">
      <label for="api-key" class="mb-2 block text-sm font-medium text-secondary">Google Vision API Key</label>
      <input
        type="password"
        id="api-key"
        bind:value={apiKey}
        class="w-full rounded-md bg-surface p-3 text-white placeholder-white/30 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        placeholder="Enter your API key"
        autocomplete="off"
      />
    </div>
    
    {#if error}
      <div class="error-message rounded bg-error/10 p-3 text-error">
        {error}
      </div>
    {/if}
    
    <div class="form-actions mt-6 flex justify-end">
      <button
        type="submit"
        class="rounded-full bg-primary px-6 py-2 text-white transition-transform hover:scale-105 disabled:opacity-50"
        disabled={loading || !apiKey}
      >
        {loading ? 'Saving...' : 'Save API Key'}
      </button>
    </div>
  </form>
  
  <div class="mt-8 text-center text-sm text-white/40">
    <p>
      ScurrySheets uses the free tier of Google Cloud Vision API (1,000 units/month).
      You won't be charged unless you exceed the free limit.
    </p>
  </div>
</div>