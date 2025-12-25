<script>
  import { piTail, poemTailIndexMap, extraTailEnd, lastPoemReadId,
    currentPoemId, isEmForMatrix } from '$lib/store.js';
  import { tweened } from 'svelte/motion';
  import { quartInOut, linear } from 'svelte/easing'
  import { createEventDispatcher, tick } from 'svelte';

  const dispatch = createEventDispatcher();

  const matrixCellPx = 60;
  const renderedToVisibleCellsRatio = 2;
  let matrixWidth = $state(undefined); 
  let browserHeight = $state(undefined);
  let matrixEl;
  let scrollY = $state(0);
  
  let cellsPerRow = $derived(Math.floor(matrixWidth / matrixCellPx));
  let tail = $derived.by(() => {
    let tail = [...$piTail];
    const tailLength = $piTail.length;
    const nSlicesShort = tailLength % cellsPerRow;
    if (nSlicesShort > 0) tail = [...$piTail, ...$extraTailEnd.slice(0, cellsPerRow - nSlicesShort)];
    return tail.slice(0, tail.length - 2);
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
    } else if (scrollY > (browserHeight / 2)) {
      top = scrollY - Math.round(browserHeight / 2);
    }
    top = Math.floor(top / matrixCellPx) * matrixCellPx;
    return top;
  });

  let firstVisibleRowIndex = $derived(Math.floor(renderedSegmentTop / matrixCellPx));
  let firstVisibleCellIndex = $derived.by(() => {
    let index = firstVisibleRowIndex * cellsPerRow;
    if (firstVisibleRowIndex > 0) index--;
    return index;
  });
  let lastVisibleCellIndex = $derived(Math.min(firstVisibleCellIndex + nRenderedCells, tail.length));
  
  let visibleTail = $derived(tail.slice(firstVisibleCellIndex, lastVisibleCellIndex));

  let lastSelectedRowIndex = $state(0);
  $effect(() => {
    if ($lastPoemReadId !== undefined) {
      const lastSelectedCellIndex = $poemTailIndexMap.indexOf($lastPoemReadId) + 1;
      lastSelectedRowIndex = Math.floor(lastSelectedCellIndex / cellsPerRow);
    }
  });

  let sefirahEls = $state({}); 
  let sefirahSlugsRandomlyOrdered = $derived.by(() => {
    let slugs = Object.keys(sefirahEls).sort(() => Math.random() - 0.5);
    if ($lastPoemReadId !== undefined) {
      slugs = slugs.filter(slug => slug !== $lastPoemReadId);
      slugs.unshift($lastPoemReadId);
    }
    return slugs;
  }); 
  let areSefirahElsVisible = $state(false);

  const nSefirahsTween = tweened(0, {
    duration: 5000,
    easing: quartInOut
  });

  let nVisibleSefirahs = $derived(Math.round($nSefirahsTween));

  $effect(() => {
    if (nVisibleSefirahs > 0) {
      const slug = sefirahSlugsRandomlyOrdered[nVisibleSefirahs - 1];
      sefirahEls[slug]?.classList.add('visible');
    }
  });

  let isMoonLit = $state(false);
  let dim = $state(false);

  $effect(async () => {
    if (lastSelectedRowIndex >= 0 && !dim) {
      scrollY = (lastSelectedRowIndex + 1) * matrixCellPx - Math.round(browserHeight / 2);
      await tick();
      matrixEl.scrollTop = scrollY;
      if (!isMoonLit) {
        isMoonLit = true;
        await nSefirahsTween.set(sefirahSlugsRandomlyOrdered.length);
        areSefirahElsVisible = true;
      }
    }
  });

  function slugAt(index) {
    return $poemTailIndexMap[index];
  }

  function randomIntBetween(low, high) {
    return Math.floor(Math.random() * (high - low + 1)) + low;
  }

  async function clickedAtIndex(i) {
    const poemSlug = $poemTailIndexMap[i];
    dim = true;
    $currentPoemId = poemSlug;
    setTimeout(() => {
      dispatch('piSliceSelected');
    }, 1000);
  }

  function matrixScrolled() {
    scrollY = matrixEl.scrollTop;
  }

