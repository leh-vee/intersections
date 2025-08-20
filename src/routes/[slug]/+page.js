// @ts-nocheck
import yaml from 'js-yaml';

export async function load({ fetch, params }) {
  const slug = params.slug;

	const poem = await fetch(`/poems/${slug}.txt`)
    .then((res) => res.text())
    .then((text) => text.split('\n'));

  const metaYml = await fetch('/poem-data.yml')
    .then((res) => res.text());
  const meta = yaml.load(metaYml);
  const title = meta[slug].title;
  const coords = [meta[slug].longitude, meta[slug].latitude];
  const sefirahId = meta[slug].sefirahId;

  // const documentId = '1N4wJLTSaV9JGjubpxJz6zgtFa6IEb0q476_7EqlE47U';
  // const url = `https://docs.google.com/document/d/${documentId}/export?format=txt`;

  // const poem = await fetch(url)
  //   .then((res) => res.text())
  //   .then((text) => text.split('\n').filter(line => line.trim() !== ''));

	// return { poem, title };

	return { poem, title, coords, sefirahId };
}