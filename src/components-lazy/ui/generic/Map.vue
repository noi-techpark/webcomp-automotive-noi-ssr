<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <vl-map
    ref="map"
    :load-tiles-while-animating="true"
    :load-tiles-while-interacting="true"
    data-projection="EPSG:4326"
    :aria-hidden="mode === 'preview'"
    class="map"
    :class="{ 'is-preview': mode === 'preview' }"
    @singleclick="clickedMap"
    @moveend="handleMapMove"
  >
    <vl-view
      :tabindex="mode === 'preview' ? -1 : 0"
      :zoom.sync="mapConfig.zoom"
      :center.sync="mapConfig.center"
      :rotation.sync="mapConfig.rotation"
    ></vl-view>

    <vl-layer-tile id="osm">
      <vl-source-osm></vl-source-osm>
    </vl-layer-tile>

      <vl-layer-vector>
        <vl-source-cluster :distance="45">
          <vl-source-vector :features="points"></vl-source-vector>
        </vl-source-cluster>
        <vl-style-func :factory="markerStyleFunc" />
    </vl-layer-vector>
  </vl-map>
</template>

<script>
import Vue from 'vue'
import VueLayers from 'vuelayers'

import Style from 'ol/style/Style'
import OlIcon from 'ol/style/Icon'
import CircleShape from 'ol/style/Circle'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'
import OlText from 'ol/style/Text'
import utils from '~/mixins/utils.js'

Vue.use(VueLayers)

