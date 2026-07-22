<script>
  import { quadInOut, quadOut } from 'svelte/easing';
  import { tweened } from 'svelte/motion';
  import { onMount, createEventDispatcher } from 'svelte';
  import { poemMetadata } from '$lib/store.js';

  const dispatch = createEventDispatcher();
  let title = $derived($poemMetadata.title);
  let isTitled = $state(false);
  let epigraph = $derived($poemMetadata.epigraph);
  let showEpigraph = $derived(epigraph !== undefined && isTitled);

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
    await widthPercent.set(100);
    await finalCharIndex.set(title.length);
    dispatch('titled');
    isTitled = true;
  });

</script>

<div id='wrapper'>
  <div id='title' style="width: {$widthPercent}%">{ typedTitle }</div>
  {#if showEpigraph }<div id='epigraph'>{ epigraph }</div>{/if}
</div>

<style>

  #wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 5px auto 0;
    width: 80%;
  }
  
  #wrapper div {
    line-height: 1;
    font-weight: 400;
    text-align: left;
  }
  
  #title {
    margin: 5px 0 0;
    padding: 0 0 1px;
    font-size: 5dvw;
    height: 5dvw;
    color: var(--moon-glow-fill);
    border-bottom: 2px solid gold;
    animation: cool 3.14s ease-out forwards;
  }
  
  #epigraph {
    margin: 4px 0 5px;
    font-size: 3dvw;
    height: 3dvw;
    font-family: Arial;
    width: 100%;
    animation: concretize 1s ease-out forwards;
  }

  @keyframes cool {
    0%   { 
      border-color: gold;
    }
    100% { 
      border-color: var(--moon-glow-stroke); 
    }
  }

  @keyframes concretize {
    0%   { 
      color: gold;
      opacity: 0;
    }
    100% { 
      color: lightgoldenrodyellow;
      opacity: 1;
    }
  }

</style>