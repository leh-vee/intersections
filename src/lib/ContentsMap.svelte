<script lang="js">
  // @ts-nocheck
  import { Map, View, Feature } from 'ol';
  import { Point } from 'ol/geom.js';
  import { fromLonLat } from 'ol/proj.js';
  import VectorLayer from 'ol/layer/Vector.js';
  import VectorSource from 'ol/source/Vector.js';
  import VectorTileSource from 'ol/source/VectorTile.js';
  import VectorTileLayer from 'ol/layer/VectorTile.js';
  import MVT from 'ol/format/MVT.js';
  import { defaults as defaultInteractions } from 'ol/interaction.js';
  import { Style, Circle, Fill, Stroke } from 'ol/style.js';
  import { poemIndex } from '$lib/store.js';
  import { createEventDispatcher } from 'svelte';
  import { Circle as CircleGeom } from 'ol/geom.js';

  const dispatch = createEventDispatcher();

  const mapBoxApiKey = import.meta.env.VITE_MAPBOX_API_KEY;
  const mvtId = 'le0nl.streets-of-toronto';
  const tileUrl = `https://api.mapbox.com/v4/${mvtId}/` +
   `{z}/{x}/{y}.vector.pbf?access_token=${mapBoxApiKey}`;
  const vectorTileSource = new VectorTileSource({
    format: new MVT(), url: tileUrl 
  });

  let markerId = $state('nobody'); 

  let map, tileLayer;
  const cityExtentCoords = [-79.6993, 43.56, -79.04, 43.87];
  const viewExtent = [
    ...fromLonLat([cityExtentCoords[0], cityExtentCoords[1]]),
    ...fromLonLat([cityExtentCoords[2], cityExtentCoords[3]])
  ];

  function initializeMap(node) {    
    tileLayer = new VectorTileLayer({
      source: vectorTileSource,
      style: {
        'stroke-color': 'dimgrey',
        'stroke-width': 1
      },
    });

    const slugs = Object.keys($poemIndex);
    const randomPoemCoords = $poemIndex[slugs[Math.floor(Math.random() * slugs.length)]].coordinates;

    const markerFeatures = slugs.map(slug => {
      const p = $poemIndex[slug];
      return new Feature({ 
        geometry: new Point(fromLonLat(p.coordinates)),
        id: slug
      });  
    }); 
    const markerLayer = new VectorLayer({
      source: new VectorSource({ features: markerFeatures }), 
      style: new Style({
        image: new Circle({
          radius: 4,
          fill: new Fill({ color: 'yellow' }),
          stroke: new Stroke({ color: 'dimgrey', width: 1 })
        })
      })
    });

    map = new Map({
      target: node.id,
      controls: [],
      interactions: defaultInteractions({ 
        pinchRotate: false,
        doubleClickZoom: false
      }),
      layers: [tileLayer, markerLayer],
      view: new View({
        center: fromLonLat(randomPoemCoords),
        zoom: 13,
        minZoom: 12,
        maxZoom: 16,
        rotation: 0.3,
        extent: viewExtent
      })
    });

     map.on('click', (event) => {
      const features = getFeaturesWithinPixelRadius(map, event.pixel, 20, markerLayer);
      if (features.length > 0) {
        dispatch('markerClick', features[0].get('id'));
      }
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

  function getFeaturesWithinPixelRadius(map, pixel, pixelRadius, markerLayer) {
    const coordinate = map.getCoordinateFromPixel(pixel);
    const resolution = map.getView().getResolution();
    const mapRadius = pixelRadius * resolution;

    // Create a circular geometry (buffer)
    const circle = new CircleGeom(coordinate, mapRadius);

    // Get all features in the marker layer
    const features = markerLayer.getSource().getFeatures();

    // Filter features whose geometry intersects the circle
    return features.filter(f => {
      return circle.intersectsExtent(f.getGeometry().getExtent());
    });
  }
</script>

<div id='map' use:initializeMap></div>

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