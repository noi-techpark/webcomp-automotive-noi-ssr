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

  async asyncData({ params, i18n, $config: { apiEndpoint, apiCompaniesPath, network }}) {
    let fetchedCompany;
    if(params.name) {
      let apiUrl = ''
      if (apiEndpoint) {
        apiUrl += apiEndpoint
      } else {
        apiUrl += utils.methods.getConfigProperty('apiEndpoint')
      }
      if (apiCompaniesPath) {
        apiUrl += apiCompaniesPath
      } else if (network) {
        apiUrl += '/api/' + network + '-companies'
      } else {
        apiUrl += utils.methods.getConfigProperty('apiCompaniesPath')
      }
      /* eslint-disable  */
      const response = await fetch(
          apiUrl +
          '?locale=' +
          i18n.locale +
          '&populate=*' +
          '&' +
          encodeURIComponent('filters[name][$eq]') +
          '=' +
          encodeURIComponent(params.name.toUpperCase())
      ).catch(() => {
        alert('Sorry, an error has occurred while fetching the company.')
      })
      /* eslint-enable */
      fetchedCompany = await response.json()
      if(fetchedCompany.attributes) {
        fetchedCompany = fetchedCompany.attributes
      }
    }

    return { companyData: utils.methods.mapCompaniesResult(fetchedCompany, i18n.locale)[0] }
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
    this.initConfigPropertiesFromEnvvars();
    this.setStandardGlobalCSSVariables(this.$refs.actorProfile, this.getConfigProperty('primaryColor'));
    this.companyName = this.companyData.name
  },
}
</script>

<style>
.actor-profile {
  & .right-column {
    @apply w-full;

    height: calc(100vh - 100px);

    top: 100px !important;
  }
  & .container {

    & .company-view {
      overflow-y: inherit;
    }
  }
  & .no-results-notice {
    @apply mx-6 text-base text-grey my-6;
  }
}
</style>
