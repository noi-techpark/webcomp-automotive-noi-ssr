<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div class="actor-profile" style="height: 100vh; overflow: hidden">
    <div class="header">
      <div class="lang-selector">
        <Select
          :value="$i18n.locale"
          :options="availableLanguages"
          aspect="fill"
          :white-contrast="false"
          centered-text
          @input="changeLanguage"
        />
      </div>
      <div class="logos-ct">
        <nuxt-link class="logo clickable" to="/">
          <Icon name="logo" />
        </nuxt-link>
        <nuxt-link class="logo clickable" to="/">
          <Icon name="logo-automotive" />
        </nuxt-link>
      </div>
      <hr />
    </div>
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
    availableLanguages() {
      return [
        {
          value: 'it',
          name: 'IT',
        },
        {
          value: 'de',
          name: 'DE',
        },
        {
          value: 'en',
          name: 'EN',
        },
      ]
    },
  },
  mounted() {},
  methods: {
    changeLanguage(lang) {
      if (typeof this.$i18n.setLocale !== 'undefined') {
        this.$i18n.setLocale(lang)
      } else {
        this.$i18n.locale = lang
      }
    },
  },
}
</script>

<style>
.actor-profile {
  & .header {
    @apply fixed top-0 w-full bg-secondary z-20;

    & .lang-selector {
      @apply absolute top-6 right-4 w-14;
    }
    & .logos-ct {
      height: 100px;

      & .logo {
        display: inline;

        & svg {
          @apply h-full;
        }
      }
    }

    & hr {
      border-top: 1px solid black;
    }
  }
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
