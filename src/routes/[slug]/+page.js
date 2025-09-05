// @ts-nocheck
import { poemIndex } from '$lib/store.js';

export async function load({ fetch, params }) {
  const slug = params.slug;

	return { slug };
}