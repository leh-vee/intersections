// @ts-nocheck
import { poemIndex } from '$lib/store.js';

export async function load({ fetch }) {
  const longTailOfPi = await fetch('/pi-long-tail.txt') 
    .then((res) => res.text())
    .then((text) => text.split(''));

  const keyedIndex = await poemIndex.get();
  
  const metaTailMap = new Array();
  const takenTailIndices = [];

  Object.keys(keyedIndex).forEach(slug => {
    const sefirahId = keyedIndex[slug].sefirahId;
    const tailIndex = longTailOfPi.findIndex((d, i) => {
      return sefirahId === d && !takenTailIndices.includes(i);
    });
    metaTailMap[tailIndex] = slug;
    takenTailIndices.push(tailIndex);
  })

  const shortTailLength = Math.max(metaTailMap.length, 100);
  const shortTailOfPi = longTailOfPi.slice(0, shortTailLength);

  return { metaTailMap, shortTailOfPi };
}