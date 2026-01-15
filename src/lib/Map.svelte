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
  import { poemIndex, currentPoemId, lastPoemReadId, isPoemSelected, isEmForMatrix } from '$lib/store.js';
  import { createEventDispatcher, tick } from 'svelte';
  import { Circle as CircleGeom } from 'ol/geom.js';
  import { tweened } from 'svelte/motion';
  import { linear, quartInOut } from 'svelte/easing'

  const dispatch = createEventDispatcher();

  let isLampLit = $state(false);

  const mapBoxApiKey = import.meta.env.VITE_MAPBOX_API_KEY;
  const mvtId = 'le0nl.streets-of-toronto';
  const tileUrl = `https://api.mapbox.com/v4/${mvtId}/` +
   `{z}/{x}/{y}.vector.pbf?access_token=${mapBoxApiKey}`;
  const vectorTileSource = new VectorTileSource({
    format: new MVT(), url: tileUrl 
  });
  
  let mapEl, map, tileLayer;
  let markerFeatures = [];
  let areInitialTilesLoaded = $state(false);
  const cityExtentCoords = [-79.6993, 43.56, -79.04, 43.87];
  const viewExtent = [
    ...fromLonLat([cityExtentCoords[0], cityExtentCoords[1]]),
    ...fromLonLat([cityExtentCoords[2], cityExtentCoords[3]])
  ];

  let slugsRandomlyOrdered = $derived.by(() => {
    let slugs = Object.keys($poemIndex).sort(() => Math.random() - 0.5);
    if ($isPoemSelected) {
      slugs = slugs.filter(slug => slug !== $currentPoemId);
      slugs.unshift($currentPoemId);
    } else if ($lastPoemReadId !== undefined) {
      slugs = slugs.filter(slug => slug !== $lastPoemReadId);
      slugs.unshift($lastPoemReadId);
    }
    return slugs;
  });
  let nMarkers = $derived(slugsRandomlyOrdered.length);

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
      source: (() => {
        const source = new VectorSource({ features: markerFeatures });
        source.on('changefeature', () => {
          nVisibleMarkers = source.getFeatures().filter(f => f.get('visible')).length;
        });
        return source;
      })(),
      style: (feature) => feature.get('visible') ? newMarkerStyle(3) : null
    });

    const initialCenterCoords = $poemIndex[slugsRandomlyOrdered[0]].coordinates;

    map = new Map({
      target: node.id,
      controls: [],
      interactions: defaultInteractions({ 
        pinchRotate: false,
        doubleClickZoom: false
      }),
      layers: [tileLayer, markerLayer],
      view: new View({
        center: fromLonLat(initialCenterCoords),
        zoom: 12,
        minZoom: 12,
        maxZoom: 16,
        rotation: 0.3,
        extent: viewExtent
      })
    });

    map.getView().on('change:resolution', () => {
      const currentZoom = map.getView().getZoom();
      const radius = setMarkerRadius(currentZoom);
      markerLayer.setStyle((feature) => {
        return feature.get('visible') ? newMarkerStyle(radius) : null;
      });
    });

    map.on('click', async (event) => {
      if (areMarkersClickable) {
        const marker = getNearestMarkerWithinClickRadius(map, event.pixel, 15, markerLayer);
        if (marker !== null) $currentPoemId = marker.get('id');
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
    duration: 5000,
    easing: quartInOut,
    interpolate: (a, b) => {
      const d = b - a;
      return (t) => Math.round(a + d * t);
    }
  });

  let areMarkersClickable = $state(false);

  $effect(async () => { 
    if (areInitialTilesLoaded) {
      isLampLit = true;
      await nMarkersTween.set(nMarkers);
      areMarkersClickable = true;
    }
  });

  let nVisibleMarkers = $state(0);

  $effect(() => {
    if ($nMarkersTween < nMarkers) {
      const isShow = !$isPoemSelected;
      const slug = slugsRandomlyOrdered[$nMarkersTween];
      const marker = markerFeatures.find(f => f.get('id') === slug);
      marker.set('visible', isShow);
    }
  });
  
  $effect(() => {
    if ($isPoemSelected) nMarkersTween.set(1, { duration: 1000, easing: linear });
  });

  let wereMarkersSkippedDuringAnimeOut = $derived($nMarkersTween === 1 && nVisibleMarkers > 1);

  $effect(() => {
    if ($isPoemSelected && wereMarkersSkippedDuringAnimeOut) {
      const visibleMarkers = markerFeatures.filter(f => f.get('visible') && f.get('id') !== $currentPoemId);
      visibleMarkers.forEach(marker => marker.set('visible', false));
    } 
  });

  $effect(() => {
    if (areMarkersClickable) {
      const invisibleMarkers = markerFeatures.filter(f => !f.get('visible'));
      invisibleMarkers.forEach(marker => {
        console.log('showing marker skipped during anime in', marker);
        marker.set('visible', true);
      });
    }
  });

  $effect(() => {
    if ($isPoemSelected && nVisibleMarkers === 1) dispatch('markerSelected');
  });

  $effect(() => {
    if ($isPoemSelected && $isEmForMatrix) {
      const selectedCoords = $poemIndex[$currentPoemId].coordinates;
      map.getView().setCenter(fromLonLat(selectedCoords));
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

  let nTilesLoading = 0;
  vectorTileSource.on('tileloadstart', () => {
    nTilesLoading++;
  });
  vectorTileSource.on(['tileloadend', 'tileloaderror'], () => {
    nTilesLoading--;
    if (nTilesLoading === 0) {
      if (!areInitialTilesLoaded) areInitialTilesLoaded = true;
    }
  });

</script>

<div id='content-map' class:lit={ isLampLit } class:dim={ $isPoemSelected } 
  use:initializeMap bind:this={ mapEl }></div>

<style>
  #content-map {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: black;
  }
  
  #content-map.lit {
    transition: background-color 5s ease-in-out;
    background-color: #303030;
  }
  
  #content-map.lit.dim {
    transition: background-color 1s linear;
    background-color: #101010;
  }
</style>