<script>
  import { quadInOut, quadOut } from 'svelte/easing';
  import { tweened } from 'svelte/motion';
  import { onMount, createEventDispatcher } from 'svelte';
  import { poemMetadata } from '$lib/store.js';

  const dispatch = createEventDispatcher();
  let title = $derived($poemMetadata.title);
  let epigraph = $derived($poemMetadata.epigraph);
  let isEpigraph = $derived(epigraph !== undefined);

  const finalCharIndex = tweened(0, {
    duration: Math.PI * 1000,
    easing: quadInOut
  });

  const widthPercent = tweened(0, {
    duration: Math.PI * 1000,
    easing: quadOut
  });

  let typedTitle = $derived(title.slice(0, $finalCharIndex));

  onMount(async () => {
    await widthPercent.set(80);
    await finalCharIndex.set(title.length);
    dispatch('titled');
  });

</script>

<div id='wrapper' style="width: {$widthPercent}%">
  <div id='title'>{ typedTitle }</div>
  {#if isEpigraph}<div id='epigraph'>{ epigraph }</div>{/if}
</div>

<style>

  #wrapper {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin: 5px auto 0;
    border-bottom: 2px solid gold;
    animation: cool 3.14s ease-out forwards;
  }

  #wrapper div {
    margin: 0;
    padding: 0;
    line-height: 1;
    font-weight: 400;
  }
  
  #title {
    font-size: 5dvw;
    text-align: left;
    color: var(--moon-glow-fill);
  }
  
  #epigraph {
    font-size: 3dvw;
    vertical-align: baseline;
    text-align: right;
    color: ghostwhite;
  }

  @keyframes cool {
    0%   { 
      border-color: gold;
    }
    100% { 
      border-color: var(--moon-glow-stroke); 
    }
  }

</style>