</script>

<svelte:window bind:innerHeight={ browserHeight } />

<div id='matrix' style="--cell-size: {matrixCellPx}px;" onscroll={ matrixScrolled } 
  class:lit={ isMoonLit } class:dim bind:this={ matrixEl }>
  <div id='visible-segment' bind:clientWidth={ matrixWidth } style:top="{renderedSegmentTop}px">
    {#if firstVisibleCellIndex === 0}
      <span id='ellipsis' class='cell' class:visible={ areSefirahElsVisible } >
        <a href="https://here-i-am.me/" target="_blank">&hellip;</a>
      </span>
    {/if}
    {#each visibleTail as digit, i}
      {@const index = i + firstVisibleCellIndex}
      {@const slug = slugAt(index)}
      <span class='digit cell' class:odd={ i & 1 } class:even={ !(i & 1) }
        style="--duration: {randomIntBetween(3000, 8000)}ms; --distance: {randomIntBetween(5, 20)}%;">
      {#if slug === undefined}
        <span class='y-drift'>
          {digit}
        </span>
      {:else}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <span id={ slug } class='marked x-drift' class:selected={ slug === sefirahSlugsRandomlyOrdered[0] } 
          onclick={ () => clickedAtIndex(index) }  class:visible={ areSefirahElsVisible } bind:this={ sefirahEls[slug] } >
          {digit}
        </span>
      {/if}
      </span>
    {/each}
    {#if lastVisibleCellIndex === tail.length}
      <!-- svelte-ignore a11y_missing_attribute -->
      <span id='question-mark' class='cell' class:visible={ areSefirahElsVisible }>
        <a>?</a>
      </span>
    {/if}
  </div>
</div>

<style>
  #matrix {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    background-color: black;
  }

  #matrix.lit {
    transition: background-color 5s ease-in-out;
    background-color: #303030;
  }

  #matrix.lit.dim {
    transition: background-color 1s linear;
    background-color: #101010;
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
    color: black;
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

  span#ellipsis {
    opacity: 0;
    transition: opacity 314ms linear;
  }

  span#ellipsis.visible {
    opacity: 1;
  }

  .dim span#ellipsis.visible {
    opacity: 0;
  }

  #question-mark {
    font-family: "Rubik", sans-serif;
    font-size: 40px;
    color: gold;
    opacity: 0;
    transition: opacity 314ms linear;
  }

  #question-mark.visible {
    opacity: 1;
  }

  .dim #question-mark.visible {
    opacity: 0;
  }
  
  span.digit {
    font-size: 30px;
    font-family: "Rubik", sans-serif;
    font-optical-sizing: auto;
    font-weight: 300;
  }

  span.digit .marked {
    color: var(--moon-glow-fill);
    font-weight: 400;
    font-size: 150%;
    visibility: hidden;
  }

  span.digit .marked.visible {
    visibility: visible;
  }

  .dim span.digit .marked.visible {
    visibility: hidden;
  }

  .dim span.digit .marked.selected.visible {
    visibility: visible;
  }

  span.digit .marked.selected {
   color: var(--moon-glow-stroke);
  }

  .x-drift {
    animation: xDrift var(--duration) linear infinite alternate;
  }

  .even .x-drift {
    transform: translateX(var(--distance));
  }
  
  .odd .x-drift {
    transform: translateX(var(--distance) * -1);
  }

  .y-drift {
    animation: yDrift var(--duration) linear infinite alternate;
  }
  
  .even .y-drift {
    transform: translateY(calc(var(--distance) * -1));
  }
  
  .odd .y-drift {
    transform: translateY(calc(var(--distance)));
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