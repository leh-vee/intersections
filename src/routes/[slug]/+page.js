// @ts-nocheck
import { poemIndex } from '$lib/store.js';

export async function load({ fetch, params }) {
  const slug = params.slug;

  const index = await poemIndex.get();
  const poemMetaData = index[slug];
  const { docId, title, sefirahId, longitude, latitude } = poemMetaData;
  const url = `https://docs.google.com/document/d/${docId}/export?format=txt`;
  
  const poem = await fetch(url)
  .then((res) => res.text())
  .then((text) => text.split('\n').filter(line => line.trim() !== ''));
  
  const coords = [longitude, latitude];

	return { poem, title, coords, sefirahId };
}