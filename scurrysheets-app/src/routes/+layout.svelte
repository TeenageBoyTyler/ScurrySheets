<script lang="ts">
  import '../app.css';
  import { activePanel, type PanelType } from '$lib/stores/navigation';
  import { fly, fade } from 'svelte/transition';
  import { onMount } from 'svelte';

  let { children } = $props();
  let isMobile = false;

  // Set the active panel
  function setActivePanel(panel: PanelType) {
    activePanel.set(panel);
  }

  // Check if device is mobile
  onMount(() => {
    // Initial check
    checkMobile();
    
    // Listen for resize events
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  });
  
  function checkMobile() {
    isMobile = window.innerWidth < 768; // Tailwind's md breakpoint
  }
</script>

<div class="h-screen w-screen overflow-hidden bg-[#121212] text-white">
  <!-- Desktop layout (horizontal panels) -->
  <div class="hidden h-full md:flex">
    <!-- Upload Panel -->
    <div 
      class="flex h-full transition-all duration-500 ease-in-out"
      class:w-[10%]={$activePanel !== 'upload'} 
      class:w-[80%]={$activePanel === 'upload'}
    >
      {#if $activePanel === 'upload'}
        <div 
          class="h-full w-full bg-[#191919] p-4 overflow-auto"
          transition:fade={{ duration: 200 }}
        >
          <h2 class="mb-4 text-2xl font-bold">Upload</h2>
          <!-- Upload panel content will go here in a separate component -->
          {#if $activePanel === 'upload'}
            <div class="upload-content">
              <!-- Upload content will be rendered by child routes -->
            </div>
          {/if}
        </div>
      {:else}
        <button 
          class="flex h-full w-full items-center justify-center bg-[#191919] transition-all hover:bg-[#202020]"
          on:click={() => setActivePanel('upload')}
        >
          <div class="vertical-text font-bold tracking-wider text-white/55">UPLOAD</div>
        </button>
      {/if}
    </div>

    <!-- Document/Search Panel -->
    <div 
      class="flex h-full transition-all duration-500 ease-in-out"
      class:w-[10%]={$activePanel !== 'documents'}
      class:w-[80%]={$activePanel === 'documents'}
    >
      {#if $activePanel === 'documents'}
        <div 
          class="h-full w-full bg-[#191919] p-4 overflow-auto"
          transition:fade={{ duration: 200 }}
        >
          <h2 class="mb-4 text-2xl font-bold">Documents</h2>
          <!-- Document panel content -->
          {@render children()}
        </div>
      {:else}
        <button 
          class="flex h-full w-full items-center justify-center bg-[#191919] transition-all hover:bg-[#202020]"
          on:click={() => setActivePanel('documents')}
        >
          <div class="vertical-text font-bold tracking-wider text-white/55">DOCUMENTS</div>
        </button>
      {/if}
    </div>

    <!-- Profile Panel -->
    <div 
      class="flex h-full transition-all duration-500 ease-in-out"
      class:w-[10%]={$activePanel !== 'profile'}
      class:w-[80%]={$activePanel === 'profile'}
    >
      {#if $activePanel === 'profile'}
        <div 
          class="h-full w-full bg-[#191919] p-4 overflow-auto"
          transition:fade={{ duration: 200 }}
        >
          <h2 class="mb-4 text-2xl font-bold">Profile</h2>
          <!-- Profile panel content will go here in a separate component -->
          {#if $activePanel === 'profile'}
            <div class="profile-content">
              <!-- Profile content will be rendered by child routes -->
            </div>
          {/if}
        </div>
      {:else}
        <button
          class="flex h-full w-full items-center justify-center bg-[#191919] transition-all hover:bg-[#202020]"
          on:click={() => setActivePanel('profile')}
        >
          <div class="vertical-text font-bold tracking-wider text-white/55">PROFILE</div>
        </button>
      {/if}
    </div>
  </div>

  <!-- Mobile layout (vertical panels) -->
  <div class="flex h-full w-full flex-col md:hidden">
    <!-- Upload Panel -->
    <div 
      class="flex w-full transition-all duration-500 ease-in-out"
      class:h-[10%]={$activePanel !== 'upload'}
      class:h-[80%]={$activePanel === 'upload'}
    >
      {#if $activePanel === 'upload'}
        <div 
          class="w-full h-full bg-[#191919] p-4 overflow-auto"
          transition:fade={{ duration: 200 }}
        >
          <h2 class="mb-4 text-xl font-bold">Upload</h2>
          <!-- Upload panel content -->
          {#if $activePanel === 'upload'}
            <div class="upload-content">
              <!-- Upload content will be rendered by child routes -->
            </div>
          {/if}
        </div>
      {:else}
        <button
          class="flex w-full h-full items-center justify-center bg-[#191919] transition-all hover:bg-[#202020]"
          on:click={() => setActivePanel('upload')}
        >
          <div class="horizontal-text font-bold tracking-wider text-white/55">UPLOAD</div>
        </button>
      {/if}
    </div>

    <!-- Document/Search Panel -->
    <div 
      class="flex w-full transition-all duration-500 ease-in-out"
      class:h-[10%]={$activePanel !== 'documents'}
      class:h-[80%]={$activePanel === 'documents'}
    >
      {#if $activePanel === 'documents'}
        <div 
          class="w-full h-full bg-[#191919] p-4 overflow-auto"
          transition:fade={{ duration: 200 }}
        >
          <h2 class="mb-4 text-xl font-bold">Documents</h2>
          <!-- Document panel content -->
          {@render children()}
        </div>
      {:else}
        <button
          class="flex w-full h-full items-center justify-center bg-[#191919] transition-all hover:bg-[#202020]" 
          on:click={() => setActivePanel('documents')}
        >
          <div class="horizontal-text font-bold tracking-wider text-white/55">DOCUMENTS</div>
        </button>
      {/if}
    </div>

    <!-- Profile Panel -->
    <div 
      class="flex w-full transition-all duration-500 ease-in-out"
      class:h-[10%]={$activePanel !== 'profile'}
      class:h-[80%]={$activePanel === 'profile'}
    >
      {#if $activePanel === 'profile'}
        <div 
          class="w-full h-full bg-[#191919] p-4 overflow-auto"
          transition:fade={{ duration: 200 }}
        >
          <h2 class="mb-4 text-xl font-bold">Profile</h2>
          <!-- Profile panel content -->
          {#if $activePanel === 'profile'}
            <div class="profile-content">
              <!-- Profile content will be rendered by child routes -->
            </div>
          {/if}
        </div>
      {:else}
        <button
          class="flex w-full h-full items-center justify-center bg-[#191919] transition-all hover:bg-[#202020]"
          on:click={() => setActivePanel('profile')}
        >
          <div class="horizontal-text font-bold tracking-wider text-white/55">PROFILE</div>
        </button>
      {/if}
    </div>
  </div>
</div>

<style>
  /* Vertical text for collapsed panels on desktop */
  .vertical-text {
    writing-mode: vertical-rl;
    text-orientation: mixed;
    transform: rotate(180deg);
    text-transform: uppercase;
    letter-spacing: 0.2em;
  }

  /* Horizontal text for collapsed panels on mobile */
  .horizontal-text {
    text-transform: uppercase;
    letter-spacing: 0.2em;
  }
</style>