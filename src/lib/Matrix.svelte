<script>
  import { poemIndex, piTail, poemTailIndexMap, extraTailEnd } from '$lib/store.js';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  const matrixCellPx = 60;
  const renderedToVisibleCellsRatio = 2;
  let matrixWidth = $state(undefined); 
  let browserHeight = $state(undefined);
  let scrollY = $state(undefined);
  
  let cellsPerRow = $derived(Math.floor(matrixWidth / matrixCellPx));
  let tail = $derived.by(() => {
    let tail = [...$piTail];
    const tailLength = $piTail.length;
    const nSlicesShort = tailLength % cellsPerRow;
    if (nSlicesShort > 0) tail = [...$piTail, ...$extraTailEnd.slice(0, cellsPerRow - nSlicesShort)];
    return tail.slice(0, tail.length - 1);
  });
  let totalCells = $derived(tail.length);
  let visibleRows = $derived(Math.floor(browserHeight / matrixCellPx));
  let nRenderedRows = $derived(visibleRows * renderedToVisibleCellsRatio);
  let renderedSegmentHeight = $derived(nRenderedRows * matrixCellPx);
  let nRenderedCells = $derived(nRenderedRows * cellsPerRow);
  
  let totalRows = $derived(Math.ceil(totalCells / cellsPerRow));
  let matrixHeight = $derived(totalRows * matrixCellPx);
  let renderedSegmentTop = $derived.by(() => {
    let top = 0;
    if ((matrixHeight - scrollY) < renderedSegmentHeight) {
      top = matrixHeight - renderedSegmentHeight;
    } else if (scrollY > browserHeight) {
      top = scrollY - Math.round(browserHeight / 2);
    }
    top = Math.floor(top / matrixCellPx) * matrixCellPx;
    return top;
  });

  let firstVisibleRowIndex = $derived(Math.floor(renderedSegmentTop / matrixCellPx));
  let firstVisibleCellIndex = $derived(firstVisibleRowIndex * cellsPerRow);
  let lastVisibleCellIndex = $derived(Math.min(firstVisibleCellIndex + nRenderedCells, tail.length));
  
  let visibleTail = $derived(tail.slice(firstVisibleCellIndex, lastVisibleCellIndex));

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

<svelte:window bind:innerHeight={ browserHeight } bind:scrollY={scrollY} />

<div id='matrix' style="--cell-size: {matrixCellPx}px; height:{matrixHeight}px" >
  <div id='visible-segment' bind:clientWidth={ matrixWidth } style:top="{renderedSegmentTop}px">
    {#if firstVisibleCellIndex === 0}
      <span id='ellipsis' class='cell'><a href="https://here-i-am.me/" target="_blank">&hellip;</a></span>
    {/if}
    {#each visibleTail as digit, i}
      <span class='digit cell' style="--duration: {randomIntBetween(3000, 8000)}ms; --distance: {randomIntBetween(5, 20)}%;">
      {#if metaAt(i + firstVisibleCellIndex) === undefined}
        <span class='y-drift'>
          {digit}
        </span>
      {:else}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <span onclick={ () => clickedAtIndex(i + firstVisibleCellIndex) } class='marked x-drift'>
          {digit}
        </span>
      {/if}
      </span>
    {/each}
    {#if lastVisibleCellIndex === tail.length}
      <!-- svelte-ignore a11y_missing_attribute -->
      <span id='question-mark' class='cell'><a>?</a></span>
    {/if}
  </div>
</div>

<style>
  #matrix {
    position: absolute;
    top: 0;
    width: 100%;
  }

  #visible-segment {
    position: absolute;
    width: 96%;
    margin: 0 2%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    overflow-y: visible;
  }

  span.cell {
    color: dimgrey;
    display: flex;
    width: var(--cell-size);
    height: var(--cell-size);
    justify-content: center;
    align-items: center;
  }
  
  span#ellipsis {
    font-family: 'Trebuchet MS';
    font-size: 200%;
  }

  span#ellipsis a {
    text-decoration: none;
    color: gold;
  }

  #question-mark {
    font-family: "Rubik", sans-serif;
    font-size: 40px;
    color: gold;
  }
  
  span.digit {
    font-size: 30px;
    font-family: "Rubik", sans-serif;
    font-optical-sizing: auto;
    font-weight: 300;
  }

  span.digit .marked {
    color: gold;
    font-weight: 400;
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