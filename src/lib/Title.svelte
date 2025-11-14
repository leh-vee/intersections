<script>
  import { cubicInOut } from 'svelte/easing';
  import { tweened } from 'svelte/motion';
  import { onMount, createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  
  let { title } = $props();

  let isTyped = $state(false);

  const finalCharIndex = tweened(1, {
    duration: Math.PI * 1000,
    easing: cubicInOut
  });

  let typedTitle = $derived(title.slice(0, $finalCharIndex));

  onMount(async () => {
    await finalCharIndex.set(title.length);
    isTyped = true;
    dispatch('titled');
  });

</script>

<div id='title'>
  <h3 class:border={ isTyped } >{ typedTitle }</h3>
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
    width: 80%;
    margin: 0 auto;
    padding: 5px 0;
  }
  
  #title h3.border {
    border-bottom: 2px solid black;
  }

</style>