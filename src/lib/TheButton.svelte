<script>
  import { tweened } from 'svelte/motion';
  import { circOut } from 'svelte/easing';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let { x, y, r, id, animateIn } = $props();

  const circumference = r * Math.PI;

  let isLabelVisible = $state(false);
  let cooler = $state(false);

  const btnRadius = tweened(0, {
    duration: Math.PI * 1000,
    easing: circOut
  });

  $effect(async () => {
    if (animateIn) {
      cooler = true;
      await btnRadius.set(r);
      isLabelVisible = true;
    }
  });

</script>

<circle class:cooler cx={x} cy={y} r={ $btnRadius } transform-origin={ `${x}px ${y}px` } />
{#if isLabelVisible}
  <text x={x} y={y + 2}>{id}</text>
{/if}

<style>
  circle {
    stroke-width: 1;
    stroke: var(--moon-glow-fill);
    transition: stroke 3.14s ease-out;
  }
  
  circle.cooler {
    stroke: var(--moon-glow-stroke);
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