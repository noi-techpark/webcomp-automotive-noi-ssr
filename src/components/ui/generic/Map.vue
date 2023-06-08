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
    class="map"
    :class="{ 'is-preview': mode === 'preview' }"
    @singleclick="clickedMap"
    @moveend="handleMapMove"
  >
    <vl-view
      :zoom.sync="mapConfig.zoom"
      :center.sync="mapConfig.center"
      :rotation.sync="mapConfig.rotation"
    ></vl-view>

    <vl-layer-tile id="osm">
      <vl-source-osm></vl-source-osm>
    </vl-layer-tile>

      <vl-layer-vector>
        <vl-source-cluster :distance="20">
          <vl-source-vector :features="points"></vl-source-vector>
        </vl-source-cluster>
        <vl-style-func :factory="markerStyleFunc" />
    </vl-layer-vector>
  </vl-map>
</template>

<script>
import Vue from 'vue'
import VueLayers from 'vuelayers'
import 'vuelayers/lib/style.css'

import Style from 'ol/style/Style'
import OlIcon from 'ol/style/Icon'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'
import OlText from 'ol/style/Text'

Vue.use(VueLayers)

export default {
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
      return this.getCoordinatesOfCompanies(this.companiesWithValidLocationCoordinates);
    },
    mapMarker() {
      return new OlIcon({
        src: "https://cdn.webcomponents.opendatahub.testingmachine.eu/dist/e3df9ad8-e78f-48d8-88d2-089657d27de5/marker.png",
        scale: 0.1,
      });
    },
    clusterIcon() {
      return new OlIcon({
        src: "https://upload.wikimedia.org/wikipedia/commons/e/ec/RedDot.svg", // https://it.m.wikipedia.org/wiki/File:RedDot.svg
        scale: 1.5,
      });
    }
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

    clickedMap(mapData) {
      const feature = this.$refs.map.forEachFeatureAtPixel(
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

    markerStyleFunc() {
      // style function and styles using OpenLayers API
      // https://openlayers.org/en/latest/apidoc/module-ol_style_Style.html
      return (feature) => {
        this.curFeatureIndex++
        const baseStyle = new Style({
          image: feature?.values_?.features.length <= 1 ? this.mapMarker : this.clusterIcon,
          text: feature?.values_?.features.length <= 1 ? new OlText({
            text: this.currentZoom >= 14 ? this.textFormatForMarkerStyleFunc(feature?.values_?.features[0]?.id_) : undefined,
            fill: new Fill({ color: '#e5e7eb' }),
            backgroundFill: new Fill({ color: '#c70000' }),
            textAlign: 'center',
            offsetY: -25,
            scale: 1.2,
            backgroundStroke: new Stroke({
              color: '#c70000',
              width: 5,
            }),
            padding: [1.25, 1.75, 1.25, 1.75]
          }) : new OlText({
            text: "" + feature?.values_?.features.length,
            fill: new Fill({ color: '#e5e7eb' }),
            offsetY: 1,
            textAlign: 'center',
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
