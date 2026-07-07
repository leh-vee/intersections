import { fetchPoemMetadata } from '$lib/server/api/drive';
import { fetchPoemLines } from '$lib/api/drive';

export async function load({ params }) {
  const docId = params.docId;
  const [poemMetadata, lines] = await Promise.all([
    fetchPoemMetadata(docId),
    fetchPoemLines(docId)
  ]);

  return { docId, poemMetadata, lines };
}