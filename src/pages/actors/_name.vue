<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div class="actor-profile" style="height: 100vh; overflow: hidden">
    <HeaderNOI />
    <company-view
      :data="companyData"
      :visible="true"
      :display-as-website="true"
    />
  </div>
</template>

<script>
import utils from '~/mixins/utils.js'

export default {
  mixins: [utils],

  async asyncData({ params, i18n }) {
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
    const fetchedCompany = await response.json()

    return { companyData: fetchedCompany.data[0] }
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
}
</style>
