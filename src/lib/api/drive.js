// @ts-nocheck
import { parse } from 'csv-parse/browser/esm/sync';
import slugify from 'slugify';

export async function fetchCsvIndex() {
  const sheetId = '1-BjOyI_0_cX46dbSZMrjVo0mF2sXDeFgmT8gScvOVLM';
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
  
  console.log('fetching index from Google Drive');
  const response = await fetch(url);
    
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const csvText = await response.text();
  
  return csvText;
}

export function parseCsvIndex(csv) {
  const index = parse(csv, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });

  const keyedIndex = {};
  index.forEach(row => {
    const slug = slugify(row.title, { lower: true, remove: /[*+~.,()'"!:@]/g });
    const { longitude, latitude, ...summarizedRow } = row;
    summarizedRow.coordinates = [longitude, latitude]
    keyedIndex[slug] = summarizedRow;
  });

  return keyedIndex;
}

export async function fetchPoemLines(docId) {
  const url = `https://docs.google.com/document/d/${docId}/export?format=txt`;

  console.log('fetching poem from Google Drive');
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const text = await response.text();
  const lines = text
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line !== "")

  return lines;
}