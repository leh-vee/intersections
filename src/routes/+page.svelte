<script>
  import MapTiles from '$lib/MapTiles.svelte';

  const cityCentreCoords = [-79.3805366450235, 43.7302401508249]; 
</script>

<MapTiles centreCoordsGcs={ cityCentreCoords } zoom= { 11 } />
