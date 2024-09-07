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
      :default-category="defaultCategory"
      :limit-to-default-category="limitToDefaultCategory"
      :visible-categories="visibleCategoriesAsArray"
      :initial-filters="initialFilters"
      :show-language-select="showLanguageSelect"
      @onCompanyClick="showCompany"
      @didLeaveHome="hideHome"
      @didReachHome="showHome"
      @didFetchCompanies="setCompaniesList"
      @didFilterCompanies="setNewFilteredCompanies"
      @toggleLoading="toggleLoading"
      @setFilterMenuWidth="setFilterMenuWidth"
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
import { setup } from "@twind/core/core"
import autoprefix from "@twind/preset-autoprefix"
import ext from "@twind/preset-ext"
import tailwind from "@twind/preset-tailwind"
import resolveConfig from 'tailwindcss/resolveConfig'

import vueI18n from '@/plugins/vueI18n'
import 'tailwindcss/tailwind.css'
import utils from '~/mixins/utils.js'

import tailwindConfig from '~/tailwind.config.js'
const twConfig = resolveConfig(tailwindConfig)

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
      'tailwind-config': twConfig,
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

    defaultCategory: {
      type: String,
      default: ''
    },

    limitToDefaultCategory: {
      type: Boolean
    },

    visibleCategories: {
      type: String,
      default: ''
    },

    initialFilters: {
      type: Object,
      default: ()=>{}
    },

    language: {
      type: String,
      default: 'en',
    },
    showLanguageSelect: {
      type: Boolean,
      default: true,
    },
    primaryColor: {
      type: String,
      default() {
        return this.$config.primaryColor || "#0000ff"
      },
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

    visibleCategoriesAsArray() {
      if(this.visibleCategories.split(',')[0] === '')
        return undefined;
      else { 
        return this.visibleCategories.split(',').map(category => category.trim());
      }
    }
  },

  watch: {
    companiesList(newList) {
      if (newList.length) {
        this.loading = false
        if (this.requestedCompanyDisplay) {
          if(isNaN(Number(this.requestedCompanyDisplay))) {
            this.showCompanyWithName(this.requestedCompanyDisplay)
          } else {
            this.showCompanyWithId(Number(this.requestedCompanyDisplay))
          }
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
      this.requestedCompanyDisplay = this.defaultCompany
    }
  },

  mounted() {
    this.$refs.componentView.style.width = this.width;
    this.$refs.componentView.style.height = this.height;

    // Define CSS Variables
    this.setStandardGlobalCSSVariables(this.$refs.componentView, this.$config.primaryColor || this.primaryColor);

    if (this.displayAsWebsite && this.$route?.params?.companyName) {
      this.requestedCompanyDisplay = this.$route.params.companyName
    }
    this.loading = false
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
    showCompanyWithName(companyName) {
      const companyData = this.companiesList.find(
        (company) => company.attributes.name.toUpperCase() === companyName.toUpperCase()
      )
      if (companyData) {
        this.showCompany(companyData)
      } else {
        this.resetUrl()
      }
    },

    showCompany(companyData) {
      this.visibleCompanyData = companyData
      this.historyPush('/companies/' + companyData.attributes.name)
      this.$emit('changeTitle', companyData.attributes.name)
    },

    hideCompany() {
      this.visibleCompanyData = null
      this.resetUrl()
    },

    resetUrl() {
      this.historyPush('/companies/')
      this.$emit('changeTitle', '')
    },

    historyPush(path) {
      if(this.displayAsWebsite) {
        const encodedPath = encodeURI(path)
        history.pushState('', '', encodedPath)
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
      // explicitly require a boolean value,
      if (isLoading === true || isLoading === false)
        this.loading = isLoading
      else 
        this.loading = !this.loading
    },
    setFilterMenuWidth(value) {
      this.setGlobalCSSVariable(this.$refs.componentView, '--width-filtersmenu', value)
    }
  },
}
</script>

<style lang="postcss">
@import url('~assets/css/animations.css');
@import url('~assets/css/main.css');

.component-view {
  @apply relative overflow-hidden w-full h-full;
  
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';
  
  /**
   * INFO: the at rule @conainer is supported by all major Browsers since February 2023,
   * but some linters still warn about it.
   *
   * browser-compatibility: https://developer.mozilla.org/en-US/docs/Web/CSS/@container#browser_compatibility
   * stylelint 14.12.0: https://github.com/stylelint/stylelint/releases/tag/14.12.0
   */
  container-type: size;
  container-name: noi-automotive-component-view
}

.full-screen-loader {
  @apply absolute flex items-center justify-center top-0 right-0 bottom-0 left-0 bg-white bg-opacity-75 z-30 opacity-0 pointer-events-none;

  &.visible {
    @apply opacity-100 pointer-events-auto;
  }
}
</style>
