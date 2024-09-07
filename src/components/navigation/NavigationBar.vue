<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div class="navigation-ct">
    <div class="navigation-bar" :class="{ 'navbar-filter-hidden': !isFiltersMenuVisible }">
      <div v-if="showLanguageSelect" class="lang-selector">
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
        <div v-if="!$config.headerLogoUrl">
          <Icon name="logo" alt="NOI Logo" />
          <Icon name="logo-automotive" alt="NOI Automotive Automation Logo" />
        </div>
        <div v-else>
          <img :src="$config.headerLogoUrl" alt="LOGO" />
        </div>
      </div>
      <hr />
      <Transition name="fade">
        <div
          v-if="resultsList.length == visibleResults.length"
          class="section-title"
        >
          <div class="main-title">
            <div class="title">
              {{ curSectionTitle }}
            </div>
          </div>
          <div v-if="displayMultipleCategories" class="subtitle">
            <div class="back-button" @click="backToCategories">
              <Icon name="back-arrow" />
              {{ $t('common.backToCategories') }}
            </div>
          </div>
        </div>
      </Transition>
      <div class="search-bar-ct">
        <div class="search-bar">
          <TextInput
            v-model="searchValue"
            :placeholder="$t('filters.searchPlaceholder')"
            type="search"
            aspect="fill"
          />
        </div>
        <Button icon="filter" class="filter-bt" @click="toggleFiltersMenu" />
      </div>
      <div class="results-ct" :class="{ 'result-view': resultsList.length === visibleResults.length }">
        <div v-if="resultsList.length !== visibleResults.length" class="result clickable" @click="showCategory(true)">
          <div class="name">
            <b>{{  $t('common.allCategories') + ' (' + filterCount.sumCompanies + ')' }}</b>
            <div class="line"></div>
          </div>
          <div class="arrow">
            <Icon name="arrow-right-compressed" />
          </div>
        </div>
        <div
          v-for="(resultItem, index) in resultsList"
          :key="new Date().getTime() + '-' + index"
          @click="showResult(resultItem)"
        >
          <div v-if="resultItem.isMainCategory" class="mainCategory">
            <div class="result clickable">
              <div class="name">
                {{
                  resultItem.name + ' (' + filterCount.categories[resultItem.id.replace(CATEGORY_PREFIX, '')] + ')' || ''
                }}
                <div class="line"></div>
              </div>
              <div class="metric">{{ resultItem.metric || '' }}</div>
              <div class="arrow">
                <Icon name="arrow-right-compressed" />
              </div>
            </div>
          </div>
          <ResultCard v-else :result="resultItem" :card-type="isInLandscapeMode ? 'desktop' : 'mobile'" :index="index" />
        </div>
        <div v-if="!resultsList.length" class="no-results-notice">
          {{ $t('common.noCompaniesFound') }}
        </div>
      </div>
    </div>
    <div ref="filtersmenu" class="filters-menu" :class="{ 'filters-menu-hidden': !isFiltersMenuVisible }">
      <div class="close" @click="hideFiltersMenu">
        <div class="inner">
          <Icon name="cross" class="ico" />
        </div>
      </div>
      <div class="top-title">{{ $t('common.filters') }}</div>
      <div class="list">
        <Select
          v-model="filters.industrialSector"
          :label="$t('filters.industrialSector')"
          :options="industrialSectors"
          :filter-count="filterCount.industrialSectors"
          aspect="fill"
          :white-contrast="true"
          class="select"
        />
        <Select
          v-model="filters.valueChainPosition"
          :label="$t('filters.valueChainPosition')"
          :options="valueChainPositions"
          :filter-count="filterCount.valueChainPositions"
          aspect="fill"
          :white-contrast="true"
          class="select"
        />
        <div
          class="advanced-filters-bt"
          @click="toggleAdvancedFiltersVisibility"
        >
          {{
            areAdvancedFiltersVisible
              ? $t('filters.hideAdvanced') + ' ↑'
              : $t('filters.showAdvanced') + ' ↓'
          }}
        </div>
        <div
          class="advanced-filters-ct"
          :class="{ visible: areAdvancedFiltersVisible }"
        >
          <Select
            v-model="filters.turnover"
            :label="$t('filters.turnover')"
            :options="turnovers"
            :filter-count="filterCount.turnovers"
            aspect="fill"
            :white-contrast="true"
            class="select"
          />
          <Select
            v-model="filters.employees"
            :label="$t('filters.numberOfEmployees')"
            :options="employees"
            :filter-count="filterCount.employeeNumber"
            aspect="fill"
            :v-contrast="true"
            class="select"
          />
          <Select
            v-model="filters.certification"
            :label="$t('filters.certification')"
            :options="certifications"
            :filter-count="filterCount.certifications"
            aspect="fill"
            :white-contrast="true"
            class="select"
          />
        </div>
        <Button
          :value="$t('filters.resetFilters')"
          class="reset-filters-bt"
          type="secondary"
          @click="resetFilters"
        />
      </div>
    </div>
  </div>
