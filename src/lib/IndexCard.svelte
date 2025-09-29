<script>
  // @ts-nocheck
  import Map from '$lib/Map.svelte';
  import Matrix from '$lib/Matrix.svelte';
  import Poem from '$lib/Poem.svelte';
  import { pushState } from '$app/navigation';
  import { page } from '$app/state';

  let { slug = undefined } = $props();
  let showPoem = $derived(page.state.showPoem === true || slug !== undefined);

  let poemId = $state(slug);
  let isEmForMatrix = $state(false);

  function poemSelected(id) {
    poemId = id;
    pushState(`/${poemId}`, { showPoem: true });
  }

</script>

{#if !showPoem}
  <div id="index-container">
    <div id="index-card" class:flipped={isEmForMatrix}>
      <div id="map-index" class="card-side">
        <Map on:markerSelected={e => poemSelected(e.detail)} />
      </div>
      <div id="matrix-index" class="card-side">
        <Matrix />
      </div>
    </div>
  </div>
{:else}
  <Poem id={ poemId } />
{/if}

<style>
  #index-container {
    perspective: 1200px;
    width: 100%;
    height: 100%;
  }
  
  #index-card {
    width: 100%;
    height: 100%;
    transition: transform 1s cubic-bezier(.4,2,.3,1);
    transform-style: preserve-3d;
  }
  
  #index-card.flipped {
    transform: rotateY(180deg);
  }
  
  .card-side {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    top: 0;
    left: 0;
  }
  
  .card-side#map-index {
    z-index: 2;
  }
  
  .card-side#matrix-index {
    transform: rotateY(180deg);
  }
</style>
