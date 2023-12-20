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
        primary
        centered-text
        @input="changeLanguage"
      />
    </div>
    <nuxt-link v-show="showBackToHomepage" class="back-to-hompepage-button" :to="'/' + $i18n.locale">
      <Button icon="back-arrow" :value="$t('common.backToHomepage')" type="primary"></Button>
    </nuxt-link>
    <div class="logos-ct">
      <nuxt-link class="logo clickable" to="/" aria-label="NOI Logo">
        <Icon name="logo" alt="NOI Logo"/>
        <Icon class="noi-automotive" name="logo-automotive" alt="NOI Automotive Automation Logo"/>
        <h1 class="noi-navigator">Navigator</h1>
      </nuxt-link>
    </div>
    <hr />
  </header>
</template>

<script>
export default {
  computed: {
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
    showBackToHomepage() {
      return !['/', '/en', '/de', '/it'].includes(this.$route.path);
    }
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
    @apply absolute top-6 right-4 w-14;
  }

  & .back-to-hompepage-button {
    @apply absolute top-6 right-20;
  }

  & .logos-ct {
    height: 100px;

    & .logo {
      display: inline;

      & svg {
        @apply h-full;
      }
      & .noi-navigator {
        display: inline;
        margin-left: 0.5rem;
        font-size: 40px;
        vertical-align: middle;
      }
    }
  }

  & hr {
    border-top: 1px solid black;
  }
}

@media screen and (max-width: 600px) {
  .noi-automotive {
    display: none;
  }
  .noi-navigator {
    display: none;
  }
}
@media screen and (max-width: 780px) {
  .noi-navigator {
    display: none !important;
  }
}
</style>
