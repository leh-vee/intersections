<script>
  // @ts-nocheck
  import Map from '$lib/Map.svelte';
  import MatrixIndex from '$lib/MatrixIndex.svelte';
  import Poem from '$lib/Poem.svelte';
  import { pushState } from '$app/navigation';
  import { page } from '$app/state';

  let { slug = undefined } = $props();

  let poemId = $state(slug);
  let isEmForMatrix = $state(false);
  let showPoem = $derived(page.state.showPoem === true || slug !== undefined);

  function poemSelected(id) {
    poemId = id;
    pushState(`/${poemId}`, { showPoem: true });
  }

</script>

<div id="index-container" class:hidden={showPoem}>
  <div id="index-card" class:flipped={isEmForMatrix}>
    <div id="map-index" class="card-side">
      <Map on:markerSelected={e => poemSelected(e.detail)} on:userIdle={ () => { isEmForMatrix = true } } />
    </div>
    <div id="matrix-index" class="card-side">
      <MatrixIndex />
    </div>
  </div>
</div>
{#if showPoem}
  <Poem id={ poemId } />
{/if}

<style>
  #index-container {
    perspective: 1200px;
    width: 100vw;
    height: 100vh;
    position: relative;
  }
  
  #index-card {
    width: 100%;
    height: 100%;
    position: absolute;
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
    background: #222;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .hidden {
    opacity: 0;
    pointer-events: none;
  }
</style>
