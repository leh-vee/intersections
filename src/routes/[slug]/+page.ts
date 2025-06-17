import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
  const slug = params.slug;
  const titleWords = slug.split('-');
  const poemTitle = titleWords.map(w => capitalize(w)).join(' ');

	const poem = await fetch(`/poems/${slug}.txt`)
    .then((res) => res.text())
    .then((text) => text.split('\n'));

	return { poemTitle, poem };
}

function capitalize(str: String) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}