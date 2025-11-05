<script>
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let { x, y, r, n, showNumber = false } = $props();

  const dashArray = 360;
  const dashOffset = tweened(dashArray, {
		duration: Math.PI * 1000,
		easing: cubicOut
	});

  let isDrawn = $state(false);

  $effect(async () => {
    if (!isDrawn) {
      await dashOffset.set(0);
      isDrawn = true;
      dispatch('drawn');
    }
  });
</script>

<circle cx={ x } cy={ y } r={ r } 
  stroke-dasharray={ dashArray }
  stroke-dashoffset={ $dashOffset }
  transform-origin={ `${x}px ${y}px` }
/>
{#if showNumber}
  <text x={ x } y={ y + 2 }>{ n }</text>
{/if}

<style>
  circle {
    stroke: dimgray;
    stroke-width: 2;
    transform: rotate(-90deg);
  }

  text {
    text-anchor: middle;
    alignment-baseline: middle;
    fill: #BEEEFF;
    font-family: "Rubik", sans-serif;
    font-size: 45px;
    z-index: 2;
  }
</style>