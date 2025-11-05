<script>
  import { tweened } from 'svelte/motion';
  import { quadInOut } from 'svelte/easing';

  let { x, y, r, id, showId = false, lit = false } = $props();
</script>

<circle class:lit cx={ x } cy={ y } r={ r } />
{#if showId}
  <text x={ x } y={ y + 2 }>{ id }</text>
{/if}


<style>
  circle {
    stroke: dimgray;
    stroke-width: 2;
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
  }
</style>