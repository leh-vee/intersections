<script>
  import Map from '$lib/Map.svelte';
  import Matrix from '$lib/Matrix.svelte';
  import AboutModal from '$lib/AboutModal.svelte';
  import { selectionWindow, isEmForMatrix, currentPoemId, 
    readPoemIds, isModalOpen } from '$lib/store.js';

  const selectionWindowHydrated = selectionWindow.hydrated;
  let indexCardEl = $state(undefined);
  let isSideFlip = $state(false);

  async function showPoem(e) {
    if (e.propertyName === 'transform' && $currentPoemId !== undefined) {
      if (!$readPoemIds.includes($currentPoemId)) selectionWindow.increment();
      window.location.assign(`/${$currentPoemId}`);
    } 
  }

  function poemTransition(rAngle) {
    indexCardEl.style.transitionProperty = 'transform';
    indexCardEl.style.transform = `rotateY(${rAngle}deg)`;
  }

</script>

<div id="index-container">
  {#if $isModalOpen}
    <AboutModal />
  {/if}
  {#if $selectionWindowHydrated }
    <div id="index-card" bind:this={ indexCardEl } class:flipped={ $isEmForMatrix } ontransitionend={ showPoem }>
      <div id="map-index" class="card-side">
        <Map on:markerSelected={ e => poemTransition(270) } />
      </div>
      <div id="matrix-index" class="card-side">
        <Matrix on:piSliceSelected={ e => poemTransition(-90) } />
      </div>
    </div>
  {/if}
</div>


<style>
  #index-container {
    perspective: 1200px;
    width: 100%;
    height: 100%;
  }
  
  #index-card {
    width: 100%;
    height: 100%; 
    transform-style: preserve-3d;
    transition-timing-function: ease-in-out;
    transition-duration: 1s;
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
    z-index: -1;
  }
  
  .card-side#matrix-index {
    transform: rotateY(180deg);
  }
</style>
