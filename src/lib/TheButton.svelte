<script>
  import { tweened } from 'svelte/motion';
  import { circOut } from 'svelte/easing';
  import { createEventDispatcher, onMount } from 'svelte';

  const dispatch = createEventDispatcher();

  let { x, y, r, id, showId = false, lit = false } = $props();

  const C = $derived(2 * Math.PI * r);

  const progress = tweened(0, {
    duration: Math.PI * 1000,
    easing: circOut
  });

  // dynamic shard count (start many → 1)
  const maxSegments = 36;
  const segmentCount = $derived(
    Math.max(
      1,
      Math.round(
        1 + (maxSegments - 1) * (1 - Math.pow($progress, 0.55)) // non‑linear collapse
      )
    )
  );

  // per-segment pair length
  const pairLength = $derived(C / segmentCount);

  // segment fill fraction grows; gaps shrink
  const fillFraction = $derived(Math.min(1, Math.pow($progress, 0.7)));
  const segLen = $derived(pairLength * fillFraction);
  const gapLen = $derived(Math.max(0, pairLength - segLen));

  // dasharray string
  const dash = $derived(
    segmentCount === 1
      ? `${C}` // single unbroken ring
      : Array(segmentCount).fill('').map(() => `${segLen} ${gapLen}`).join(' ')
  );

  // rotational decay
  let rotation = $state(0);

  $effect(() => {
    let frame;
    let last = performance.now();
    function loop(now) {
      const dt = now - last;
      last = now;
      // speed (deg/ms) eases down as progress advances
      const speed = 0.35 * (1 - $progress) + 0.01; // never fully zero
      rotation += dt * speed * 180 / 1000; // scale
      if ($progress < 1 || speed > 0.02) {
        frame = requestAnimationFrame(loop);
      }
    }
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  });

  onMount(async () => {
    await progress.set(1);
    dispatch('ready');
  });
</script>

<circle
  cx={x}
  cy={y}
  r={r}
  class:lit
  stroke-dasharray={dash}
  transform={`rotate(${90 + rotation} ${x} ${y})`}
/>

{#if showId}
  <text x={x} y={y + 2}>{id}</text>
{/if}

<style>
  circle {
    stroke: dimgray;
    stroke-width: 2;
    transition: stroke 300ms;
  }

  circle.lit {
    stroke: gold;
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