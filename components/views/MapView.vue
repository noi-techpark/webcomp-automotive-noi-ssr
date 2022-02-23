<template>
  <RightColumn class="map-view" :visible="true">
    <Map :visible-companies="filteredCompanies" />
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
}
</script>
