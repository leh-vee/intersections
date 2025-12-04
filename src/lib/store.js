import { writable, derived } from 'svelte/store';

export const poemIndex = writable(null);
export const piTail = writable(null);
export const extraTailEnd = writable(null);
export const poemTailIndexMap = writable([]);

export const isEmForMatrix = writable(false);

export const cursorState = writable(false); // false; mooning; typing
export const isCursorMooning = derived(cursorState, ($cursorState) => $cursorState === 'mooning');
export const isCursorTyping = derived(cursorState, ($cursorState) => $cursorState === 'typing');
export const isCursor = derived(cursorState, ($cursorState) => $cursorState != false);

export const isTheButtonDepressed = writable(true);