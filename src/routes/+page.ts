import type { PageLoad } from './$types';
import yaml from 'js-yaml';

export const load: PageLoad = async ({ fetch, params }) => {
  const longTailOfPi = await fetch('/pi-long-tail.txt') // 33653 intersections total
    .then((res) => res.text())
    .then((text) => text.split(''));

  const metaYml = await fetch('/poem-data.yml')
    .then((res) => res.text());
  const meta = yaml.load(metaYml) as PoemMetaData;
  
  const metaTailMap = new Array();
  const takenTailIndices: number[] = [];
  
  Object.keys(meta).forEach(slug => {
    const poemMetaData = meta[slug];
    const tailIndex = longTailOfPi.findIndex((d, i) => {
      const digit = Number(d);
      return poemMetaData.sefirahId === digit && !takenTailIndices.includes(i);
    });
    metaTailMap[tailIndex] = { slug, ...poemMetaData };
    takenTailIndices.push(tailIndex);
  })

  const shortTailLength = Math.max(metaTailMap.length, 100);
  const shortTailOfPi = longTailOfPi.slice(0, shortTailLength);

  return { metaTailMap, shortTailOfPi };
}

interface PoemMetaData {
  [key: string]: {
    title: string,
    sefirahId: number,
    intersectionId: number
  }
}