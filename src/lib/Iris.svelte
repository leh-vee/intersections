<script>
  import { tweened } from 'svelte/motion';
  import { linear } from 'svelte/easing';
  import { onMount, createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let { x, y, r, wipeStartAngle } = $props();

  const wipeDestinationAngle = wipeStartAngle + 360;

  const wipeTweenedAngle = tweened(wipeStartAngle + 0.1, {
		duration: Math.PI * 1000,
		easing: linear
	});

  onMount(async () => {
    await wipeTweenedAngle.set(wipeDestinationAngle);
    dispatch('wiped');
  });

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
    return sectorPath(x, y, r, wipeDestinationAngle, $wipeTweenedAngle);
  });

</script>

<path d={d} />

<style>
  path {
    stroke: none;
    fill: black;
  }
</style>