import { fetchCsvIndex, parseCsvIndex } from '$lib/api/drive';

export async function load() {
  const indexCsv = await fetchCsvIndex();
  const parsedIndex = parseCsvIndex(indexCsv);

  return { parsedIndex }
}