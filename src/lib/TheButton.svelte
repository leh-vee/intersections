<script>
  import { tweened } from 'svelte/motion';
  import { circOut, elasticOut, elasticIn, elasticInOut } from 'svelte/easing';
  import { isTheButtonDepressed, isPoemRevealed } from '$lib/store.js';

  let { x, y, r, id, animateIn } = $props();

  const circumference = r * Math.PI;

  let isLabelVisible = $state(false);

  const btnRadius = tweened(0, {
    duration: Math.PI * 1000,
    easing: circOut
  });

  const glowRadius = tweened(0, {
    duration: Math.PI * 1000,
    easing: elasticOut
  });

  $effect(async () => {
    if (animateIn) {
      $isTheButtonDepressed = false;
      $isPoemRevealed = false;
      await Promise.all([
        btnRadius.set(r),
        glowRadius.set(r)
      ]);
      isLabelVisible = true;
    }
  });

  $effect(async () => {
    if (isLabelVisible && $isTheButtonDepressed) elasticGlow();
  });

  async function elasticGlow() {
    if ($isTheButtonDepressed) {
      await glowRadius.set(r * 1.5, { duration: 1570, easing: elasticOut });
      await glowRadius.set(r * 1.3, { duration: 1570, easing: elasticIn });
      elasticGlow();
    } else {
      glowRadius.set(r, { easing: elasticInOut } );
    }
  }

</script>

<defs>
  <radialGradient id="glow-grad-{id}">
    <stop offset="0%" stop-color="gold" stop-opacity="0.8"/>
    <stop offset="50%" stop-color="gold" stop-opacity="0.4"/>
    <stop offset="100%" stop-color="gold" stop-opacity="0"/>
  </radialGradient>
</defs>

<g class:period={$isPoemRevealed}>
  <circle class="glow" cx={x} cy={y} r={ $glowRadius } fill="url(#glow-grad-{id})" />
  <circle cx={x} cy={y} r={ $btnRadius } transform-origin="{x}px {y}px"
    class:cool={ !$isTheButtonDepressed } />
  {#if isLabelVisible}
    <text x={x} y={y + 2}>{id}</text>
  {/if}
</g>

<style>
  circle.glow {
    stroke: none;
    pointer-events: none;
  }

  circle {
    stroke-width: 2;
    stroke: gold;
  }
  
  circle.cool {
    animation: coolDown 3.14s ease-out forwards;
  }

  @keyframes coolDown {
    0%   { 
      stroke: gold; 
    }
    100% { 
      stroke: var(--moon-glow-stroke);
    }
  }

  .period circle.cool {
    animation: gris 3.14s ease-out forwards;
  }

  @keyframes gris {
    0% { 
      stroke-width: 2;
      stroke: var(--moon-glow-stroke);
    }
    100% { 
      stroke-width: 1;
      stroke: grey;
    }
  }


  text {
    text-anchor: middle;
    alignment-baseline: middle;
    fill: var(--moon-glow-fill);
    font-family: "Rubik", sans-serif;
    font-size: 6dvh;
    z-index: 2;
    pointer-events: none;
    transition: fill 3.14s ease-out;
  }

  .period text {
    fill: black;
  }
</style>