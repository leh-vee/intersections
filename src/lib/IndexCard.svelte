<script>
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
<button id="flip" aria-label="Flip index card" onclick={ () => { isEmForMatrix = !isEmForMatrix } }>
  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26"><g fill="currentColor"><path d="M8.254 17.596a.5.5 0 0 1 .707-.707A5.5 5.5 0 0 0 18.35 13a.5.5 0 0 1 .999.001a6.5 6.5 0 0 1-11.096 4.596"/><path d="M16.131 15.416a.5.5 0 0 1-.555-.832l3-2a.5.5 0 1 1 .555.832z"/><path d="M21.266 15.723a.5.5 0 1 1-.832.554l-2-3a.5.5 0 0 1 .832-.554zm-3.912-7.518a.5.5 0 0 1-.708.707a5.5 5.5 0 0 0-9.389 3.89a.5.5 0 0 1-1-.001a6.5 6.5 0 0 1 11.097-4.596"/><path d="M9.476 10.385a.5.5 0 0 1 .555.832l-3 2a.5.5 0 1 1-.555-.832z"/><path d="M4.341 10.078a.5.5 0 1 1 .832-.554l2 3a.5.5 0 0 1-.832.554z"/><path fill-rule="evenodd" d="M13 24.5c6.351 0 11.5-5.149 11.5-11.5S19.351 1.5 13 1.5S1.5 6.649 1.5 13S6.649 24.5 13 24.5m0 1c6.904 0 12.5-5.596 12.5-12.5S19.904.5 13 .5S.5 6.096.5 13S6.096 25.5 13 25.5" clip-rule="evenodd"/></g></svg>
</button>
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
  #flip {
    position: fixed;
    top: 5px;
    left: 5px;
    z-index: 5;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: gold;
  }

  #index-container {
    perspective: 1200px;
    width: 100%;
    height: 100%;
  }
  
  #index-card {
    width: 100%;
    height: 100%;
    transition: transform 1s ease-in-out;
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
