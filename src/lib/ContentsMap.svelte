<script>
  import { Map, View, Feature } from 'ol';
  import { Point } from 'ol/geom.js';
  import { fromLonLat } from 'ol/proj.js';
  import VectorLayer from 'ol/layer/Vector.js';
  import VectorSource from 'ol/source/Vector.js';
  import VectorTileSource from 'ol/source/VectorTile.js';
  import VectorTileLayer from 'ol/layer/VectorTile.js';
  import MVT from 'ol/format/MVT.js';
  import { Style, Circle, Fill, Stroke } from 'ol/style.js';
  import { poemIndex } from '$lib/store.js';

  const mapBoxApiKey = import.meta.env.VITE_MAPBOX_API_KEY;
  const mvtId = 'le0nl.streets-of-toronto';
  const tileUrl = `https://api.mapbox.com/v4/${mvtId}/` +
   `{z}/{x}/{y}.vector.pbf?access_token=${mapBoxApiKey}`;
  const vectorTileSource = new VectorTileSource({
    format: new MVT(), url: tileUrl 
  });

  let map, tileLayer;
  const cityCentreCoords = [-79.3805366450235, 43.7302401508249];

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
          radius: 2,
          fill: new Fill({ color: 'gold' }),
          // stroke: new Stroke({ color: 'dimgrey', width: 1 })
        })
      })
    });

    map = new Map({
      target: node.id,
      controls: [],
      layers: [tileLayer, markerLayer],
      view: new View({
        center: fromLonLat(randomPoemCoords),
        zoom: 12,
        minZoom: 12,
        maxZoom: 15,
        rotation: 0.3
      })
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