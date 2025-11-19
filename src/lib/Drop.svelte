<script>
  import { tweened } from 'svelte/motion';
  import { expoOut } from 'svelte/easing';
  import { createEventDispatcher, onMount } from 'svelte';

  const dispatch = createEventDispatcher(); 

  let { screenHeight, xCentrePx, yEndPx } = $props();

  const yHeadPx = tweened(0);
  const yTailPx = tweened(0);
  const piSecs = Math.PI * 1000;
  const piRemainderSecs = (Math.PI - 3) * 1000;

  onMount(() => {
    yHeadPx.set(yEndPx, { duration: piSecs, easing: expoOut });
    setTimeout(async () => {
      await yTailPx.set(yEndPx, { duration: piSecs, easing: expoOut });
      dispatch('splat');
    }, piRemainderSecs);
  })

</script>
<defs>
  <linearGradient id="tail-gradient" gradientUnits="userSpaceOnUse"
    x1={ xCentrePx } x2={ xCentrePx } y1={ $yTailPx } y2={ $yHeadPx }>
    <stop offset="0%" stop-color="black"/>
    <stop offset="100%" stop-color="gold"/>
  </linearGradient>
</defs>
<line
  x1={ xCentrePx }
  x2={ xCentrePx }
  y1={ $yTailPx }
  y2={ $yHeadPx }
  stroke={ 'url(#tail-gradient)' } 
/>

<style>
  line {
    stroke-width: 1;
    stroke-linecap: round;
  }
</style>