<script>
  import { quadInOut, sineInOut } from 'svelte/easing';
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
    easing: sineInOut
  });

  let typedTitle = $derived(title.slice(0, $finalCharIndex));

  onMount(async () => {
    await widthPercent.set(80);
    dispatch('titled');
    await finalCharIndex.set(title.length);
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
    font-weight: 400;
    color: ghostwhite;
    margin: 0 auto;
    padding: 5px 0;
    border-bottom: 2px solid black;
  }

</style>