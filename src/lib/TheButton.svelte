<script>
  import { tweened } from 'svelte/motion';
  import { quadInOut } from 'svelte/easing';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let { x, y, r, id, showId = false, lit = false } = $props();

  let C = $derived(2 * Math.PI * r);
  let half = $derived(C / 2);

  const progress = tweened(0, {
		duration: Math.PI * 1000,
		easing: quadInOut
	});

  let L = $derived($progress * half);
  let G = $derived(Math.max(C - 2 * L, 0));

  let isDrawn = $state(false);

  $effect(async () => {
    if (!isDrawn) {
      await progress.set(1);
      isDrawn = true;
      dispatch('drawn');
    }
  });
</script>

<circle cx={ x } cy={ y } r={ r } class:lit
  stroke-dasharray={`${L} ${G} ${L}`}
  transform-origin={ `${x}px ${y}px` }
/>
{#if showId}
  <text x={ x } y={ y + 2 }>{ id }</text>
{/if}

<style>
  circle {
    stroke: dimgray;
    stroke-width: 2;
    transform: rotate(90deg);
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
  }
</style>