<script>
  import { tweened } from 'svelte/motion';
  import { circOut, elasticOut, cubicInOut } from 'svelte/easing';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let { x, y, r, id, animateIn, clicked } = $props();

  const circumference = r * Math.PI;

  let isLabelVisible = $state(false);
  let cooler = $state(false);

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
      cooler = true;
      await Promise.all([
        btnRadius.set(r),
        glowRadius.set(r)
      ]);
      isLabelVisible = true;
    }
  });

  $effect(async () => {
    if (clicked) {
      cooler = false;
      await glowRadius.set(r * 1.5, { easing: cubicInOut });
      cooler = true;
      await glowRadius.set(r, { easing: cubicInOut } );
    }
  });

</script>

<defs>
  <radialGradient id="glow-grad-{id}">
    <stop offset="0%" stop-color="gold" stop-opacity="0.8"/>
    <stop offset="50%" stop-color="gold" stop-opacity="0.4"/>
    <stop offset="100%" stop-color="gold" stop-opacity="0"/>
  </radialGradient>
</defs>

<circle class="glow" cx={x} cy={y} r={ $glowRadius } fill="url(#glow-grad-{id})" />
<circle class:cooler class:clicked cx={x} cy={y} r={ $btnRadius } transform-origin={ `${x}px ${y}px` } />
{#if isLabelVisible}
  <text x={x} y={y + 2}>{id}</text>
{/if}

<style>
  circle.glow {
    stroke: none;
    pointer-events: none;
  }

  circle {
    stroke-width: 2;
    stroke: gold;
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