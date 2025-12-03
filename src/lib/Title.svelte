<script>
  import { quadInOut, quadOut } from 'svelte/easing';
  import { tweened } from 'svelte/motion';
  import { onMount, createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  
  let { title } = $props();

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
</div>

<style>

  #title {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
  
  #title h3 {
    --heading-height: 3dvh;
    height: var(--heading-height);
    font-size: var(--heading-height);
    font-weight: 400;
    color: var(--moon-glow-fill);
    margin: 0 auto;
    padding: 5px 0;
    border-bottom: 1px solid gold;
    animation: cool 3.14s ease-out forwards;
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