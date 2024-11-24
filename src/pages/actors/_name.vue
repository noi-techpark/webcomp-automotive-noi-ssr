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

  async asyncData({ params, i18n }) {
    let fetchedCompany;
    if(params.name) {
      /* eslint-disable  */
      const response = await fetch(
        this.getConfigProperty('apiEndpoint') +
          this.getConfigProperty('apiCompaniesPath') +
          '?locale=' +
          i18n.locale +
          '&populate=*' +
          '&fields[0]=data_' + i18n.locale +
          '&' +
          /* NOTE: since name is stored as json, there's no way to filter it. Thus we need to use companyId again
          encodeURIComponent('filters[name][$eq]') +
          '=' +
          encodeURIComponent(params.name.toUpperCase())*/
          encodeURIComponent('filters[companyId][$eq]') +
          '=' +
          encodeURIComponent(params.name)
      ).catch(() => {
        alert('Sorry, an error has occurred while fetching the company.')
      })
      /* eslint-enable */
      fetchedCompany = await response.json()
      if(fetchedCompany.attributes) {
        fetchedCompany = fetchedCompany.attributes
      }
    }

    return { companyData: fetchedCompany?.data[0]["data_" + i18n.locale] }
  },

  data() {
    return {
      companyName: '',
      TITLE_END: 'NOI Automotive Automation',
    }
  },
  head() {
    return {
      title: this.tabTitle,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.truncate(this.removeUnnecessaryNewlines(this.companyData?.productsAndServices || this.companyData?.attributes?.productsAndServices), 160, true),
        },
      ],
    }
  },
  computed: {
    tabTitle() {
      return (
        this.companyName + this.TITLE_END
      )
    },
  },
  mounted() {
    // Define CSS Variables
    this.setStandardGlobalCSSVariables(this.$refs.actorProfile, this.getConfigProperty('primaryColor'));
    this.companyName = this.companyData.name
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
    @apply !h-fit;

    & .company-view {
      overflow-y: inherit;
    }
  }
  & .no-results-notice {
    @apply mx-6 text-base text-grey my-6;
  }
}
</style>
