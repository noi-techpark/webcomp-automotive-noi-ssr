<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <header class="header">
    <div class="right-header">
      <nuxt-link
        class="back-button"
        :class="{ hidden: !showBackButton }"
        to="/"
      >
        <Icon name="back-arrow2" />
        <span class="back-button-text"> {{ $t('common.toAllCompanies') }}</span>
      </nuxt-link>
      <div
        class="lang-selector"
        :class="{ 'hidden-on-mobile': showBackButton }"
      >
        <Select
          class="desktop"
          :aria-label="$t('common.languageSelector')"
          :value="$i18n.locale"
          :options="availableLanguages"
          aspect="fill"
          :white-contrast="false"
          @input="changeLanguage"
        />
        <Select
          class="mobile"
          :aria-label="$t('common.languageSelector')"
          :value="$i18n.locale"
          :options="availableLanguagesShort"
          aspect="fill"
          :white-contrast="false"
          @input="changeLanguage"
        />
      </div>
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
  </header>
</template>

<script>
import utils from '~/mixins/utils'

export default {
  mixins: [utils],
  props: {
    showBackButton: {
      type: Boolean,
      default: false,
    },
  },
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
    availableLanguagesShort() {
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

  box-shadow: 0 0 40px rgba(0, 0, 0, 0.25);

  container-type: inline-size;
  container-name: noi-automotive-header;
  max-width: 100vw;

  & .right-header {
    @apply absolute top-6 right-4 flex;

    column-gap: 1rem;

    & .back-button {
      @apply relative inline-block rounded-lg  pl-4 pr-4 text-base select-none bg-secondary;

      line-height: 44px;
      color: var(--primary-color);

      border: 1px solid var(--primary-color);

      &.hidden {
        display: none;
      }

      & svg {
        @apply h-5 align-sub;
        fill: var(--primary-color) !important;
      }
    }

    & .lang-selector {
      @apply w-32 rounded-lg;

      border: 1px solid var(--primary-color);

      & .select .selector select {
        color: var(--primary-color);
      }

      & .select.mobile {
        display: none;
      }
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
}
@container noi-automotive-header (max-width: theme('screens.md')) {
  .right-header {
    & .back-button {
      padding-left: 1rem !important;
      padding-right: 0.8rem !important;

      & .back-button-text {
        display: none;
      }
    }

    & .lang-selector {
      width: 5rem !important;

      &.hidden-on-mobile {
        display: none;
      }

      & .select.desktop {
        display: none;
      }
      & .select.mobile {
        display: block !important;
      }
    }
  }
}
</style>
