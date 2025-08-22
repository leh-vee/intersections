<script lang="js">
  import { Map, View } from 'ol';
  import { fromLonLat } from 'ol/proj.js';
  import VectorTileLayer from 'ol/layer/VectorTile.js';
  import VectorTileSource from 'ol/source/VectorTile.js';
  import MVT from 'ol/format/MVT.js';
  import VectorLayer from 'ol/layer/Vector.js';
  import VectorSource from 'ol/source/Vector.js';
  import { Point } from 'ol/geom.js';
  import { Feature } from 'ol';
  import { Style, Circle, Fill, Stroke } from 'ol/style.js';

  let { zoom = 14, gild = false, poemCoords } = $props();
  let strokeColour = $derived(gild ? 'gold' : 'dimgrey');

  const cityCentreCoords = [-79.3805366450235, 43.7302401508249]; 
  let centreCoordsGcs = cityCentreCoords;

  $effect(() => {
    if (vectorLayer) {
      vectorLayer.setStyle({
        'stroke-color': 'dimgrey',
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
  let vectorLayer, markerLayer;

    // Create marker style function that takes zoom level
  function createMarkerStyle(zoom) {
    // Calculate radius based on zoom level (adjust the formula as needed)
    const baseRadius = 1;
    const zoomFactor = Math.max(0.5, zoom - 10); // Adjust these values to taste
    const radius = baseRadius + zoomFactor * 0.8;
    
    return new Style({
      image: new Circle({
        radius: 3,
        fill: new Fill({
          color: 'gold',
        }),
        stroke: new Stroke({
          color: 'dimgrey',
          width: 1,
        })
      }),
    });
  }

  // Initial marker style
  let markerStyle = createMarkerStyle(zoom);

  // Create markers vector source
  const markerSource = new VectorSource();

  // Function to add markers to the map
  function updateMarkers(poemCoords) {
    if (!markerSource) return;
    
    // Clear existing markers
    markerSource.clear();
    
    // Add new markers
    Object.keys(poemCoords).forEach(slug => {
      const feature = new Feature({
        geometry: new Point(fromLonLat(poemCoords[slug])),
        slug: slug,
      });
      markerSource.addFeature(feature);
    });
  }

  // Watch for changes in markers prop
  $effect(() => {
    updateMarkers(poemCoords);
  });

  function initializeMap(node, coords) {
    vectorLayer = new VectorTileLayer({
      source: vectorTileSource,
      style: {
        'stroke-color': strokeColour,
        'stroke-width': 1
      },
    });

    // Create marker layer
    markerLayer = new VectorLayer({
      source: markerSource,
      style: markerStyle,
    });
    
    map = new Map({
      target: node.id,
      controls: [],
      layers: [vectorLayer, markerLayer],
      view: new View({
        center: fromLonLat(coords),
        zoom,
        minZoom: 12,
        maxZoom: 14
      })
    });

    // Add zoom change listener to update marker styles
    map.getView().on('change:resolution', () => {
      const currentZoom = map.getView().getZoom();
      markerStyle = createMarkerStyle(currentZoom);
      markerLayer.setStyle(markerStyle);
    });

    map.on('click', (event) => {
      const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature);
      window.location.href = `${window.location.origin}/${feature.get('slug')}`;
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

<div id='map' use:initializeMap={centreCoordsGcs}></div>

<style>
  #map {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: black;
    z-index: 0;
  }
</style>