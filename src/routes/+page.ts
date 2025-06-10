import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
  const longTailOfPi = await fetch('/pi-long-tail.txt')
    .then((res) => res.text())
    .then((text) => text.split(''));

  return { longTailOfPi };
}