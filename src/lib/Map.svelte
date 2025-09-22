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
  import { animate } from '$lib/util.js';
  import Supernova from '$lib/Supernova.svelte';

  const dispatch = createEventDispatcher();

  const mapBoxApiKey = import.meta.env.VITE_MAPBOX_API_KEY;
  const mvtId = 'le0nl.streets-of-toronto';
  const tileUrl = `https://api.mapbox.com/v4/${mvtId}/` +
   `{z}/{x}/{y}.vector.pbf?access_token=${mapBoxApiKey}`;
  const vectorTileSource = new VectorTileSource({
    format: new MVT(), url: tileUrl 
  });

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
        'stroke-color': 'black',
        'stroke-width': 1
      },
    });

    onAllTilesLoaded(() => { areTilesLoaded = true });

    const slugs = Object.keys($poemIndex);
    const initialCtrCoords = [-79.55, 43.675];

    const markerFeatures = slugs.map(slug => {
      const p = $poemIndex[slug];
      return new Feature({ 
        geometry: new Point(fromLonLat(p.coordinates)),
        id: slug
      });  
    }); 

    const markerLayer = new VectorLayer({
      source: new VectorSource({ features: markerFeatures }), 
      style: getMarkerStyle(0, 0)
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
        center: fromLonLat(initialCtrCoords),
        zoom: 12,
        minZoom: 12,
        maxZoom: 16,
        rotation: 0.3,
        extent: viewExtent
      })
    });

    let nMarkersFadedIn = 0;
    markerFeatures.forEach((marker, i) => {
      const randomDuration = 1000 + Math.random() * (Math.PI * 1000 - 1000); // 1s to π s
      animateMarker(marker, 2, randomDuration, () => {
          nMarkersFadedIn++;
          if (nMarkersFadedIn === markerFeatures.length) {
            markerLayer.setStyle(getMarkerStyle(2, 0));
            markerFeatures.forEach(m => m.setStyle(null));
            areMarkersFadedIn = true;
          }
        }
      );
    });

    map.getView().on('change:resolution', () => {
      const currentZoom = map.getView().getZoom();
      const { radius: newRadius, width: newWidth } = setMarkerRadius(currentZoom);

      // Get current style radius/width
      const currentStyle = markerLayer.getStyle();
      const currentRadius = currentStyle?.getImage()?.getRadius() || newRadius;
      const currentWidth = currentStyle?.getImage()?.getStroke()?.getWidth() || newWidth;

      animateMarkers(markerLayer, currentRadius, newRadius, currentWidth, newWidth);
    });

    map.on('click', (event) => {
      const marker = getNearestMarkerWithinClickRadius(map, event.pixel, 15, markerLayer);
      if (marker !== null) {
        const coord = marker.getGeometry().getCoordinates();
        const pixel = map.getPixelFromCoordinate(coord);
        const mapRect = map.getTargetElement().getBoundingClientRect();
        const left =  pixel[0] + mapRect.left;
        const top = pixel[1] + mapRect.top;

        supernovaBoundingBox = { left, top };
        selectedMarkerId = marker.get('id');
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

  function animateMarkers(markerLayer, startRadius, endRadius, startStrokeWidth, endStrokeWidth, duration = 1000) {
    animate({
      duration,
      onUpdate: (t) => {
        const radius = startRadius + (endRadius - startRadius) * t;
        const strokeWidth = startStrokeWidth + (endStrokeWidth - startStrokeWidth) * t;
        markerLayer.setStyle(getMarkerStyle(radius, strokeWidth));
      }
    });
  }

  function animateMarker(marker, endRadius, duration = 1000, onDone) {
    animate({
      duration,
      onUpdate: (t) => {
        const radius = endRadius * t;
        marker.setStyle(getMarkerStyle(radius, 0));
      },
      onDone
    });
  }

  function setMarkerRadius(zoom) {
    let radius, width;
    if (zoom >= 12 && zoom < 13) {
      radius = 2;
      width = 0;
    } else if (zoom >= 13 && zoom < 13.5) {
      radius = 2;
      width = 0;
    } else if (zoom >= 13.5 && zoom < 14) {
      radius = 3;
      width = 1;
    } else if (zoom >= 14 && zoom < 14.5) {
      radius = 4;
      width = 1;
    } else if (zoom >= 14.5 && zoom < 15) {
      radius = 5;
      width = 1.5;
    } else if (zoom >= 15 && zoom < 15.5) {
      radius = 6;
      width = 1.5;
    } else if (zoom >= 15.5 && zoom < 16) {
      radius = 6;
      width = 2;
    } else if (zoom >= 16) {
      radius = 7;
      width = 2;
    }
    return { radius, width };
  }

  function getMarkerStyle(radius = 2, strokeWidth = 0) {
    return new Style({
      image: new Circle({
        radius,
        fill: new Fill({ color: 'gold' }),
        stroke: new Stroke({ color: 'dimgrey', width: strokeWidth })
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

  let areTilesLoaded = $state(false);
  let areMarkersFadedIn = $state(false);

  $effect(() => {
    if (areTilesLoaded && areMarkersFadedIn) {
      fadeStreetLinesIn();
    }
  });

  function fadeStreetLinesIn(duration = (Math.PI * 1000)) {
    const startColor = [0, 0, 0]; // black
    const endColor = [105, 105, 105]; // dimgrey

    function lerp(a, b, t) {
      return a + (b - a) * t;
    }
    function clamp(x, min, max) {
      return Math.max(min, Math.min(max, x));
    }
    function rgbToHex([r, g, b]) {
      return (
        '#' +
        [r, g, b]
          .map((x) => {
            const hex = Math.round(clamp(x, 0, 255)).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
          })
          .join('')
      );
    }

    animate({
      duration,
      onUpdate: (t) => {
        const color = [
          lerp(startColor[0], endColor[0], t),
          lerp(startColor[1], endColor[1], t),
          lerp(startColor[2], endColor[2], t),
        ];
        tileLayer.setStyle({
          'stroke-color': rgbToHex(color),
          'stroke-width': 1,
        });
      }
    });
  }

  let supernovaBoundingBox = $state(null);
  let selectedMarkerId = null;
  let isSupernova = $derived(supernovaBoundingBox !== null);

  function markerSelected() {
    dispatch('markerSelected', selectedMarkerId);
    supernovaBoundingBox = null;
  }

</script>

<div id='content-map' use:initializeMap></div>
{#if isSupernova}
  <Supernova bb={ supernovaBoundingBox } on:goneNova={ markerSelected } />
{/if}

<style>
  #content-map {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: black;
  }
</style>