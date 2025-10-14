<script>
  import Map from '$lib/Map.svelte';
  import Matrix from '$lib/Matrix.svelte';
  import { goto } from '$app/navigation';
  import { isEmForMatrix } from '$lib/store.js';

  let indexCardEl = $state(undefined);
  let isSideFlip = $state(false);
  let poemId = $state(undefined);

  function showPoem(e) {
    if (poemId) {
      goto(`/${poemId}`);
      $isEmForMatrix = !$isEmForMatrix;
    } 
  }

  function poemTransition(id, rAngle) {
    indexCardEl.style.transitionProperty = 'transform';
    indexCardEl.style.transform = `rotateY(${rAngle}deg)`;
    poemId = id;
  }

</script>

<div id="index-container">
  <div id="index-card" bind:this={ indexCardEl } class:flipped={ $isEmForMatrix } ontransitionend={ showPoem }>
    <div id="map-index" class="card-side">
      <Map on:markerSelected={ e => poemTransition(e.detail, 270) } />
    </div>
    <div id="matrix-index" class="card-side">
      <Matrix on:piSliceSelected={ e => poemTransition(e.detail, -90) } />
    </div>
  </div>
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
    z-index: 2;
  }
  
  .card-side#matrix-index {
    transform: rotateY(180deg);
  }
</style>
