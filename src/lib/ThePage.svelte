<script>
  import StreetLines from '$lib/StreetLines.svelte';
  import TheButton from '$lib/TheButton.svelte';
  import TheIris from '$lib/TheIris.svelte';
  import { poemIndex } from '$lib/store.js';

  let { id } = $props();

  const poemMetaData = $poemIndex[id];
  let sefirahId = $derived(poemMetaData.sefirahId);
  let coords = $derived(poemMetaData.coordinates);

  let browserHeight = $state(undefined);
  let browserWidth = $state(undefined);

  let areDimensionsSet = $state(false);
  
  let btnPxCoords = $state(undefined);
  let btnRadius = $state(undefined);

  let irisClosedRadius = $state(undefined);
  let openIris = $state(false);
  let isIrisOut = $state(false);

  $effect(() => {
    if (browserHeight !== undefined && browserWidth !== undefined) setDimensions();
  });

  function setDimensions() {
    btnRadius = Math.round(browserHeight / 16);
    const x = browserWidth / 2; 
    const y = browserHeight - Math.round(browserHeight * 0.05) - btnRadius; 
    btnPxCoords = [x, y];
    irisClosedRadius = Math.ceil(Math.hypot(x, y));
    areDimensionsSet = true;
  }

</script>

<svelte:window bind:innerHeight={ browserHeight } bind:innerWidth={ browserWidth } />
<StreetLines centreCoordsGcs={ coords } centreOnPx= { btnPxCoords } rotationFactor={ Number(sefirahId) } gild={ false } />
<div id='page'>
  {#if areDimensionsSet}  
  <svg width="100%" height="100%">
    <TheIris x={ btnPxCoords[0] } y={ btnPxCoords[1] } btnRadius={ btnRadius } 
      closedRadius={ irisClosedRadius } openIris={ openIris } on:irisOut={ ()=> { isIrisOut = true } } />
    <TheButton x={ btnPxCoords[0] } y={ btnPxCoords[1] } r={ btnRadius } 
      n={ sefirahId } on:drawn={ () => { openIris = true } } showNumber={ isIrisOut } />
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