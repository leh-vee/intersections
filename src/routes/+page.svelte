<script>
  import ContentsMap from '$lib/ContentsMap.svelte';

  let mIsForMap = $state(true);
  let poemSlug = $state(null); 
  
  function mapMarkerClick(id) {
    poemSlug = id;
    mIsForMap = false;  
  }

</script>

{#if mIsForMap}
  <ContentsMap on:markerClick={e => mapMarkerClick(e.detail)} />
{:else}
  <div>
    <h1>{ poemSlug }</h1>
    <button onclick={ () => { mIsForMap = true} }>back</button>
  </div>
{/if}

<style>
  h1 {
    color: yellow;
    width: 100%;
    text-align: center;
  }
</style>
