<script>
  import StreetLines from '$lib/StreetLines.svelte';
  import TheButton from '$lib/TheButton.svelte';
  import Iris from '$lib/Iris.svelte';
  import Poem from '$lib/Poem.svelte';
  import { fetchPoemLines } from '$lib/api/drive';
  import { poemIndex } from '$lib/store.js';

  let { id } = $props();

  let poemMetaData = $state($poemIndex[id]);

  let poemTitle = $derived(poemMetaData.title);
  let poemLines = $state([]);

  let arePoemLinesFetched = $derived(poemLines.length > 0);

  $effect(() => {
    if (!arePoemLinesFetched) {
      (async () => {
        const lines = await fetchPoemLines(poemMetaData.docId);
        poemLines = lines;
      })();
    }
  });

  let sefirahId = $derived(poemMetaData.sefirahId);
  let coords = $derived(poemMetaData.coordinates);

  let browserHeight = $state(undefined);
  let browserWidth = $state(undefined);

  let areDimensionsSet = $state(false);
  
  let btnPxCoords = $state(undefined);
  let btnRadius = $state(undefined);

  let irisRadius = $state(undefined);
  let isIrisWipedOpen = $state(false);

  let perspectivalRadians = $derived.by(() => {
    const rotationFactor = Number(sefirahId);
    let rad = 0;
    if (rotationFactor !== 0) {
      rad = (2 * Math.PI / 9 * rotationFactor) + 0.3;
    }
    return rad;
  });

  let perspectivalDegrees = $derived(perspectivalRadians * (180 / Math.PI));

  let isPoemVisible = $derived(arePoemLinesFetched && isIrisWipedOpen);
  
  $effect(() => {
    if (browserHeight !== undefined && browserWidth !== undefined) setDimensions();
  });

  function setDimensions() {
    btnRadius = Math.round(browserHeight / 14);
    const x = browserWidth / 2; 
    const y = browserHeight - Math.round(browserHeight * 0.05) - btnRadius; 
    btnPxCoords = [x, y];
    irisRadius = Math.ceil(Math.hypot(x, y));
    areDimensionsSet = true;
  }

  let hitMe = $state(false);

  function clicked(event) {
    if (isPoemVisible && isBtnClick(event.clientX, event.clientY)) {
      hitMe = true;
      setTimeout(() => {
        hitMe = false;
      }, Math.PI); 
    }
  }

  function isBtnClick(x, y) {
    const dx = x - btnPxCoords[0];
    const dy = y - btnPxCoords[1];

    return (dx * dx + dy * dy) <= (btnRadius * btnRadius);
  }

</script>

<svelte:window bind:innerHeight={ browserHeight } bind:innerWidth={ browserWidth } />
<StreetLines centreCoordsGcs={ coords } centreOnPx= { btnPxCoords } 
  rotation={ perspectivalRadians } gild={ hitMe } />
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->  
<div id='page' onclick={ clicked }>
  {#if isPoemVisible}
    <Poem title={ poemTitle } lines={ poemLines } typeNextLine = { hitMe } />
  {/if}
  {#if areDimensionsSet}
    <svg width="100%" height="100%">
      <TheButton x={ btnPxCoords[0] } y={ btnPxCoords[1] } r={ btnRadius } 
        id={ sefirahId } showId={ isIrisWipedOpen } lit={ hitMe } />
      {#if !isIrisWipedOpen}
        <Iris x={ btnPxCoords[0] } y={ btnPxCoords[1] } r={ irisRadius }
          wipeStartAngle={ perspectivalDegrees } on:wiped={ () => { isIrisWipedOpen = true } } />
        {/if}
    </svg>
  {/if}
</div>

<style>
  #page {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }
</style>