// @ts-nocheck
import { GOOGLE_API_KEY } from '$env/static/private';

export async function fetchPoemMetadata(docId) {
  const url = `https://www.googleapis.com/drive/v3/files/${docId}?fields=name,description&key=${GOOGLE_API_KEY}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch doc meta data: ${response.status}`);
  }

  const data = await response.json();
  const description = data.description ? JSON.parse(data.description) : undefined; 
  const metadata = { title: data.name, ...description };
  return metadata;
}