</template>

<script>
import utils from '~/mixins/utils.js'
import filters from '~/mixins/filters.js'

const allCategories = [
  'automotiveAndMobility',
  'manufacturing',
  'agriAutomation',
]

export default {
  mixins: [utils, filters],

  inject: {
    // inject tailwind-config from WebComponent.vue
    twConfig: {
      from: 'tailwind-config',
      default: undefined
    }
  },

  props: {
    visibleCompany: {
      type: Object,
      default: () => ({
        attributes: {},
      }),
    },

    displayAsWebsite: {
      type: Boolean,
      default: false,
    },

    defaultCategory: {
      type: String,
      default: '',
      validator(value) {
        // The value must match one of the mainCategories.id or be empty
        return allCategories.includes(value) || value === ''
      },
    },

    limitToDefaultCategory: {
      type: Boolean,
    },

    visibleCategories: {
      type: [Array, undefined],
      default: () => allCategories,
      validator(value) {
        return (
          value[0] &&
          value.every((category) => allCategories.includes(category))
        )
      },
    },

    initialFilters: {
      type: Object,
      default: null,
    },

    showLanguageSelect: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      CATEGORY_PREFIX: 'CATEGORY-', // if you change it here, you also have to change it in ~/mixins/filters.js
      filters: {},
      searchValue: '',
      mainCategory: null,
      isFiltersMenuVisible: true,
      areAdvancedFiltersVisible: true,
      isInLandscapeMode: this.landscapeMode(),
      fetchedData: null,
    }
  },

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

    /**
     * checks wether defaultCategory is valid. This function trims defaultCategory and is case-insensitive
     */
    defaultCategoryValidated() {
      if (allCategories.includes(this.defaultCategory.trim()))
        return this.defaultCategory.trim()
      else {
        return (
          allCategories.find(
            (category) =>
              category.toLowerCase() ===
              this.defaultCategory.trim().toLowerCase()
          ) || ''
        )
      }
    },

    /**
     * Checks wether visibleCategories consists of valid categories
     * @returns Array of type string, i.e. ["automotiveAndMobility", "manufacturing", "agriAutomation"].
     */
    visibleCategoriesValidated() {
      const visibleCategoriesNormalized = this.visibleCategories.map(
        (category) => {
          let ret = category.trim()
          ret = ret.toLowerCase()
          return ret
        }
      )
      const validCategories = visibleCategoriesNormalized.filter((category) =>
        allCategories.some(
          (categoryFromAll) => categoryFromAll.toLowerCase() === category
        )
      )
      if (validCategories.length > 0) return validCategories
      else return allCategories
    },

    categoryFilter() {
      return {
        automotiveAndMobility: this.visibleCategoriesValidated.includes(
          'automotiveandmobility'
        ),
        manufacturing:
          this.visibleCategoriesValidated.includes('manufacturing'),
        agriAutomation:
          this.visibleCategoriesValidated.includes('agriautomation'),
      }
    },

    /**
     * like mainCategories, but only consisting of the categories which should be visible
     */
    filteredMainCategories() {
      return this.mainCategories.filter(
        (category) =>
          this.categoryFilter[category.id.replace(this.CATEGORY_PREFIX, '')]
      )
    },

    /**
     * boolean, deciding wether the user should be able to choose a category or not
     * returns false, if there is only one category to show or limitToDefaultCategory is set (under the condition, that there's even a defaultCategory)
     */
    displayMultipleCategories() {
      return !(
        this.filteredMainCategories.length <= 1 ||
        (this.limitToDefaultCategory && this.defaultCategoryValidated !== '')
      )
    },

    curSectionTitle() {
      if (this.displayMultipleCategories) {
        return (
          this.getSectorNameFromID(this.mainCategory) ||
          this.$t('common.allCategories')
        )
      } else {
        return this.getSectorNameFromID(
          this.defaultCategoryValidated || this.visibleCategories[0]
        )
      }
    },

    filteredResults() {
      let results = []

      if (this.fetchedData) {
        // call filterResults from mixin 'filters'
        results = this.filterResults(
          this.fetchedData,
          this.filters,
          this.searchValue,
          this.categoryFilter,
          'or',
          this.mainCategory,
          this.defaultCategoryValidated,
          this.displayMultipleCategories
        )
      }
      return results
    },

    mappedResults() {
      // call mapResults from mixin 'filters'
      return this.mapResults(this.filteredResults)
    },

    visibleResults() {
      return this.fetchedData
        ? this.mappedResults
        : new Array(10).fill(this.getResultDataObject(true))
    },

    resultsList() {
      return !this.mainCategory && this.displayMultipleCategories
        ? this.filteredMainCategories
        : this.visibleResults
    },

    filterCount() {
      // call countFilters from mixin 'filters'
      return this.countFilters(this.filteredResults, this.CATEGORY_PREFIX)
    },
  },

  watch: {
    searchValue(newValue) {
      if (newValue && !this.mainCategory) {
        this.showCategory(true)
      } else if (this.mainCategory === true && !newValue) {
        this.backToCategories()
      }
    },

    mappedResults(newCompaniesList) {
      this.$emit('didFilterCompanies', newCompaniesList)
    },

    filters(newFilters) {
      this.$root.$emit('set-filters', newFilters)
    }
  },

  mounted() {
    this.fetchResults()
    if (
      this.displayMultipleCategories &&
      this.defaultCategoryValidated !== ''
    ) {
      this.showResult(
        this.mainCategories.find(
          (category) =>
            category.id === this.CATEGORY_PREFIX + this.defaultCategoryValidated
        )
      )
    }

    // Account for Margin Collapsing (Explanation of margin collapsing: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Mastering_margin_collapsing)
    if(this.displayAsWebsite) {
      this.$refs.filtersmenu.style.setProperty('width', this.twConfig.theme.space.filtersmenu);
    } else {
      this.$refs.filtersmenu.style.setProperty('width', "calc(" + this.twConfig.theme.space.filtersmenu + " - " + this.twConfig.theme.spacing[10] + ")");
    }

    if (this.initialFilters) {
      this.filters = this.initialFilters
    }

    if (this.landscapeMode(1024)) {
      this.showFiltersMenu()
    } else {
      this.hideFiltersMenu()
    }
    window.addEventListener('resize', ()=>{
      this.isInLandscapeMode = this.landscapeMode();
    })
  },

  methods: {
    async changeLanguage(lang) {
      this.$emit('toggleLoading', true)
      if (typeof this.$i18n.setLocale !== 'undefined') {
        this.$i18n.setLocale(lang)
      } else {
        this.$i18n.locale = lang
      }
      await this.fetchResults()
      if (this.visibleCompany) {
        this.onCompanyClick(this.visibleCompany.id)
      }
    },

    showResult(result) {
      if (String(result.id).startsWith(this.CATEGORY_PREFIX)) {
        const categoryId = result.id.replace(this.CATEGORY_PREFIX, '')
        this.showCategory(categoryId)
      } else if (!result.isPlaceholder) {
        this.onCompanyClick(result.id)
      }
    },

    showCategory(categoryId) {
      this.mainCategory = categoryId
      this.didLeaveHome()
    },

    backToCategories() {
      this.mainCategory = null
      this.searchValue = ''
      this.didReachHome()
    },

    onCompanyClick(companyId) {
      const companyData = this.fetchedData.find((c) => c.id === companyId)
      this.$emit('onCompanyClick', companyData)
    },

    didLeaveHome() {
      this.$emit('didLeaveHome')
    },

    didReachHome() {
      this.$emit('didReachHome')
    },

    toggleFiltersMenu() {
      if (this.isFiltersMenuVisible)
        this.hideFiltersMenu();
      else
        this.showFiltersMenu();
    },

    showFiltersMenu() {
      this.isFiltersMenuVisible = true
      this.$emit('setFilterMenuWidth', this.twConfig.theme.space.filtersmenu)
      // Refresh map size, because altering css-width stretches the canvas of the map. (refreshMap is defined in Map.vue in mounted)
      this.$root.$emit('refreshMap')
    },

    hideFiltersMenu() {
      this.isFiltersMenuVisible = false
      this.$emit('setFilterMenuWidth', '0rem')
      // Refresh map size, because altering css-width stretches the canvas of the map. (refreshMap is defined in Map.vue in mounted)
      this.$root.$emit('refreshMap')
    },

    async fetchResults() {
      this.fetchedData = await this.fetchAllCompanies()
      this.$emit('didFetchCompanies', this.fetchedData)
    },

    toggleAdvancedFiltersVisibility() {
      this.areAdvancedFiltersVisible = !this.areAdvancedFiltersVisible
    },

    resetFilters() {
      this.filters = {}
    },

    getSectorNameFromID(id) {
      if (id && id !== true)
        return this.mainCategories.find(
          (category) =>
            category.id.replace(this.CATEGORY_PREFIX, '') ===
            id.replace(this.CATEGORY_PREFIX, '')
        )?.name
    },
  },
}
</script>

