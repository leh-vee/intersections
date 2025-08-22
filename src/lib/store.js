// @ts-nocheck
import { writable } from 'svelte/store';
import { fetchCsvIndex, parseCsvIndex } from './api/drive';

function createPoemIndexStore() {
  const { subscribe, set } = writable(null);
  let isLoading = false;

  return {
    subscribe,
    get() {
      return new Promise((resolve) => {
        const unsubscribe = subscribe(async (value) => {
          if (value !== null) {
            resolve(value);
            return;
          }

          // Prevent multiple simultaneous fetches
          if (isLoading) {
            // Wait for the current fetch to complete
            const waitForData = subscribe((newValue) => {
              if (newValue !== null) {
                waitForData();
                resolve(newValue);
              }
            });
            return;
          }

          isLoading = true;
          
          const indexCsv = await fetchCsvIndex();
          const keyedIndex = parseCsvIndex(indexCsv);
          set(keyedIndex);
          resolve(keyedIndex);
          isLoading = false;
        });
      });
    }
  };
}

export const poemIndex = createPoemIndexStore();
