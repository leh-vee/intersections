<script>
  import MapIndex
 from '$lib/MapIndex.svelte';

  let { data } = $props();

  const cityCentreCoords = [-79.3805366450235, 43.7302401508249]; 
</script>

<MapIndex 
  centreCoordsGcs={ cityCentreCoords } 
  poemCoords={ data.poemCoords } 
  zoom={ 2 } 
/>
