<script>
  // @ts-nocheck
  import Map from '$lib/Map.svelte';
  import Poem from '$lib/Poem.svelte';

  let { slug = undefined } = $props();

  let poemId = $state(slug);
  let isPoemSelected  = $derived(poemId !== undefined);

  function poemSelected(id) {
    poemId = id;
  }
</script>

<div class:hidden={isPoemSelected}>
  <Map on:markerSelected={e => poemSelected(e.detail)} />
</div>
{#if isPoemSelected}
  <Poem id={ poemId } />
{/if}

<style>
  .hidden {
    opacity: 0;
    pointer-events: none;
  }
</style>
