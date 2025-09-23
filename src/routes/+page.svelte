<script>
  import { longTailOfPi } from '$lib/store.js';
  import Controller from '$lib/Controller.svelte';

  let { data } = $props();

    $longTailOfPi = data.longTailOfPi;
</script>

<Controller />