<style lang="postcss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 250ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.navigation-ct {
  & .navigation-bar {
    @apply absolute w-navbar top-0 left-filtersmenu bottom-0 bg-white transition duration-300;

    z-index: 2;

    & .lang-selector {
      @apply absolute top-6 right-4 w-14;
    }

    & .logos-ct {
      height: 100px;
    }
    & .logo {
      display: inline;

      & svg {
        @apply h-full;
      }
    }

    & hr {
      border-top-width: 2px;
      margin-left: 10px;
      margin-right: 10px;
    }

    & .section-title {
      @apply mx-5;

      margin-top: 1.25rem;
      height: 2rem;

      & .main-title {
        @apply mb-2;

        height: 1rem;

        & .title {
          @apply text-xl text-black uppercase;

          animation: fade-in 0.3s ease;

          &.visible {
            @apply block;
          }
        }
      }

      & .subtitle {
        height: 1rem;

        & .back-button {
          @apply text-grey text-sm cursor-pointer select-none;

          animation: fade-in 0.3s ease;

          & svg {
            @apply w-3 h-3 mr-1;

            fill: theme(colors.grey) !important;
          }

          &.visible {
            @apply block;
          }
        }
      }
    }

    & .search-bar-ct {
      @apply mx-6;

      margin-top: 1.25rem;
      height: 3rem;
      font-size: 0;

      & .search-bar {
        @apply inline-block;

        width: calc(100% - 50px);
        margin-right: 5px;
      }

      & .filter-bt {
        @apply inline-block;

        border-radius: 18px;
        position: relative;
      }
    }

    & .results-ct {
      @apply overflow-y-auto overflow-x-hidden;

      margin-top: 4px;
      /*
       *   1.25rem from section-title > margin-top
       *   2   rem from section-title > height
       *   1.25rem from search-bar-ct > margin-top
       * + 3   rem from search-bar-ct > height
       * -----------------------------------------
       *   7.5 rem total
       *
       *   100px from logos-ct   > height
       * +   4px from results-ct > margin-top
       * ------------------------------------
       *   104px total
       */
      height: calc(100% - 4.25rem - 104px);
      &.result-view {
        height: calc(100% - 4.25rem - 3.25rem - 104px);
      }

      & .result {
        @apply flex flex-row mx-6 mb-4 cursor-pointer select-none;

        animation: fade-in 0.3s ease;

        & .name {
          @apply flex-grow text-base text-black pr-4;

          & .line {
            @apply w-8 bg-black;

            height: 1px;
          }
        }

        & .metric {
          @apply w-4 text-right text-base text-grey;
        }

        & .arrow {
          @apply flex items-center justify-center;

          & svg {
            @apply w-4 h-4;

            fill: theme(colors.grey) !important;
          }
        }

        &.is-placeholder {
          & .name {
            @apply h-4 bg-placeholder;
          }
        }

        &.is-main-category {
          @apply mb-8;

          & .name {
            @apply uppercase;

            & .line {
              @apply block;
            }
          }
        }

        &:first-child {
          @apply mt-6;

          &.is-main-category {
            @apply mt-8;
          }
        }
      }

      & .no-results-notice {
        @apply mx-6 text-base text-grey my-6;
      }
    }
  }

  & .filters-menu {
    @apply absolute top-0 bottom-0 bg-secondary px-5 drop-shadow-xl transition duration-300;

    z-index: 1;

    & .top-title {
      @apply text-lg text-black uppercase my-5;
    }

    & .close {
      @apply absolute top-3 right-3 w-8 h-8 bg-white cursor-pointer;

      border-radius: 50%;
      z-index: 9998;

      & .inner {
        @apply flex h-full w-full items-center justify-center;

        & .ico {
          @apply w-3 h-3;

          fill: theme(colors.grey) !important;
        }
      }
    }

    & .list {
      @apply absolute overflow-y-auto top-20 bottom-0 left-0 right-0 px-5;

      & .select {
        @apply mb-4;
      }

      & .advanced-filters-bt {
        @apply text-base text-primary text-black cursor-pointer select-none mb-3;

        &:hover, &:focus {
          @apply text-primary-hover;
        }
      }

      & .advanced-filters-ct {
        @apply overflow-hidden;

        transition: max-height 0.3s ease;
        max-height: 0;

        & .select:first-child {
          @apply mt-4;
        }

        &.visible {
          max-height: 300px;
        }
      }

      & .reset-filters-bt {
        @apply text-base text-primary text-black cursor-pointer select-none mb-3 px-0;

        &:hover, &:focus {
          @apply text-primary-hover;
        }
      }
    }

    &.visible {
      @apply transform-none;
    }
  }

  & .navbar-filter-hidden, & .filters-menu-hidden {
    transform: translateX(calc(theme('space.filtersmenu') * -1));
  }
}

@container noi-automotive-component-view (max-width: theme('screens.md')) {
  .navigation-ct {
    & .navigation-bar {
      @apply w-full left-0 transform-none;
      
      bottom: 40cqh;

      & .section-title {
        margin-top: 0.25rem;
      }

      & .results-ct {
        height: calc(100% - 4.25rem - 104px);
        &.result-view {
          height: calc(100% - 4.25rem - 2.25rem - 104px);
        }
      }
    }
    & .filters-menu {
      @apply right-0;

      z-index: 11;
    }

    & .filters-menu-hidden {
      transform: translateX(calc(theme('space.filtersmenu')));
    }
  }
}
</style>
