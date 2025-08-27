<script>
  import ContentsMap from '$lib/ContentsMap.svelte';
  import Poem from '$lib/Poem.svelte';
  import { poemIndex } from '$lib/store.js';

  let mIsForMap = $state(true);
  let poemSlug = $state(null); 
  let poemMetaData = $derived($poemIndex[poemSlug]);

  function mapMarkerClick(id) {
    poemSlug = id;
    mIsForMap = false;  
  }

</script>

{#if mIsForMap}
  <ContentsMap on:markerClick={e => mapMarkerClick(e.detail)} />
{:else}
  <Poem title={ poemMetaData.title } sefirahId={ poemMetaData.sefirahId } />
{/if}
