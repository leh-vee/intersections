// @ts-nocheck
import { parse } from 'csv-parse/browser/esm/sync';

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

  const keyedIndex = Object.fromEntries(
    index.map(({ docId, longitude, latitude, title, isPoemIntersection, intersectionId, ...rest }) => [
      docId,
      {
        ...rest,
        coordinates: [longitude, latitude]
      }
    ])
  );

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

export async function fetchPoemTitle(docId) {
  const key = import.meta.env.VITE_GOOGLE_API_KEY;
  const url = `https://www.googleapis.com/drive/v3/files/${docId}?fields=name&key=${key}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch doc title: ${response.status}`);
  }

  const data = await response.json();
  return data.name;
}