<script>
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import { createEventDispatcher, onMount } from 'svelte';

  const dispatch = createEventDispatcher();

  let { w, h } = $props();

  const curtain = tweened(0, {
    duration: 3000,
    easing: cubicOut
  });

  onMount(async () => {
    await curtain.set(1);
    dispatch('drawn');
  });

  let leftTx = $derived.by(() => -($curtain) * (w / 2));
  let rightTx = $derived.by(() => ($curtain) * (w / 2));

</script>

<g class="curtains">
  <rect
    x="0"
    y="0"
    width={ w / 2 }
    height={ h }
    transform={`translate(${leftTx},0)`}
  />
  <rect
    x={ w / 2 }
    y="0"
    width={ w / 2 }
    height={ h }
    transform={`translate(${rightTx},0)`}
  />
</g>

<style>
  rect {
    stroke: none;
    fill: black;
  }
</style>