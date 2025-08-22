// @ts-nocheck
import { poemIndex } from '$lib/store.js';

export async function load() {
  const keyedIndex = await poemIndex.get();
  const poemCoords = {};

  Object.keys(keyedIndex).forEach(slug => {
    const poemMetaData = keyedIndex[slug];
    poemCoords[slug] = [poemMetaData.longitude, poemMetaData.latitude];
  });

  return { poemCoords }
}