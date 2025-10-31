<script>
  import { onMount, createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  let { piSlice } = $props();
  
  const btnRadiusPx = 50;
  let draw = $state(false);
  let isDrawn = $state(false);

  onMount(() => {
    draw = true;
  });

  function btnDrawn(event) {
    const btnRect = event.target.getBoundingClientRect();
    isDrawn = true;
    dispatch('drawn', btnRect);
  }

  function clicked(event) {
    if (event.target.tagName !== 'circle' && event.target.tagName !== 'text') return;
    dispatch('clicked');
  }

</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<svg onclick={ clicked } width={ btnRadiusPx * 2 } height={ btnRadiusPx * 2 } viewBox='0 0 100 100'>
  <circle class:draw onanimationend={ btnDrawn }
    cx={ btnRadiusPx } cy={ btnRadiusPx } r={ btnRadiusPx - 1 } />
  {#if isDrawn}
    <text x={ btnRadiusPx } y={ btnRadiusPx + 2 }>{ piSlice }</text>
  {/if}
</svg>

<style>
  svg {
    position: absolute;
    bottom: 2dvh;
    width: 100%;
    z-index: 1;
  }
  
  svg circle {
    stroke: dimgray;
    stroke-width: 2;
    stroke-dasharray: 314;
    stroke-dashoffset: 314;
    transform-origin: 50px 50px;
    transform: rotate(-90deg);
  }
  
  circle.draw {
    animation: draw 3.14s ease forwards;
  }

  @keyframes draw {
    to { stroke-dashoffset: 0; }
  }

  svg circle:active {
    stroke: gold;
  }

  svg text {
    text-anchor: middle;
    alignment-baseline: middle;
    fill: #BEEEFF;
    font-family: "Rubik", sans-serif;
    font-size: 45px;
    z-index: 2;
  }
</style>