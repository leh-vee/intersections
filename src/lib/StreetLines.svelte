<script>
  import { Map, View } from 'ol';
  import { fromLonLat } from 'ol/proj.js';
  import VectorTileLayer from 'ol/layer/VectorTile.js';
  import VectorTileSource from 'ol/source/VectorTile.js';
  import MVT from 'ol/format/MVT.js';

  let { centreCoordsGcs, zoom = 16, gild = false, centreOnPx, rotationFactor = 0 } = $props();
  let strokeColour = $derived(gild ? 'gold' : 'dimgrey');
  let isMapVisible = $state(false);

  $effect(() => {
    if (vectorLayer) {
      vectorLayer.setStyle({
        'stroke-color': strokeColour,
        'stroke-width': 1
      });
    }
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

    let rotation = (rotationFactor === 0) ? 0 : (2 * Math.PI / 9 * rotationFactor) + 0.3;
    
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

  let tilesLoading = 0;
  let tilesLoaded = 0;
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