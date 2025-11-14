<script>
  import { tweened } from 'svelte/motion';
  import { circOut, sineIn } from 'svelte/easing';
  import { createEventDispatcher, onMount } from 'svelte';

  const dispatch = createEventDispatcher();

  let { x, y, r, id, lit = false } = $props();

  const circumference = r * Math.PI;

  let gild = $state(false);

  const btnRadius = tweened(0, {
    duration: Math.PI * 1000,
    easing: sineIn
  });

  onMount(async () => {
    btnRadius.set(r);
    await dashLengthFactor.set(0);
    gild = true;
    dispatch('ready');
  });

  const dashLengthFactor = tweened(1000, {
    duration: Math.PI * 1000,
    easing: circOut
  });

  let dash = $derived( circumference / Math.round($dashLengthFactor) );
  let gap = $derived( Math.round($dashLengthFactor) );

  let rotate = $state(true);

</script>

<g class:rotate transform-origin={ `${x}px ${y}px` }>
  <circle class:gild cx={x} cy={y} r={ $btnRadius } stroke-dasharray={ `${dash}, ${gap}` } />
</g>
{#if gild}
  <text x={x} y={y + 2}>{id}</text>
{/if}

<style>
  circle {
    stroke: dimgray;
    stroke-width: 2;
  }
  
  circle.gild {
    stroke: gold;
    animation: 
      gild 3.14s ease-out,
      breathe 3.14s ease-in-out infinite 3.14s;
  }

  @keyframes breathe {
    0%   { 
      stroke-width: 2;
    }
    50%  { 
      stroke-width: 3;
    }
    100% { 
      stroke-width: 2;
    }
  }

  @keyframes gild {
    0%   { 
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