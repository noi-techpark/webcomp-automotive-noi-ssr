<template>
  <vl-map
    ref="map"
    :load-tiles-while-animating="true"
    :load-tiles-while-interacting="true"
    data-projection="EPSG:4326"
    class="map"
    :class="{ 'is-preview': mode === 'preview' }"
    @singleclick="clickedMap"
  >
    <vl-view
      :zoom.sync="mapConfig.zoom"
      :center.sync="mapConfig.center"
      :rotation.sync="mapConfig.rotation"
    ></vl-view>

    <vl-layer-tile id="osm">
      <vl-source-osm></vl-source-osm>
    </vl-layer-tile>

    <vl-layer-vector v-for="(company, index) in visibleCompanies" :key="index">
      <vl-feature :id="getSecureMapFeatureId(company.id)">
        <vl-geom-point
          :coordinates="[company.coordinates.lng, company.coordinates.lat]"
        ></vl-geom-point>

        <vl-style-box>
          <vl-style-fill color="white"></vl-style-fill>
          <vl-style-stroke color="red"></vl-style-stroke>
          <vl-style-icon
            src="/image/marker.png"
            :anchor="[0.5, 1]"
            :scale="0.1"
          ></vl-style-icon>
        </vl-style-box>
      </vl-feature>
    </vl-layer-vector>
  </vl-map>
</template>

<script>
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
        zoom: 8,
        center: [11.341391, 46.5052233],
        rotation: 0,
      },
    }
  },

  methods: {
    getSecureMapFeatureId(companyId) {
      return companyId + '-' + new Date().getTime()
    },

    getCompanyIdFromMapFeatureId(mapFeatureId) {
      return Number(mapFeatureId.split('-')[0])
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

      this.clickedMarker(feature.id_)
    },

    clickedMarker(mapFeatureId) {
      this.$emit(
        'showCompanyWithId',
        this.getCompanyIdFromMapFeatureId(mapFeatureId)
      )
    },
  },
}
</script>

<style lang="postcss" scoped>
.map {
  @apply h-full;
}
</style>

<style lang="postcss">
.map {
  & .ol-zoom {
    top: auto !important;
    left: auto !important;
    bottom: 30px;
    right: 10px;
  }

  &.is-preview {
    & .ol-zoom {
      display: none !important;
    }
  }
}
</style>
