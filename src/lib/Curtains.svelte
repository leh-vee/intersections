<script>
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';

  let { w, h, animateIn } = $props();

  const curtain = tweened(0, {
    duration: Math.PI * 1000,
    easing: cubicOut
  });

  $effect((async () => {
    if (animateIn) curtain.set(1);
  }));

  let leftTx = $derived.by(() => -($curtain) * (w / 2));
  let rightTx = $derived.by(() => ($curtain) * (w / 2));

</script>

<g class="curtains">
  <rect
    x="0"
    y="0"
    width={ w / 2 }
    height={ h }
    transform={`translate(${leftTx},0)`}
  />
  <rect
    x={ w / 2 }
    y="0"
    width={ w / 2 }
    height={ h }
    transform={`translate(${rightTx},0)`}
  />
</g>

<style>
  rect {
    stroke: none;
    fill: black;
  }
</style>