<script>
  import Map from '$lib/Map.svelte';
  import Matrix from '$lib/Matrix.svelte';
  import { goto } from '$app/navigation';

  let indexCardEl = $state(undefined);
  let isSideFlipped = $state(false);
  let poemId = $state(undefined);

  $effect(() => {
    if (indexCardEl !== undefined) indexCardEl.addEventListener('transitionend', showPoem);
  });

  $effect(() => {
    if (poemId !== undefined) isSideFlipped = true;
  });

  function showPoem() {
    goto(`/${poemId}`);
  }

</script>

<div id="index-container">
  <div id="index-card" class:flipped={ isSideFlipped } bind:this={ indexCardEl }>
    <div id="map-index" class="card-side">
      <Map on:markerSelected={ e => { poemId = e.detail } } />
    </div>
    <div id="matrix-index" class="card-side">
      <Matrix />
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
    border-radius: 10px;
    transition: transform 1s ease-in-out;
    transform-style: preserve-3d;
  }
  
  #index-card.flipped {
    transform: rotateY(270deg);
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
