<script>
  import { poemIndex, piTail, poemTailIndexMap } from '$lib/store.js';
  import IndexCard from '$lib/IndexCard.svelte';

  let { data } = $props();

  const sefirahIds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const nCrossroads = 4713;
  const shortTailLength = Math.min(Object.keys($poemIndex).length * 10, nCrossroads);

  $piTail = data.longTailOfPi.slice(0, shortTailLength);

  const tailIndicesByInt = sefirahIds.map(int => {
    const indices = $piTail.reduce((acc, val, idx) => {
      if (val === int) acc.push(idx);
      return acc;
    }, []);
    return indices;
  });

  Object.keys($poemIndex).forEach(slug => {
    const sefirahId = $poemIndex[slug].sefirahId;
    const availableIncdices = tailIndicesByInt[sefirahId];
    const [randomIndex] = availableIncdices.splice(Math.floor(Math.random() * availableIncdices.length), 1);
    $poemTailIndexMap[randomIndex] = slug;
  });
</script>

<IndexCard />