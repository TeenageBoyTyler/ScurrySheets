import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Define the possible panel types
export type PanelType = 'upload' | 'documents' | 'profile';

// Initialize from localStorage or default to 'documents'
const storedPanel = browser ? localStorage.getItem('activePanel') : null;
const initialPanel = (storedPanel as PanelType) || 'documents';

// Create the store
export const activePanel = writable<PanelType>(initialPanel);

// Subscribe to changes to update localStorage
if (browser) {
  activePanel.subscribe((value) => {
    localStorage.setItem('activePanel', value);
  });
}