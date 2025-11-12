<script>
  import { tweened } from 'svelte/motion';
  import { circOut, sineIn } from 'svelte/easing';
  import { onMount, createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let { x, y, r, id, lit = false, unify } = $props();

  const circumference = r * Math.PI;

  let isLabelVisibile = $state(false);

  const btnRadius = tweened(0, {
    duration: 3000,
    easing: sineIn
  });

  onMount(async () => {
    await btnRadius.set(r);
    setTimeout(() => {
        dispatch('spinning');
      }, 141);
  });

  const dashLengthFactor = tweened(24, {
    duration: Math.PI * 1000,
    easing: circOut
  });
  
  $effect(async () => {
    if (unify) {
      await dashLengthFactor.set(0);
      isLabelVisibile = true;
      setTimeout(() => {
        dispatch('ready');
      }, 1000);
    }
  });

  let dash = $derived( circumference / Math.round($dashLengthFactor) );
  let gap = $derived( Math.round($dashLengthFactor) );

</script>

<g class='rotate' transform-origin={ `${x}px ${y}px` }>
  <circle cx={x} cy={y} r={ $btnRadius } stroke-dasharray={ `${dash}, ${gap}` } />
</g>
{#if isLabelVisibile}
  <text x={x} y={y + 2}>{id}</text>
{/if}

<style>
  circle {
    stroke: dimgray;
    stroke-width: 2;
  }

  /* .gold {
    animation: gild 3.14s linear forwards;
  } */

  @keyframes gild {
    0% {
      stroke: dimgray;
    }
    100% {
      stroke: gold;
    }
  }

  .rotate {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
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