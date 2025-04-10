import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
  const slug = params.slug.toUpperCase();
  const poemTitle = `${slug[0]} + ${slug[1]}`;

	const poem = await fetch(`/poems/${poemTitle}.txt`)
    .then((res) => res.text())
    .then((text) => text.split('\n'));

	return { poemTitle, poem };
};