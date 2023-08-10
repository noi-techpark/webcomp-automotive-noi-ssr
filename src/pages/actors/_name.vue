<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div class="actor-profile" style="height: 100vh; overflow: hidden">
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
        'https://bk.opendatahub.com' +
          '/api/companies' +
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
    }

    return { companyData: fetchedCompany?.data[0] }
  },

  data() {
    return {
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
          content: this.$t('home.meta.description'),
        },
      ],
    }
  },
  computed: {
    tabTitle() {
      return (
        (this.$route.params.name ? this.$route.params.name + ' - ' : '') +
        this.TITLE_END
      )
    },
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
