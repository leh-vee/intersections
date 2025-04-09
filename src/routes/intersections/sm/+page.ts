import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const poem = await fetch('/poems/sm.txt')
    .then((res) => res.text())
    .then((text) => text.split('\n'));

	return { poem };
};