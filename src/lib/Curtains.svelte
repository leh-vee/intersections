<script>
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher(); 

  let { w, h, animateIn = false } = $props();

  const curtainOpeningPx = tweened(0, {
    duration: Math.PI * 1000,
    easing: cubicOut
  });

  $effect((async () => {
    if (animateIn) {
      await curtainOpeningPx.set(1);
      dispatch('drawn');
    }
  }));

  let leftTx = $derived.by(() => -($curtainOpeningPx) * (w / 2));
  let rightTx = $derived.by(() => ($curtainOpeningPx) * (w / 2));

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