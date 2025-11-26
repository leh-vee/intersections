<script>
  import { tweened } from 'svelte/motion';
  import { circOut } from 'svelte/easing';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let { x, y, r, id, animateIn, gild } = $props();

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

<circle class:gild cx={x} cy={y} r={ $btnRadius } transform-origin={ `${x}px ${y}px` } />
{#if isLabelVisible}
  <text x={x} y={y + 2}>{id}</text>
{/if}

<style>
  circle {
    stroke: dimgrey;
    stroke-width: 2;
    transition: stroke 3.14s ease-out;
  }

  circle.gild {
    stroke: gold;
    animation: pulse 3.14s ease-in-out forwards;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.03);
    }
    100% {
      transform: scale(1);
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