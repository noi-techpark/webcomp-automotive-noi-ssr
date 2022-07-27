<template>
  <RightColumn class="map-view" :visible="true">
    <Map
      :visible-companies="filteredCompanies"
      @showCompanyWithId="showCompanyWithId"
    />
  </RightColumn>
</template>

<script>
export default {
  props: {
    filteredCompanies: {
      type: Array,
      required: true,
    },
  },

  methods: {
    showCompanyWithId(companyId) {
      this.$emit('showCompanyWithId', companyId)
    },
  },
}
</script>
