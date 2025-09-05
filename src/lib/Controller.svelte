<script>
  // @ts-nocheck
  import Map from '$lib/Map.svelte';
  import Poem from '$lib/Poem.svelte';
  import { pushState } from '$app/navigation';
  import { page } from '$app/state';

  let { slug = undefined } = $props();

  let poemId = $state(slug);
  let showPoem = $derived(page.state.showPoem === true || slug !== undefined);

  function poemSelected(id) {
    poemId = id;
    pushState(`/${poemId}`, { showPoem: true });
  }
</script>

<div class:hidden={showPoem}>
  <Map on:markerSelected={e => poemSelected(e.detail)} />
</div>
{#if showPoem}
  <Poem id={ poemId } />
{/if}

<style>
  .hidden {
    opacity: 0;
    pointer-events: none;
  }
</style>
