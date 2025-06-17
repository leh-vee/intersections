import type { PageLoad } from './$types';
import yaml from 'js-yaml';

export const load: PageLoad = async ({ fetch, params }) => {
  const slug = params.slug;

	const poem = await fetch(`/poems/${slug}.txt`)
    .then((res) => res.text())
    .then((text) => text.split('\n'));

  const metaYml = await fetch('/poem-data.yml')
    .then((res) => res.text());
  const meta = yaml.load(metaYml) as PoemMetaData;
  const title = meta[slug].title;

	return { poem, title };
}

interface PoemMetaData {
  [key: string]: {
    title: string,
    sefirahId: number,
    intersectionId: number
  }
}