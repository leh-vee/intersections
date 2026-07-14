import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

export const poemIndex = writable(null);
export const piTail = writable(null);
export const extraTailEnd = writable(null);
export const poemTailIndexMap = writable([]);

export const cursorState = writable(false); // false; mooning; typing
export const isCursorMooning = derived(cursorState, ($cursorState) => $cursorState === 'mooning');
export const isCursorTyping = derived(cursorState, ($cursorState) => $cursorState === 'typing');
export const isCursor = derived(cursorState, ($cursorState) => $cursorState != false);

export const isTheButtonDepressed = writable(true);
export const isPoemRevealed = writable(false);

export const currentPoemId = writable(undefined);
export const poemMetadata = writable({});
export const poemLines = writable([]);

export const isPoemSelected = derived(currentPoemId, ($currentPoemId) => {
  return $currentPoemId !== undefined;
});

export const poemsRead = localStorageWritable('poemsRead', []);
export const lastPoemReadId = derived(poemsRead, ($poemsRead) => {
  let id = undefined;
  if ($poemsRead.length > 0) id = $poemsRead[0].id;
  return id;
});

export const selectionWindow = (() => {
  const defaultValue = { n: 0, dateTime: null }
  const base = localStorageWritable('selectionWindow', defaultValue);

  function isExpired(dateTime) {
    if (!dateTime) return false;
    const threeHoursInMilliSecs = 3 * 60 * 60 * 1000;
    const timestamp = new Date(dateTime).getTime();
    return Date.now() - timestamp >= threeHoursInMilliSecs;
  }

  if (browser) {
    const unsubscribeHyrated = base.hydratedStore.subscribe(hydrated => {
      if (!hydrated) return;
      base.update(val => isExpired(val.dateTime) ? defaultValue : val);
    });
    unsubscribeHyrated();
  }


  return {
    subscribe: base.subscribe,
    hydrated: base.hydratedStore,
    increment: () => base.update((val) => {
      const n = val.n + 1;
      const dateTime = (n === 1) ? new Date : val.dateTime;
      return { n, dateTime }
    }),
    reset: () => base.set(defaultValue)
  };
})();

export const isEmForMatrix = derived(selectionWindow,
  ($selectionWindow) => $selectionWindow.n % 2 === 1
);


export function localStorageWritable(key, initialValue) {
  const hydratedStore = writable(false);
  const store = writable(initialValue, (set) => {
    if (!browser) return; // the following logic only runs in the browser

    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) set(JSON.parse(raw));
    } catch {
      // keep initialValue if parse fails
      console.warn('unable to parse localStorage value at key:', key);
    } finally {
      console.log('hydrating', key, 'Svelte store from localStorage');
      hydratedStore.set(true);
    }
  });

  if (browser) {
    store.subscribe((value) => {
      localStorage.setItem(key, JSON.stringify(value));
    });
  }

  return {
    subscribe: store.subscribe,
    set: store.set,
    update: store.update,
    hydratedStore: { subscribe: hydratedStore.subscribe }
  }
}