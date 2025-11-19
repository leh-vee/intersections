<script>
  import { tweened } from 'svelte/motion';
  import { circOut } from 'svelte/easing';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let { x, y, r, id, animateIn, lit = false } = $props();

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

<circle cx={x} cy={y} r={ $btnRadius } />
{#if isLabelVisible}
  <text x={x} y={y + 2}>{id}</text>
{/if}

<style>
  circle {
    stroke: gold;
    stroke-width: 1;
    /* breathe 3.14s ease-in-out infinite 3.14s; */
  }

  @keyframes breathe {
    0%   { 
      stroke-width: 2;
    }
    50%  { 
      stroke-width: 1;
    }
    100% { 
      stroke-width: 2;
    }
  }

  text {
    text-anchor: middle;
    alignment-baseline: middle;
    fill: #BEEEFF;
    font-family: "Rubik", sans-serif;
    font-size: 45px;
    z-index: 2;
    pointer-events: none;
  }
</style>