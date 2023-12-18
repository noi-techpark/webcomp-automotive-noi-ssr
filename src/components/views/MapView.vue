<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <RightColumn class="map-view" :visible="true">
    <client-only>
      <link rel="stylesheet" href="https://unpkg.com/vuelayers/dist/vuelayers.css">
      <CompanieMapping
        :visible-companies="filteredCompanies"
        @showCompanyWithId="showCompanyWithId"
      />
    </client-only>
  </RightColumn>
</template>

<script>
export default {
  components: {
    CompanieMapping: () => import("@/components-lazy/ui/generic/Map"),
  },
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

<style lang="postcss" scoped>
@container noi-automotive-component-view (max-width: theme('screens.md')) {
  .map-view {
    top: 60cqh !important;
  }
}
</style>
