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

export const isPoemRevealed = writable(false);

export const currentPoemId = writable(undefined);
export const isPoemSelected = derived(currentPoemId, ($currentPoemId) => {
    return $currentPoemId !== undefined;
});

export const poemsRead = writable([]);
export const lastPoemReadId = derived(poemsRead, ($poemsRead) => {
    let id = undefined;
    if ($poemsRead.length > 0) id = $poemsRead[0].id;
    return id;
});