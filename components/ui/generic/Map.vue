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

    <vl-layer-vector
      v-for="(company, index) in companiesWithValidLocationCoordinates"
      :key="index"
    >
      <vl-feature :id="getSecureMapFeatureId(company.id)">
        <vl-geom-point
          :coordinates="[company.coordinates.lng, company.coordinates.lat]"
        ></vl-geom-point>

        <vl-style-box>
          <vl-overlay
            v-if="currentZoom >= 14"
            :id="getSecureMapFeatureId(company.id) + 'overlay'"
            :position="[company.coordinates.lng, company.coordinates.lat]"
          >
            <div class="alert" @click="clickedBadge(company.id)">
              {{ company.name }}
            </div>
          </vl-overlay>
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

      this.clickedMarker(feature.id_)
    },

    clickedBadge(companyId) {
      this.$emit('showCompanyWithId', companyId)
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
  & .alert {
    @apply absolute bg-primary bg-opacity-50 text-white rounded-md text-xs truncate text-center px-2 leading-none py-1 cursor-pointer;

    top: -50px;
    width: 100px;
    margin-left: -50px;
  }

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
