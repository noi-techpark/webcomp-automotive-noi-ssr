<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div ref="actorProfile" class="actor-profile" style="height: 100vh; overflow: hidden">
    <HeaderNOI />
    <company-view
      v-if="companyData"
      :data="companyData"
      :visible="true"
      :display-as-website="true"
    />
    <div v-else class="no-results-notice">
      {{ $t('common.noCompaniesFound') }}
    </div>
  </div>
</template>

<script>
import utils from '~/mixins/utils.js'

export default {
  mixins: [utils],

  data() {
    return {
      TITLE_END: 'NOI Automotive Automation',
      primaryColor: '#0000ff',
      companyData: null
    }
  },

  async fetch() {
    const companyName = this.$route.params.name;
    let fetchedData;
    if (!isNaN(Number(companyName))) {
      fetchedData = await this.fetchCompanyById(Number(companyName));
      this.companyData = fetchedData?.data[0].attributes['data_' + this.$i18n.locale];
    } else {
      fetchedData = await this.fetchCompanyByName(companyName);
      this.companyData = fetchedData?.data[0];
    }
  },
  head() {
    return {
      title: this.tabTitle,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.truncate(this.removeUnnecessaryNewlines(this.companyData?.attributes?.productsAndServices), 160, true),
        },
      ],
    }
  },
  computed: {
    tabTitle() {
      return (
        (this.companyData?.attributes?.name ? this.companyData.attributes.name + ' - ' : '') +
        this.TITLE_END
      )
    },
  },
  mounted() {
    // Define CSS Variables
    this.setStandardGlobalCSSVariables(this.$refs.actorProfile, this.primaryColor);
  },
}
</script>

<style>
.actor-profile {
  & .right-column {
    @apply w-full;

    top: 100px !important;
  }
  & .container {
    height: auto !important;

    & .company-view {
      overflow-y: inherit;
    }
  }
  & .no-results-notice {
    @apply mx-6 text-base text-grey my-6;
  }
}
</style>
