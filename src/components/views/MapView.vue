<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

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

<style lang="postcss" scoped>
@container noi-automotive-component-view (max-width: theme('screens.md')) { /* stylelint-disable-line at-rule-no-unknown */
  .map-view {
    top: 60cqh !important; /* stylelint-disable-line unit-no-unknown */
  }
}
</style>
