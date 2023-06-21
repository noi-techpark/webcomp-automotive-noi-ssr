<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div ref="componentView" class="component-view">
    <NavigationBar
      ref="navigationBar"
      :visible-company="visibleCompanyData"
      :display-as-website="displayAsWebsite"
      @onCompanyClick="showCompany"
      @didLeaveHome="hideHome"
      @didReachHome="showHome"
      @didFetchCompanies="setCompaniesList"
      @didFilterCompanies="setNewFilteredCompanies"
      @toggleLoading="toggleLoading"
    />
    <MapView
      :filtered-companies="filteredCompanies"
      @showCompanyWithId="showCompanyWithId"
    />
    <HomeView
      v-if="showHomeView"
      :companies-list="companiesList"
      :filtered-companies="filteredCompanies"
      :visible="isHomeViewVisible"
      :display-as-website="displayAsWebsite"
      :custom-links="parsedCustomLinks"
      @showMapView="showMapView"
    />
    <CompanyView
      :data="visibleCompanyData || undefined"
      :visible="visibleCompanyData !== null"
      @onHide="hideCompany"
    />
    <div class="full-screen-loader" :class="{ visible: loading }">
      <Loader colorscheme="colored" />
    </div>
  </div>
</template>

<script>
import { setup } from "@twind/core/core";
import autoprefix from "@twind/preset-autoprefix";
import ext from "@twind/preset-ext";
import tailwind from "@twind/preset-tailwind";

import vueI18n from '@/plugins/vueI18n'
import 'tailwindcss/tailwind.css'
import utils from '~/mixins/utils.js'

// Setup twind
setup({
  presets: [autoprefix(), ext(), tailwind()],
});

export default {
  i18n: vueI18n,
  mixins: [ utils ],

  provide() {
    return {
      // Provide primary-color for Map.vue
      'primary-color': this.primaryColor,
    }
  },

  props: {
    websiteMode: {
      type: String,
      default: 'false',
    },

    customLinks: {
      type: String,
      default: '',
    },

    defaultCompany: {
      type: String,
      default: '',
    },

    language: {
      type: String,
      default: 'en',
    },
    primaryColor: {
      type: String,
      default: "#9626ff",
      Validator(value) {
        return /^#[0-9A-F]{6}$/i.test(value) || /^#([0-9A-F]{3}){1,2}$/i.test(value);
      }
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    showHomeView: {
      type: Boolean,
      default: true,
    }

  },

  data() {
    return {
      loading: true,
      companiesList: [],
      filteredCompanies: [],
      isHomeViewVisible: true,
      visibleCompanyData: null,
      requestedCompanyDisplay: null,
    }
  },

  computed: {
    displayAsWebsite() {
      return this.websiteMode === 'true'
    },

    parsedCustomLinks() {
      if (this.customLinks) {
        return JSON.parse(this.customLinks)
      }

      return []
    },
  },

  watch: {
    companiesList(newList) {
      if (newList.length) {
        this.loading = false
        if (this.requestedCompanyDisplay) {
          this.showCompanyWithId(this.requestedCompanyDisplay)
          this.requestedCompanyDisplay = null
        }
      }
    },
  },

  created() {
    if (this.language) {
      if (this.$i18n.locale !== this.language) {
        if (typeof this.$i18n.setLocale !== 'undefined') {
          this.$i18n.setLocale(this.language)
        } else {
          this.$i18n.locale = this.language
        }
      }
    }

    if (this.defaultCompany) {
      this.requestedCompanyDisplay = Number(this.defaultCompany)
    }
  },

  mounted() {
    this.$refs.componentView.style.width = this.width;
    this.$refs.componentView.style.height = this.height;

    this.$refs.componentView.style.setProperty('--primary-color', this.primaryColor);
    this.$refs.componentView.style.setProperty('--primary-hover', this.hexAdjustBrightness(this.primaryColor, this.getTextColor(this.primaryColor) === 'white' ? -20 : 20));

    if (this.$route?.query?.company) {
      this.requestedCompanyDisplay = Number(this.$route.query.company)
    }
  },

  methods: {
    showCompanyWithId(companyId) {
      const companyData = this.companiesList.find(
        (company) => company.id === companyId
      )
      if (companyData) {
        this.showCompany(companyData)
      } else {
        this.resetUrl()
      }
    },

    showCompany(companyData) {
      this.visibleCompanyData = companyData
      if (this.$router) {
        this.$router.replace({
          name: this.$router.name,
          query: { company: companyData.id },
        })
      }
    },

    hideCompany() {
      this.visibleCompanyData = null
      this.resetUrl()
    },

    resetUrl() {
      if (this.$router) {
        this.$router.replace({
          name: this.$router.name,
          query: { company: undefined },
        })
      }
    },

    showHome() {
      this.isHomeViewVisible = true
      this.hideCompany()
    },

    hideHome() {
      this.isHomeViewVisible = false
    },

    showMapView() {
      this.$refs.navigationBar.showCategory(true)
    },

    setNewFilteredCompanies(filteredCompanies) {
      this.filteredCompanies = filteredCompanies
    },

    setCompaniesList(companiesList) {
      this.companiesList = companiesList
    },
    toggleLoading(isLoading) {
      this.loading = isLoading || !this.loading;
    }
  },
}
</script>

<style lang="postcss">
@import url('~assets/css/animations.css');
@import url('~assets/css/main.css');

.component-view {
  @apply relative overflow-hidden;
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';
}

.full-screen-loader {
  @apply absolute flex items-center justify-center top-0 right-0 bottom-0 left-0 bg-white bg-opacity-75 z-30 opacity-0 pointer-events-none;

  &.visible {
    @apply opacity-100 pointer-events-auto;
  }
}
</style>
