<script>
  import { goto } from '$app/navigation';
  import { tweened } from 'svelte/motion';
  import { circOut, elasticOut, elasticIn, elasticInOut, quartIn } from 'svelte/easing';
  import { isTheButtonDepressed, isPoemRevealed } from '$lib/store.js';

  let { x, y, r, id, animateIn } = $props();

  const circumference = r * Math.PI;
  const maxDiagonal = Math.hypot(x, y); 

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
      isGreyedOut = false;
      $isPoemRevealed = false;
      $isTheButtonDepressed = false;
      await Promise.all([
        btnRadius.set(r),
        glowRadius.set(r)
      ]);
      isLabelVisible = true;
    }
  });

  let isGreyedOut = $state(false);
  let isAnimateOut = $state(false);

  $effect(async () => {
    if ($isTheButtonDepressed && $isPoemRevealed) {
      if (isGreyedOut) {
        animateOut();
      } else {
        $isTheButtonDepressed = false;
      }
    } else if ($isTheButtonDepressed && isLabelVisible) {
      elasticGlow();
    }
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

  async function animateOut() {
    const duration = 314;
    isAnimateOut = true;
    glowRadius.set(maxDiagonal * 5, { duration, easing: quartIn });
    await btnRadius.set(maxDiagonal, { duration, easing: quartIn });
    goto('/');
  }

  function postButtonAnime(event) {
    const animeName = event.animationName.split('-').pop();
    if (animeName === 'gris') isGreyedOut = true;
  }

</script>

<defs>
  <radialGradient id="glow-grad-{id}">
    <stop offset="0%" stop-color="gold" stop-opacity="0.8"/>
    <stop offset="50%" stop-color="gold" stop-opacity="0.4"/>
    <stop offset="100%" stop-color="gold" stop-opacity="0"/>
  </radialGradient>
</defs>

<g class:period={ $isPoemRevealed }>
  <circle class="glow" cx={x} cy={y} r={ $glowRadius } fill="url(#glow-grad-{id})" />
  <circle cx={x} cy={y} r={ $btnRadius } transform-origin="{x}px {y}px"
    class:cool={ !$isTheButtonDepressed } class:open={ isAnimateOut } 
    onanimationend={ postButtonAnime } />
  {#if isLabelVisible && !isGreyedOut}
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

  circle.open {
    stroke: none;
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
    stroke: grey;
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