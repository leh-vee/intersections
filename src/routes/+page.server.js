// @ts-nocheck
import { index } from '$lib/store.js';

export async function load() {
  const poemIndex = await index.get();
  console.log(poemIndex);
  return { poemIndex }
}