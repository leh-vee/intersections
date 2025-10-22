<script>
  import { poemIndex, piTail, extraTailEnd, poemTailIndexMap } from '$lib/store.js';
  import IndexCard from '$lib/IndexCard.svelte';

  let { data } = $props();

  const usedTailIndices = [];
  Object.keys($poemIndex).forEach(slug => {
    const index = Number($poemIndex[slug].piTailIndex);
    usedTailIndices.push(index);
    $poemTailIndexMap[index] = slug;
  });

  const maxIndex = Math.max(...usedTailIndices);
  $piTail = data.longTailOfPi.slice(0, maxIndex + 3);
  $extraTailEnd = data.longTailOfPi.slice($piTail.length + 1, $piTail.length + 21);
</script>

<IndexCard />