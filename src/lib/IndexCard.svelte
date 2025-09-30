<script>
  import Map from '$lib/Map.svelte';
  import Matrix from '$lib/Matrix.svelte';
  import { goto } from '$app/navigation';

  let indexCardEl = $state(undefined);
  let isSideFlipped = $state(false);
  let poemId = $state(undefined);
  let isEmForMatrix = $state(false);

  $effect(() => {
    if (indexCardEl !== undefined) indexCardEl.addEventListener('transitionend', showPoem);
  });

  $effect(() => {
    if (poemId !== undefined) isSideFlipped = true;
  });

  function showPoem() {
    if (isSideFlipped) {
      goto(`/${poemId}`);
    }
  }

  function stopSideFlip() {
    isSideFlipped = false;
    isEmForMatrix = true;
  }

  function setPoemId(id) {
    poemId = id;
  }

</script>

<div id="index-container">
  <div id="index-card" class:flipped-over={ isEmForMatrix } class:side-flipped={ isSideFlipped } bind:this={ indexCardEl }>
    <div id="map-index" class="card-side">
      <Map on:markerSelected={ e => setPoemId(e.detail) } />
    </div>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div id="matrix-index" class="card-side" onclick={ stopSideFlip }>
      <Matrix on:piSliceSelected={ e => setPoemId(e.detail) } />
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

  #index-card.flipped-over {
    transform: rotateY(180deg);
  }
  
  #index-card.side-flipped {
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
