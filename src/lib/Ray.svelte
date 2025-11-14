<script>
  import { tweened } from 'svelte/motion';
  import { cubicIn, cubicOut } from 'svelte/easing';
  import { createEventDispatcher, onMount } from 'svelte';

  const dispatch = createEventDispatcher(); 

  let { screenHeight, xCentrePx, yEndPx } = $props();

  const rayLength = screenHeight / 20;
  const yHeadPx = tweened(0);
  const yTailPx = tweened(0);
  const oneSec = 1000;
  const piSecs = Math.PI * oneSec;
  const piRemainderSecs = (Math.PI - 3) * oneSec;

  let nIntervalsCompleted = $state(0);

  onMount(() => {
    descend();
  })

  async function descend() {
    await yHeadPx.set(rayLength, { duration: piRemainderSecs, easing: cubicIn });
    yHeadPx.set(screenHeight, { duration: oneSec, easing: cubicOut });
    await yTailPx.set(screenHeight - rayLength, { duration: oneSec, easing: cubicIn });
    yTailPx.set(screenHeight, { duration: piRemainderSecs, easing: cubicOut });
    nIntervalsCompleted += 1;
    if (nIntervalsCompleted === 3) {
      pregnantAscent();
    } else {
      ascend();
    }
  } 
  
  async function ascend() {
    await yHeadPx.set(screenHeight - rayLength, { duration: piRemainderSecs, easing: cubicIn });
    yHeadPx.set(0, { duration: oneSec, easing: cubicOut });
    await yTailPx.set(rayLength, { duration: oneSec, easing: cubicIn });
    yTailPx.set(0, { duration: piRemainderSecs, easing: cubicOut });
    nIntervalsCompleted += 1;
    descend();
  }

  async function pregnantAscent() {
    await await yHeadPx.set(screenHeight - rayLength, { duration: piRemainderSecs, easing: cubicIn });
    yHeadPx.set(yEndPx, { duration: oneSec, easing: cubicOut });
    await yTailPx.set(yEndPx + 2, { duration: oneSec, easing: cubicIn });
    dispatch('pregnantPause');
  }

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
    /* stroke-linecap: round; */
  }
</style>