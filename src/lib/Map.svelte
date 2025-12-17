<script lang="js">
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
  import { tweened } from 'svelte/motion';
  import { quartInOut } from 'svelte/easing'

  const dispatch = createEventDispatcher();

  const mapBoxApiKey = import.meta.env.VITE_MAPBOX_API_KEY;
  const mvtId = 'le0nl.streets-of-toronto';
  const tileUrl = `https://api.mapbox.com/v4/${mvtId}/` +
   `{z}/{x}/{y}.vector.pbf?access_token=${mapBoxApiKey}`;
  const vectorTileSource = new VectorTileSource({
    format: new MVT(), url: tileUrl 
  });

  let mapEl, map, tileLayer, markerFeatures;
  const cityExtentCoords = [-79.6993, 43.56, -79.04, 43.87];
  const viewExtent = [
    ...fromLonLat([cityExtentCoords[0], cityExtentCoords[1]]),
    ...fromLonLat([cityExtentCoords[2], cityExtentCoords[3]])
  ];

  const slugsRandomlyOrdered = Object.keys($poemIndex).sort(() => Math.random() - 0.5);
  const nMarkers = slugsRandomlyOrdered.length;
  const centreCoords = $poemIndex[slugsRandomlyOrdered[0]].coordinates;

  let lit = $state(false);

  function initializeMap(node) {    
    tileLayer = new VectorTileLayer({
      source: vectorTileSource,
      style: {
        'stroke-color': 'black',
        'stroke-width': 1
      },
    });

    markerFeatures = slugsRandomlyOrdered.map(slug => {
      const p = $poemIndex[slug];
      return new Feature({ 
        geometry: new Point(fromLonLat(p.coordinates)),
        id: slug,
        visible: false
      });  
    }); 

    const markerLayer = new VectorLayer({
      source: new VectorSource({ features: markerFeatures }), 
      style: (feature) => {
        return feature.get('visible') ? newMarkerStyle(3) : null;
      }
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
        center: fromLonLat(centreCoords),
        zoom: 12,
        minZoom: 12,
        maxZoom: 16,
        rotation: 0.3,
        extent: viewExtent
      })
    });

    onAllTilesLoaded(async () => { 
      console.log('tiles loaded...');
      lit = true;
      await nMarkersTween.set(nMarkers);
    });

    map.getView().on('change:resolution', () => {
      const currentZoom = map.getView().getZoom();
      const radius = setMarkerRadius(currentZoom);
      markerLayer.setStyle((feature) => {
        return feature.get('visible') ? newMarkerStyle(radius) : null;
      });
    });

    map.on('click', (event) => {
      const marker = getNearestMarkerWithinClickRadius(map, event.pixel, 15, markerLayer);
      if (marker !== null) {
        lit = false;
        selectedMarkerId = marker.get('id');
        dispatch('markerSelected', selectedMarkerId);
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

  const nMarkersTween = tweened(0, {
    duration: 10000,
    easing: quartInOut
  });
  let nVisibleMarkers = $derived(Math.round($nMarkersTween));

  $effect(() => {
    if (nVisibleMarkers > 0) {
      const slug = slugsRandomlyOrdered[nVisibleMarkers - 1];
      const marker = markerFeatures.find(f => f.get('id') === slug);
      marker.set('visible', true);
    }
  });

  function getNearestMarkerWithinClickRadius(map, pixel, pixelRadius, markerLayer) {
    const coordinate = map.getCoordinateFromPixel(pixel);
    const resolution = map.getView().getResolution();
    const mapRadius = pixelRadius * resolution;

    // Create a circular geometry (buffer)
    const circle = new CircleGeom(coordinate, mapRadius);

    // Get all features in the marker layer
    const features = markerLayer.getSource().getFeatures();

    // Filter features whose geometry intersects the circle
    const intersectingFeatures = features.filter(f => {
      return circle.intersectsExtent(f.getGeometry().getExtent());
    });

    let closestFeature = null;
    
    if (intersectingFeatures.length === 1) {  
      closestFeature = intersectingFeatures[0];
    } else if (intersectingFeatures.length > 1) {
      let minDist = Infinity;
  
      for (const feature of intersectingFeatures) {
        const geom = feature.getGeometry();
        const coord = geom.getCoordinates();
        const featurePixel = map.getPixelFromCoordinate(coord);
        const dx = featurePixel[0] - pixel[0];
        const dy = featurePixel[1] - pixel[1];
        const dist = Math.sqrt(dx * dx + dy * dy);
  
        if (dist <= pixelRadius && dist < minDist) {
          minDist = dist;
          closestFeature = feature;
        }
      }
    }

    return closestFeature;
  }

  function setMarkerRadius(zoom) {
    let radius;
    if (zoom >= 12 && zoom < 13.5) {
      radius = 3;
    } else if (zoom >= 13.5 && zoom < 14) {
      radius = 4;
    } else if (zoom >= 14 && zoom < 14.5) {
      radius = 5;
    } else if (zoom >= 14.5 && zoom < 15) {
      radius = 6;
    } else if (zoom >= 15 && zoom < 15.5) {
      radius = 8;
    } else if (zoom >= 15.5 && zoom < 16) {
      radius = 9;
    } else if (zoom >= 16) {
      radius = 10;
    }
    return radius;
  }

  function newMarkerStyle(radius) {
    return new Style({
      image: new Circle({
        radius: radius,
        fill: new Fill({ color: 'gold' })
      })
    })
  }

  function onAllTilesLoaded(callback) {
    let loading = 0;
    vectorTileSource.on('tileloadstart', () => {
      loading++;
    });
    vectorTileSource.on(['tileloadend', 'tileloaderror'], () => {
      loading--;
      if (loading === 0) {
        callback();
      }
    });
  }

  let selectedMarkerId = null;

</script>

<div id='content-map' class:lit use:initializeMap bind:this={ mapEl }></div>

<style>
  #content-map {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: black;
    transition: background-color 10s ease-in;
  }

  #content-map.lit {
    background-color: #303030;
  }
</style>