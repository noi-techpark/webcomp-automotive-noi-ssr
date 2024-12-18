<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <header class="header">
    <div class="lang-selector">
      <Select
        :aria-label="$t('common.languageSelector')"
        :value="$i18n.locale"
        :options="availableLanguages"
        aspect="fill"
        :white-contrast="false"
        @input="changeLanguage"
      />
    </div>
    <div class="logos-ct">
      <nuxt-link class="logo clickable" to="/" aria-label="NOI Logo">
        <div v-if="!getConfigProperty('headerLogoUrl')">
          <Icon name="logo" alt="NOI Logo" />
          <Icon name="logo-automotive" alt="NOI Automotive Automation Logo" />
        </div>
        <div v-else>
          <img :src="getConfigProperty('headerLogoUrl')" alt="LOGO" />
        </div>
      </nuxt-link>
    </div>
    <hr />
  </header>
</template>

<script>
import utils from '~/mixins/utils'

export default {
  mixins: [utils],
  computed: {
    availableLanguages() {
      return [
        {
          value: 'it',
          name: 'Italiano',
        },
        {
          value: 'de',
          name: 'Deutsch',
        },
        {
          value: 'en',
          name: 'English',
        },
      ]
    },
  },
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
.header {
  @apply fixed top-0 w-full bg-secondary z-20;

  & .lang-selector {
    @apply absolute top-6 right-4 w-52 rounded-lg;

    border: 2px solid var(--primary-color);

    & .select .selector select {
      color: var(--primary-color);
    }
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
</style>
