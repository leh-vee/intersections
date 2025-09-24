<script>
  import { longTailOfPi } from '$lib/store.js';
  import IndexCard from '$lib/IndexCard.svelte';

  let { data } = $props();

    $longTailOfPi = data.longTailOfPi;
</script>

<IndexCard />