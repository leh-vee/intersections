<script>
  import { Map, View } from 'ol';
  import { fromLonLat } from 'ol/proj.js';
  import VectorTileLayer from 'ol/layer/VectorTile.js';
  import VectorTileSource from 'ol/source/VectorTile.js';
  import MVT from 'ol/format/MVT.js';
  import { tweened } from 'svelte/motion';
  import { sineIn } from 'svelte/easing';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let { centreCoordsGcs, zoom = 16, gild = false, centreOnPx, rotationFactor = 0, dim } = $props();
  
  let isMapVisible = $state(false);

  const goldRgb = [255, 215, 0];
  const dimGreyRgb = [105, 105, 105];
  const strokeRgb = tweened(goldRgb, { duration: 3141, easing: sineIn });

  let strokeColour = $derived.by(() => {
    let [r, g, b] = $strokeRgb;
    if (gild) {
      [r, g, b] = goldRgb;
    }
    return `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
  }); 

  $effect(() => {
    if (dim) strokeRgb.set(dimGreyRgb);
  });

  $effect(() => {
    if (vectorLayer) {
      vectorLayer.setStyle({
        'stroke-color': strokeColour,
        'stroke-width': 1
      });
    }
  });

  let rotation = $derived.by(() => {
    const factor = Number(rotationFactor);
    let rad = 0;
    if (factor !== 0) {
      rad = (2 * Math.PI / 9 * factor) + 0.3;
    }
    return rad;
  });

  const mapBoxApiKey = import.meta.env.VITE_MAPBOX_API_KEY;
  const mvtId = 'le0nl.streets-of-toronto';
  const tileUrl = `https://api.mapbox.com/v4/${mvtId}/` +
   `{z}/{x}/{y}.vector.pbf?access_token=${mapBoxApiKey}`;
  const vectorTileSource = new VectorTileSource({
    format: new MVT(), url: tileUrl 
  });

  let map = null;
  let vectorLayer = null;

  function initializeMap(node, coords) {
    vectorLayer = new VectorTileLayer({
      source: vectorTileSource,
      style: {
        'stroke-color': strokeColour,
        'stroke-width': 1
      },
    });
    
    map = new Map({
      target: node.id,
      controls: [],
      layers: [vectorLayer],
      view: new View({
        center: fromLonLat(coords),
        zoom,
        minZoom: zoom,
        maxZoom: zoom,
        rotation
      })
    });

    map.once('rendercomplete', () => {
      const size = map.getSize();
      map.getView().centerOn(fromLonLat(coords), size, centreOnPx);
      isMapVisible = true;
    });

    return {
      destroy() {
        if (map) {
          map.setTarget(undefined);
          map = null;
        }
      }
    }
  }

  let tilesLoading = $state(0);
  let tilesLoaded = $state(0);

  $effect(() => {
    if (isMapVisible && tilesLoaded === tilesLoading) {
      dispatch('loaded');
    }
  });

  vectorTileSource.on('tileloadstart', () => {
    tilesLoading += 1;
  });
  vectorTileSource.on(['tileloadend', 'tileloaderror'], () => { tilesLoaded += 1 });
  
</script>

<div id='map' use:initializeMap={centreCoordsGcs}
  style="visibility: {isMapVisible ? 'visible' : 'hidden'}"></div>

<style>
  #map {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }
</style>