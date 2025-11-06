<script>
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let { x, y, r, open = false } = $props();

  const tweenedAngle = tweened(0.1, {
		duration: Math.PI * 2000,
		easing: cubicOut
	});

  $effect((async () => {
    if (open) {
      await curtain.set(1);
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

  let browserHeight = $state(undefined);
  let browserWidth = $state(undefined);

  const curtain = tweened(0, {
    duration: Math.PI * 1000,
    easing: cubicOut
  });

  let leftTx = $derived.by(() => -($curtain) * (browserWidth / 2));
  let rightTx = $derived.by(() => ($curtain) * (browserWidth / 2));

</script>

<svelte:window bind:innerHeight={ browserHeight } bind:innerWidth={ browserWidth } />
<g class="curtains">
  <rect
    x="0"
    y="0"
    width={ browserWidth / 2 }
    height={ browserHeight }
    transform={`translate(${leftTx},0)`}
  />
  <rect
    x={ browserWidth / 2 }
    y="0"
    width={ browserWidth / 2 }
    height={ browserHeight }
    transform={`translate(${rightTx},0)`}
  />
</g>

<!-- {#if open}
  <path d={ d } />
{:else}
  <circle cx={ x } cy={ y } r={ r } />
{/if} -->

<style>
  rect {
    stroke: none;
    fill: black;
  }
</style>