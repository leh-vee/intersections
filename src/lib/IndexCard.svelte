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
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" d="M17 8H9.222C7.995 8 7 8.895 7 10m3.333-2l-.96 6.909c-.082.6-.696 1.02-1.36.935c-.45-.057-.826-.34-.97-.728L7 15m6.667 1l1.11-8"/><path stroke-linejoin="round" d="M2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12 2.5c4.478 0 6.718 0 8.109 1.391S21.5 7.521 21.5 12c0 4.478 0 6.718-1.391 8.109S16.479 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391S2.5 16.479 2.5 12Z"/></g></svg>
  {:else}
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="currentColor" d="m21.436 7.586l-3.998-4.02c-.752-.756-2.063-.764-2.83-.006c-.196.196-.35.436-.418.629c-.653 1.362-1.354 2.215-2.254 2.727l-.217.105C10.751 7.506 9.434 8 7 8q-.399.001-.766.152a2.02 2.02 0 0 0-1.082 1.084a2.02 2.02 0 0 0 0 1.525c.104.249.25.471.435.651l3.235 3.235L5 20l5.352-3.822l3.227 3.227c.186.189.406.339.656.441a1.97 1.97 0 0 0 1.531 0a1.96 1.96 0 0 0 1.08-1.078c.103-.242.155-.507.155-.768c0-2.436.494-3.752.978-4.721c.496-.992 1.369-1.748 2.754-2.414q.408-.156.711-.457a2.005 2.005 0 0 0-.008-2.822m-5.248 4.801c-.819 1.643-1.188 3.37-1.195 5.604L7 10c2.139 0 3.814-.335 5.396-1.084l.235-.105c1.399-.699 2.468-1.893 3.388-3.834l3.924 4.051c-1.863.893-3.056 1.96-3.755 3.359"/></svg>
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
    color: ghostwhite;
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