export default {
  mixins: [utils],
  props: {
    visibleCompanies: {
      type: Array,
      required: true,
    },
    mode: {
      type: String,
      default: 'default',
      validator(value) {
        return ['default', 'preview'].includes(value)
      },
    },
  },

  data() {
    return {
      mapConfig: {
        zoom: 9,
        center: [11.341391, 46.5052233],
        rotation: 0,
      },

      currentZoom: 2,
    }
  },

  computed: {
    companiesWithValidLocationCoordinates() {
      return this.visibleCompanies.filter((company) =>
        this.hasCompanyValidCoordinates(company)
      )
    },
    points() {
      return this.getCoordinatesOfCompanies(this.companiesWithValidLocationCoordinates) || []
    },
    mapMarker() {
      return new OlIcon({
        color: this.getConfigProperty('primaryColor'),
        crossOrigin: 'anonymous',
        src: 'data:image/svg+xml;utf8,' +
          '<svg width="120" height="120" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">' +
            '<!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->' +
            '<path fill="white" d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/>' +
            '<path fill="white" fill-opacity="0.1" d="M 106.66666,106.66666 H 277.33333 V 277.33333 H 106.66666 Z" />' +
          '</svg>',
        scale: 0.25,
      });
    },
    clusterIcon() {
      const clusterIcons = Array(3);
      const circleShape = new CircleShape({
        fill: new Fill({ color: this.getConfigProperty('primaryColor') }),
        radius: 10,
      });
      clusterIcons[0] = circleShape.clone();
      circleShape.setRadius(13);
      clusterIcons[1] = circleShape.clone();
      circleShape.setRadius(16);
      clusterIcons[2] = circleShape;
      return clusterIcons;
    }
  },

  mounted() {
    // Add eventListener to update map size and re-render map
    this.$root.$on('refreshMap', () => {
        this.$refs.map?.refresh()
    })
  },

  methods: {
    hasCompanyValidCoordinates(company) {
      return (
        Number(company.coordinates.lng) &&
        Number(company.coordinates.lat) &&
        Number(company.coordinates.lng) !== 0 &&
        Number(company.coordinates.lat) !== 0
      )
    },

    getSecureMapFeatureId(companyId) {
      return companyId + '-' + new Date().getTime()
    },

    getCompanyIdFromMapFeatureId(mapFeatureId) {
      return Number(mapFeatureId.split('-')[0])
    },

    getCompany(companyID) {
      return this.companiesWithValidLocationCoordinates.find(company => company.id === companyID);
    },

    getCompanyFromMapFeatureID(mapFeatureId) {
      return this.getCompany(this.getCompanyIdFromMapFeatureId(mapFeatureId));
    },

    handleMapMove() {
      this.currentZoom = this.$refs.map.getView().getZoom()
    },

    async clickedMap(mapData) {
      const feature = await this.$refs.map.forEachFeatureAtPixel(
        mapData.pixel,
        function (feature) {
          return feature
        }
      )

      if (!feature) {
        return
      }
      if (feature?.values_?.features.length === 1)
        // feature.values_?.features[0]?.id_ = MapFeatureId
        this.clickedMarker(feature.values_?.features[0]?.id_)
      else {
        // Zoom to the cluster
        this.$refs.map.getView().animate({
          zoom: this.$refs.map.getView().getZoom() + 2,
          duration: 250,
          anchor: feature?.values_?.geometry?.flatCoordinates,
        })
      }
    },

    clickedMarker(mapFeatureId) {
        this.$emit(
          'showCompanyWithId',
          this.getCompanyIdFromMapFeatureId(mapFeatureId)
        )
    },

    /**
     * @param companies: Array of companies, for example companiesWithValidLocationCoordinates
     *
     * @returns Array in GeoJSON Format
     */
    getCoordinatesOfCompanies(companies) {
      const ret = [];
      for (const company of companies) {
        const {
          lat,
          lng,
          type = 'Feature',
          id = this.getSecureMapFeatureId(company.id),
          geometry = { type: 'Point', coordinates: [lng, lat] },
        } = company.coordinates;
        ret.push({ lat, lng, type, id, geometry });
      }
      return ret;
    },

    textFormatForMarkerStyleFunc(mapFeatureId) {
      let ret = this.getCompanyFromMapFeatureID(mapFeatureId)?.name;
      if (ret.length > 20) {
        ret = ret.substring(0, 17) + "...";
      }
      return ret
    },

    getClusterIconAccordingToSize(size) {
      if(size < 10) {
        return this.clusterIcon[0];
      } else if (size < 50) {
        return this.clusterIcon[1];
      } else {
        return this.clusterIcon[2];
      }
    },

    markerStyleFunc() {
      return (feature) => {
        const clustersize = feature?.values_?.features.length;
        this.curFeatureIndex++
        const baseStyle = new Style({
          image: clustersize <= 1 ? this.mapMarker : this.getClusterIconAccordingToSize(clustersize),
          text: clustersize <= 1 ? new OlText({
            text: this.currentZoom >= 14 ? this.textFormatForMarkerStyleFunc(feature?.values_?.features[0]?.id_) : undefined,
            fill: new Fill({ color: this.getTextColor(this.getConfigProperty('primaryColor')) }),
            backgroundFill: new Fill({ color: this.primarycolor }),
            textAlign: 'center',
            offsetY: -25,
            scale: 1.2,
            backgroundStroke: new Stroke({
              color: this.primarycolor,
              width: 5,
            }),
            padding: [1.25, 1.75, 1.25, 1.75]
          }) : new OlText({
            text: "" + clustersize,
            fill: new Fill({ color: this.getTextColor(this.getConfigProperty('primaryColor')) }),
            offsetY: 1,
            textAlign: 'center',
            scale: clustersize < 10 ? 1 : clustersize < 50 ? 1.3 : 1.4,
          }),
          zIndex: this.curFeatureIndex,
        })
        return [baseStyle];
      };
    }
  },
}
</script>

<style lang="postcss" scoped>
.map {
  @apply w-full h-full;
}
</style>

<style lang="postcss">
.map {
  & .alert {
    @apply absolute bg-primary bg-opacity-50 text-white rounded-md text-xs truncate text-center px-2 leading-none py-1 cursor-pointer;

    top: -50px;
    width: 100px;
    margin-left: -50px;
  }

  & .vl-zoom {
    top: auto !important;
    left: auto !important;
    bottom: 30px;
    right: 10px;
  }

  &.is-preview {
    & .vl-zoom {
      display: none !important;
    }
  }
}
</style>
