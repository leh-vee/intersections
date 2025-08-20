// @ts-nocheck
import { writable } from 'svelte/store';
import { parse } from 'csv-parse/browser/esm/sync';
import slugify from 'slugify';

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
          
          try {
            const poemIndexSheetId = '1-BjOyI_0_cX46dbSZMrjVo0mF2sXDeFgmT8gScvOVLM';
            const url = `https://docs.google.com/spreadsheets/d/${poemIndexSheetId}/export?format=csv`;
            const response = await fetch(url);
            const poemIndexCsv = await response.text();

            const index = parse(poemIndexCsv, {
              columns: true,
              skip_empty_lines: true,
              trim: true
            });

            const keyedIndex = {};
            index.forEach(row => {
              const slug = slugify(row.title, { lower: true, remove: /[*+~.,()'"!:@]/g });
              keyedIndex[slug] = row;
            });

            set(keyedIndex);
            resolve(keyedIndex);
          } catch (error) {
            console.error('Failed to fetch data:', error);
            resolve(null);
          } finally {
            isLoading = false;
          }
        });
      });
    }
  };
}

export const poemIndex = createPoemIndexStore();