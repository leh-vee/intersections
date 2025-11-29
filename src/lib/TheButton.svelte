<script>
  import { tweened } from 'svelte/motion';
  import { circOut } from 'svelte/easing';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let { x, y, r, id, animateIn } = $props();

  const circumference = r * Math.PI;

  let isLabelVisible = $state(false);

  const btnRadius = tweened(0, {
    duration: Math.PI * 1000,
    easing: circOut
  });

  $effect(async () => {
    if (animateIn) {
      await btnRadius.set(r);
      isLabelVisible = true;
    }
  });

</script>

<circle cx={x} cy={y} r={ $btnRadius } transform-origin={ `${x}px ${y}px` } />
{#if isLabelVisible}
  <text x={x} y={y + 2}>{id}</text>
{/if}

<style>
  circle {
    stroke: var(--moon-glow-stroke);
    stroke-width: 1;
  }

  text {
    text-anchor: middle;
    alignment-baseline: middle;
    fill: var(--moon-glow-fill);
    font-family: "Rubik", sans-serif;
    font-size: 45px;
    z-index: 2;
    pointer-events: none;
  }
</style>