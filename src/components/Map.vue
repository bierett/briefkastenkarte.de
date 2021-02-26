<template>
  <div>
    <div class="zoom">
      <div class="mt-3">
        <v-btn v-on:click="zoomin" class="mx-2" fab dark small color="primary">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>
      <div class="mt-3">
        <v-btn v-on:click="zoomout" class="mx-2" fab dark small color="primary">
          <v-icon>mdi-minus</v-icon>
        </v-btn>
      </div>
    </div>
    <div id="map" class="map"></div>
    <!-- <Search /> -->
  </div>
</template>

<script>
/* eslint-disable */
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import { Tile as TileLayer } from 'ol/layer';
import { OSM } from 'ol/source';
import { Attribution, defaults as defaultControls } from 'ol/control';
import { fromLonLat } from 'ol/proj';

// import Search from './Search';

export default {
  name: 'Map',

  components: {
    // Search
  },

  data: () => ({}),

  async mounted() {
    let map;

    /**
     * Load map
     */
    await this.initMap();
  },
  methods: {
    initMap() {
      map = new Map({
        target: 'map',
        controls: defaultControls({
          zoom: false,
          attribution: false,
          rotate: false
        }).extend([
          new Attribution({
            collapsible: false
          })
        ]),
        layers: [
          new TileLayer({
            source: new OSM({
              attributions:
                '© <a href="https://www.openstreetmap.org/">OpenStreetMap-Mitwirkende</a>'
            })
          })
        ],
        view: new View({
          center: fromLonLat([6.789689, 51.2337549]),
          constrainResolution: true,
          showFullExtent: true,
          zoom: 11,
          maxZoom: 19
        })
      });
    },
    zoomin: e => {
      map.getView().setZoom(map.getView().getZoom() + 1);
    },
    zoomout: e => {
      map.getView().setZoom(map.getView().getZoom() - 1);
    }
  }
};
</script>
