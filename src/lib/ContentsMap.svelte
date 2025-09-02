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
	import { set } from 'ol/transform';

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
        'stroke-color': 'black',
        'stroke-width': 1
      },
    });

    onAllTilesLoaded(() => {
      fadeStreetLinesIn(tileLayer);
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
      style: getMarkerStyle()
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
        zoom: 12,
        minZoom: 12,
        maxZoom: 16,
        rotation: 0.3,
        extent: viewExtent
      })
    });

    map.getView().on('change:resolution', () => {
      const currentZoom = map.getView().getZoom();
      const { radius: newRadius, width: newWidth } = setMarkerRadius(currentZoom);

      // Get current style radius/width
      const currentStyle = markerLayer.getStyle();
      const currentRadius = currentStyle?.getImage()?.getRadius() || newRadius;
      const currentWidth = currentStyle?.getImage()?.getStroke()?.getWidth() || newWidth;

      animateMarkerRadius(markerLayer, currentRadius, newRadius, currentWidth, newWidth);
    });

    map.on('click', (event) => {
      const marker = getNearestMarkerWithinClickRadius(map, event.pixel, 10, markerLayer);
      if (marker !== null) dispatch('markerClick', marker.get('id'));
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

  function animateMarkerRadius(markerLayer, startRadius, endRadius, startStrokeWidth, endStrokeWidth, duration = 600) {
    const startTime = performance.now();

      function easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      }

    function animate(now) {
      const elapsed = now - startTime;
      let t = Math.min(elapsed / duration, 1);
      t = easeInOutQuad(t); // Apply easing
      const radius = startRadius + (endRadius - startRadius) * t;
      const strokeWidth = startStrokeWidth + (endStrokeWidth - startStrokeWidth) * t;

      markerLayer.setStyle(getMarkerStyle(radius, strokeWidth));

      if (t < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
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

  function fadeStreetLinesIn(tileLayer, duration = (Math.PI * 1000)) {
    const startColor = [0, 0, 0]; // black
    const endColor = [105, 105, 105]; // dimgrey
    const startTime = performance.now();

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

    function animate(now) {
      const elapsed = now - startTime;
      let t = Math.min(Math.max(elapsed / duration, 0), 1);

      // Interpolate each channel and clamp
      const color = [
        lerp(startColor[0], endColor[0], t),
        lerp(startColor[1], endColor[1], t),
        lerp(startColor[2], endColor[2], t),
      ];
      tileLayer.setStyle({
        'stroke-color': rgbToHex(color),
        'stroke-width': 1,
      });

      if (t < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
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