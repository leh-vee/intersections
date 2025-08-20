import type { PageLoad } from './$types';
import { parse } from 'csv-parse/browser/esm/sync';
import slugify from 'slugify';    
import yaml from 'js-yaml';

export const load: PageLoad = async ({ fetch, params }) => {
  const longTailOfPi = await fetch('/pi-long-tail.txt') 
    .then((res) => res.text())
    .then((text) => text.split(''));

  const poemIndexSheetId = '1-BjOyI_0_cX46dbSZMrjVo0mF2sXDeFgmT8gScvOVLM';
  const url = `https://docs.google.com/spreadsheets/d/${poemIndexSheetId}/export?format=csv`;
  const poemIndexCsv = await fetch(url).then((res) => res.text());
  const poemIndex = parse(poemIndexCsv, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });

  const keyedPoemIndex = {};

  poemIndex.forEach(row => {
    const slug = slugify(row.title, { lower: true, remove: /[*+~.,()'"!:@]/g });
    return keyedPoemIndex[slug] = row;
  });
  
  const metaTailMap = new Array();
  const takenTailIndices: number[] = [];

  Object.keys(keyedPoemIndex).forEach(slug => {
    const sefirahId = keyedPoemIndex[slug].sefirahId;
    const tailIndex = longTailOfPi.findIndex((d, i) => {
      return sefirahId === d && !takenTailIndices.includes(i);
    });
    metaTailMap[tailIndex] = slug;
    takenTailIndices.push(tailIndex);
  })

  const shortTailLength = Math.max(metaTailMap.length, 100);
  const shortTailOfPi = longTailOfPi.slice(0, shortTailLength);

  return { keyedPoemIndex, metaTailMap, shortTailOfPi };
}

interface PoemMetaData {
  [key: string]: {
    title: string,
    sefirahId: number,
    intersectionId: number
  }
}