<script>
  import ContentsMap from '$lib/ContentsMap.svelte';
  import Poem from '$lib/Poem.svelte';
  import { poemIndex } from '$lib/store.js';
  import { fetchPoemLines } from '$lib/api/drive';

  let mIsForMap = $state(true);
  let poemSlug = $state(null); 
  let poemMetaData = $derived($poemIndex[poemSlug]);
  let poemLines = $state([]);
  
  $effect(async () => {
    if (poemMetaData) {
      poemLines = await fetchPoemLines(poemMetaData.docId);
    }
  });

  function mapMarkerClick(id) {
    poemSlug = id;
    mIsForMap = false;  
  }

</script>

{#if mIsForMap}
  <ContentsMap on:poemSelected={e => mapMarkerClick(e.detail)} />
{:else}
  <Poem 
    title={ poemMetaData.title } 
    sefirahId={ poemMetaData.sefirahId }
    coords={ poemMetaData.coordinates }
    poemLines={ poemLines }
  />
{/if}
