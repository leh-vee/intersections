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

<div id='title'>
  <h3 style="width: {$widthPercent}%">{ typedTitle }</h3>
  {#if isEpigraph}<h5 id='epigraph'>{ epigraph }</h5>{/if}
</div>

<style>

  #title {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
  
  #title h3 {
    height: 5dvw;
    font-size: 5dvw;
    font-weight: 400;
    color: var(--moon-glow-fill);
    margin: 0 auto;
    padding: 5px 0;
    border-bottom: 2px solid gold;
    animation: cool 3.14s ease-out forwards;
  }

  #epigraph {
    color: lightgrey;
    margin: 0;
    margin-top: 4px;
    font-weight: lighter;
    font-size: 14px;
    text-align: right;
    padding: 0;
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