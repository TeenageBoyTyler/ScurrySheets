<script lang="ts">
  import { onMount } from 'svelte';
  import { activePanel } from '$lib/stores/navigation';
  import { userSession, signInWithGoogle } from '$lib/supabase';

  let documentCount = 0;
  let recentDocuments: any[] = [];
  let isAuthenticated = false;
  let loading = false;

  onMount(() => {
    // Set Documents as the default active panel
    activePanel.set('documents');

    // Check if user is authenticated
    userSession.subscribe(session => {
      isAuthenticated = !!session?.user;
    });

    // In a real implementation, we would fetch document data here
    // For now, we're just using placeholder data
    documentCount = 0;
    recentDocuments = [];
  });

  async function handleSignIn() {
    loading = true;
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      loading = false;
    }
  }
</script>

<div class="document-view">
  {#if !isAuthenticated}
    <div class="login-state flex flex-col items-center justify-center h-full text-center p-4">
      <div class="app-logo mb-8 text-6xl">
        <span class="text-7xl font-bold text-primary">S</span>
      </div>
      <h3 class="text-2xl font-bold mb-4">Welcome to ScurrySheets</h3>
      <p class="text-white/55 mb-8 max-w-md">
        Store, organize, and search your documents with handwriting removal capabilities.
      </p>
      
      <button 
        class="bg-[#5f00ed] text-white py-3 px-8 rounded-full hover:scale-105 transition-transform flex items-center space-x-2 mb-6 disabled:opacity-75"
        on:click={handleSignIn}
        disabled={loading}
      >
        {#if loading}
          <span class="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
          <span>Connecting...</span>
        {:else}
          <span>Connect with Google Drive</span>
        {/if}
      </button>
      
      <div class="text-sm text-white/40 max-w-md">
        <p>ScurrySheets uses Google Drive for storage and requires a Google Vision API key for OCR and handwriting removal.</p>
      </div>
    </div>
  {:else if documentCount === 0}
    <div class="empty-state flex flex-col items-center justify-center h-full text-center p-4">
      <div class="icon mb-4 text-6xl text-white/30">📄</div>
      <h3 class="text-xl font-bold mb-2">No Documents Yet</h3>
      <p class="text-white/55 mb-6">Upload your first document to get started</p>
      <button 
        class="bg-[#5f00ed] text-white py-2 px-6 rounded-full hover:scale-105 transition-transform"
        on:click={() => activePanel.set('upload')}
      >
        Upload Documents
      </button>
    </div>
  {:else}
    <div class="documents-grid">
      <!-- Document grid would go here -->
    </div>
  {/if}
</div>