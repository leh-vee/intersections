import { poemIndex } from '$lib/store.js';

export async function load() {
  const keyedIndex = await poemIndex.get();
}