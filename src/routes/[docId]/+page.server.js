import { fetchPoemMetadata } from '$lib/server/api/drive';

export async function load({ params }) {
  const docId = params.docId;
  const poemMetadata = await fetchPoemMetadata(docId);

  return { docId, poemMetadata };
}