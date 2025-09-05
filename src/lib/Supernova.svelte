<script lang="js">
  import { createEventDispatcher } from 'svelte';

  let { bb } = $props();

  const dispatch = createEventDispatcher();

  function goneNova() {
    dispatch('goneNova');
  }
</script>

<div 
  id="supernova"
  style="left: {bb.left}px; top: {bb.top}px;"
  onanimationend={ goneNova }
></div>

<style>
  #supernova {
    position: fixed;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: gold;
    pointer-events: none;
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
    animation: supernova-explode 0.6s cubic-bezier(0.4,0,0.2,1) forwards;
    z-index: 5;
    will-change: transform, background, opacity;
  }

  @keyframes supernova-explode {
    from {
      transform: translate(-50%, -50%) scale(1);
      background: gold;
      opacity: 1;
    }
    to {
      transform: translate(-50%, -50%) scale(60);
      background: black;
      opacity: 0.95;
    }
  }
</style>