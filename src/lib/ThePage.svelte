<script>
  import StreetLines from '$lib/StreetLines.svelte';
  import TheButton from '$lib/TheButton.svelte';
  import Curtains from '$lib/Curtains.svelte';
  import Drop from '$lib/Drop.svelte';
  import Poem from '$lib/Poem.svelte';
  import { fetchPoemLines } from '$lib/api/drive';
  import { poemIndex } from '$lib/store.js';

  let { id } = $props();

  let poemMetaData = $state($poemIndex[id]);
  let poemTitle = $derived(poemMetaData.title);
  let sefirahId = $derived(poemMetaData.sefirahId);
  let coords = $derived(poemMetaData.coordinates);
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

  let browserHeight = $state(undefined);
  let browserWidth = $state(undefined);
  let btnRadius = $state(undefined);
  let btnPxCoords = $state(undefined);
  let btnTopY = $state(undefined);
  let areDimensionsSet = $state(false);  
  
  $effect(() => {
    if (browserHeight !== undefined && browserWidth !== undefined) setDimensions();
  });

  function setDimensions() {
    btnRadius = Math.round(browserHeight / 14);
    const x = browserWidth / 2; 
    const y = browserHeight - Math.round(browserHeight * 0.05) - btnRadius; 
    btnPxCoords = [x, y];
    btnTopY = y - btnRadius;
    areDimensionsSet = true;
  }

  let areMapTilesLoaded = $state(false);
  let hasDropped = $state(false);
  let openSesame = $derived(areMapTilesLoaded && hasDropped);
  
  let areCurtainsDrawn = $state(false);
  let isPoemVisible = $derived(arePoemLinesFetched && areCurtainsDrawn);

  let isButtonVisible = $state(false);
  let isBtnReady = $state(false);

  let hitMe = $state(false);

  function pageClicked(event) {
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
  rotationFactor={ sefirahId } gild={ hitMe } on:loaded={ () => { areMapTilesLoaded = true } } />

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->  

<div id='page' onclick={ pageClicked }>
  {#if openSesame}
    <Poem title={ poemTitle } lines={ poemLines } overflowY={ btnTopY }
      typeNextLine={ hitMe } />
  {/if}
  {#if areDimensionsSet}
    <svg width="100%" height="100%">
      <Curtains w={ innerWidth } h={ innerHeight } animateIn={ openSesame } 
        on:drawn={ () => { areCurtainsDrawn = true } } />
      {#if !hasDropped}
        <Drop xCentrePx={ btnPxCoords[0] } screenHeight={ innerHeight } yEndPx={ btnPxCoords[1] }
          on:splat={ () => { hasDropped = true }} />
      {/if}
      <TheButton x={ btnPxCoords[0] } y={ btnPxCoords[1] } r={ btnRadius } 
        id={ sefirahId } lit={ hitMe } animateIn={ openSesame } />
    </svg>
  {/if}
</div>

<style>
  #page {
    position: absolute;
    inset: 0;
  }

  svg {
    position: absolute;
    inset: 0;
    z-index: 2;
    pointer-events: none;
  }
</style>