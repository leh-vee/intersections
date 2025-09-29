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
  {#if !isEmForMatrix}
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 14 14"><path fill="currentColor" fill-rule="evenodd" d="M1.25 7a5.75 5.75 0 1 1 11.5 0a5.75 5.75 0 0 1-11.5 0M7 0a7 7 0 1 0 0 14A7 7 0 0 0 7 0m2.962 4.619a.625.625 0 1 0-.175-1.238L9.875 4l-.088-.619h-.003l-.009.002l-.035.005l-.134.019a440 440 0 0 0-2.003.29c-1.13.165-2.39.356-2.801.44c-.924.191-1.403.967-1.531 1.454a.625.625 0 1 0 1.208.318a.8.8 0 0 1 .185-.316a.7.7 0 0 1 .39-.23q.074-.016.19-.037a19 19 0 0 1-.122 1.89c-.126 1.028-.363 1.914-.74 2.4a.625.625 0 1 0 .987.767c.603-.777.866-1.968.994-3.015c.1-.815.127-1.625.134-2.243c.395-.06.828-.124 1.253-.187v4.536c0 .205.065.485.262.725c.218.266.552.426.963.426c.79 0 1.282-.56 1.443-.842a.625.625 0 0 0-1.086-.619l-.01.014l-.028.035a.6.6 0 0 1-.091.082a.4.4 0 0 1-.203.079V4.756l.3-.043l.482-.069l.134-.019l.035-.004l.008-.002zL9.875 4z" clip-rule="evenodd"/></svg>
  {:else}
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><circle cx="12" cy="9" r="2.5" fill="currentColor" fill-opacity="0"><animate fill="freeze" attributeName="fill-opacity" begin="0.5s" dur="0.15s" values="0;1"/></circle><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 20.5C12 20.5 11 19 11 18C11 17.5 11.5 17 12 17C12.5 17 13 17.5 13 18C13 19 12 20.5 12 20.5z"><animate fill="freeze" attributeName="d" dur="0.4s" keyTimes="0;0.7;1" values="M12 20.5C12 20.5 11 19 11 18C11 17.5 11.5 17 12 17C12.5 17 13 17.5 13 18C13 19 12 20.5 12 20.5z;M12 20.5C12 20.5 5 13 5 8C5 4.5 8 1 12 1C16 1 19 4.5 19 8C19 13 12 20.5 12 20.5z;M12 20.5C12 20.5 6 13.5 6 9C6 5.68629 8.68629 3 12 3C15.3137 3 18 5.68629 18 9C18 13.5 12 20.5 12 20.5z"/><animateTransform attributeName="transform" dur="3s" keyTimes="0;0.3;0.4;0.54;0.6;0.68;0.7;1" repeatCount="indefinite" type="rotate" values="0 12 20.5;0 12 20.5;-8 12 20.5;0 12 20.5;5 12 20.5;-2 12 20.5;0 12 20.5;0 12 20.5"/></path></svg>
  {/if}
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
