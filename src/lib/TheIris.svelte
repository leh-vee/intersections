<script>
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let { x, y, btnRadius, closedRadius, openIris = false } = $props();

  const radius = tweened(closedRadius + btnRadius, {
		duration: Math.PI * 1000,
		easing: cubicOut
	});

  $effect(async () => {
    if (openIris) {
      await radius.set(closedRadius * 2);
      dispatch('irisOut');
    }
  });

</script>

<circle cx={ x } cy={ y } r={ $radius } stroke-width={ (closedRadius * 2) } />

<style>
  circle {
    fill: transparent;
    stroke: black;
  }
</style>