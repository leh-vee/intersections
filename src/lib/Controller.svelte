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

<Map on:markerSelected={e => poemSelected(e.detail)} />
{#if isPoemSelected}
  <Poem id={ poemId } />
{/if}