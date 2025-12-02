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

  const glowRadius = tweened(0, {
    duration: Math.PI * 1000,
    easing: circOut
  });

  $effect(async () => {
    if (animateIn) {
      cooler = true;
      await Promise.all([
        btnRadius.set(r),
        glowRadius.set(r * 1.5)
      ]);
      isLabelVisible = true;
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
<circle class:cooler cx={x} cy={y} r={ $btnRadius } transform-origin={ `${x}px ${y}px` } />
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
    stroke: dimgrey;
    transition: stroke 3.14s ease-out;
  }
  
  circle.cooler {
    stroke: dimgrey;
  }


  text {
    text-anchor: middle;
    alignment-baseline: middle;
    fill: gold;
    font-family: "Rubik", sans-serif;
    font-size: 45px;
    z-index: 2;
    pointer-events: none;
    stroke: dimgray;
    stroke-width: 1;
  }
</style>