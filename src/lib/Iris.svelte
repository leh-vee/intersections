<script>
  import { tweened } from 'svelte/motion';
  import { quadInOut } from 'svelte/easing';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let { x, y, r, open = false } = $props();

  const tweenedAngle = tweened(0.1, {
		duration: Math.PI * 2000,
		easing: quadInOut
	});

  $effect((async () => {
    if (open) {
      await tweenedAngle.set(180);
      dispatch('wiped');
    }
  }));

  function polarToCartesian(cx, cy, r, angle) {
    const a = (angle - 90) * Math.PI / 180; // rotate so 0° is up
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  }

  function sectorPath(cx, cy, r, startAngle, endAngle) {
    const start = polarToCartesian(cx, cy, r, startAngle);
    const end = polarToCartesian(cx, cy, r, endAngle);
    const largeArc = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
    const sweep = endAngle > startAngle ? 1 : 0;
    return [
      `M ${cx} ${cy}`,
      `L ${start.x} ${start.y}`,
      `A ${r} ${r} 0 ${largeArc} ${sweep} ${end.x} ${end.y}`,
      'Z'
    ].join(' ');
  }

  let d = $derived.by(() => {
    return sectorPath(x, y, r, $tweenedAngle, 360 - $tweenedAngle);
  });

</script>

{#if open}
  <path d={ d } />
{:else}
  <circle cx={ x } cy={ y } r={ r } />
{/if}

<style>
  path, circle {
    stroke: none;
    fill: black;
  }
</style>