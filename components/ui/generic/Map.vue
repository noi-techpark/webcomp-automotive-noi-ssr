<template>
  <vl-map
    :load-tiles-while-animating="true"
    :load-tiles-while-interacting="true"
    data-projection="EPSG:4326"
    class="map"
    :class="{ 'is-preview': mode === 'preview' }"
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
      <vl-feature>
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
        zoom: 7,
        center: [11.341391, 46.5052233],
        rotation: 0,
      },
    }
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
