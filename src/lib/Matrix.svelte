<script>
  import { poemIndex, piTail, poemTailIndexMap } from '$lib/store.js';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  function metaAt(index) {
    return $poemTailIndexMap[index];
  }

  function randomIntBetween(low, high) {
    return Math.floor(Math.random() * (high - low + 1)) + low;
  }

  function clickedAtIndex(i) {
    dispatch('piSliceSelected', $poemTailIndexMap[i]);
  }
</script>

<div class='matrix'>
  <span id='ellipsis' class='cell'><a href="https://here-i-am.me/" target="_blank">&hellip;</a></span>
  {#each $piTail as digit, i}
    <span class='digit cell' style="--duration: {randomIntBetween(3000, 8000)}ms; --distance: {randomIntBetween(5, 20)}%;">
    {#if metaAt(i) === undefined}
      <span class='y-drift'>
        {digit}
      </span>
    {:else}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <span onclick={ () => clickedAtIndex(i) } class='marked x-drift'>
        {digit}
      </span>
    {/if}
    </span>
  {/each}
</div>

<style>
  .matrix {
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    margin: 2%;
  }

  span.cell {
    padding: 5%;
    color: dimgrey;
    display: flex;
  }
  
  span#ellipsis {
    font-family: 'Trebuchet MS';
    transform: translateY(12%);
    font-size: 200%;
  }

  span#ellipsis a {
    text-decoration: none;
    color: gold;
  }
  
  span.digit {
    font-size: 30px;
    font-family: "Rubik", sans-serif;
    font-optical-sizing: auto;
    font-weight: 300;
    justify-content: center;
    align-items: center;
  }

  span .marked {
    color: gold;
    font-weight: 400;
  }

  .digit .marked {
    font-size: 150%;
  }

  .x-drift {
    animation: xDrift var(--duration) linear infinite alternate;
  }

  .y-drift {
    animation: yDrift var(--duration) linear infinite alternate;
  }

  @keyframes xDrift {
    from {
      transform: translateX(var(--distance));
    }
    to {
      transform: translateX(calc(var(--distance) * -1));
    }
  }

  @keyframes yDrift {
    from {
      transform: translateY(var(--distance));
    }
    to {
      transform: translateY(calc(var(--distance) * -1));
    }
  }
</style>