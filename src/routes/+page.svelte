<script>
  import MapIndex
 from '$lib/MapIndex.svelte';

  let { data } = $props();
</script>

<MapIndex poemCoords={ data.poemCoords } />
