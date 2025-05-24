<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div ref="homepage" class="homepage">
    <HeaderNOI />
    <div
      ref="searchBar"
      class="search-bar-ct"
      role="search"
      :style="{
        backgroundImage:
          'url(' + getConfigProperty('searchbarBackground') + ')',
      }"
    >
      <div class="search-bar">
        <TextInput
          v-model="searchValue"
          :placeholder="$t('filters.searchPlaceholder')"
          type="search"
          aspect="fill"
          external-background
          @input="delaySearch"
        />
        <Button
          v-if="!isInLandscapeMode"
          icon="filter"
          class="filter-bt"
          @click="showFilterModal"
        />
      </div>
      <div ref="searchBarOffsetBox" class="search-bar-offset-box"></div>
    </div>
    <div class="company-list">
      <aside v-show="isInLandscapeMode">
        <div class="map-col">
          <!--
          <div class="top-desc">
            TODO: add here optional top description
          </div>
          -->
          <div class="map-ct clickable" data-not-lazy @click="showMapModal">
            <client-only>
              <link
                rel="stylesheet"
                href="https://unpkg.com/vuelayers/dist/vuelayers.css"
              />
              <CompanieMapping
                mode="preview"
                :visible-companies="mappedResults"
                class="map"
              />
            </client-only>
          </div>
        </div>
        <FiltersMenu :initial-filters="filters" :filter-count="filterCount" />
      </aside>
      <main>
        <ResultList
          :result-list="visibleResults"
          :max-description-length="175"
          :card-type="isInLandscapeMode ? 'desktop' : 'mobile'"
        />
      </main>
    </div>
    <div class="full-screen-loader" :class="{ visible: loading }">
      <Loader colorscheme="colored" />
    </div>
  </div>
</template>

<script>
import resolveConfig from 'tailwindcss/resolveConfig'
import utils from '~/mixins/utils.js'
import filters from '~/mixins/filters.js'
import WebComponent from '@/components/bundle/WebComponent'
import FiltersMenu from '@/components/navigation/FiltersMenu'

import tailwindConfig from '~/tailwind.config.js'
const twConfig = resolveConfig(tailwindConfig)
let searchTypingTimer

export default {
  components: {
    CompanieMapping: () => import('@/components-lazy/ui/generic/Map'),
  },

  mixins: [utils, filters],

  data() {
    return {
      loading: true,
      areAdvancedFiltersVisible: true,
      isInLandscapeMode: this.landscapeMode(),
      fetchedData: [],
      filters: {
        specializations: {
          // define specializations, so that vue is able to detect changes to it (more info: https://stackoverflow.com/a/55379279)
          automotiveAndMobility: false,
          manufacturing: false,
          agriAutomation: false,
        },
      },
      filteredCompanies: [],
      searchValue: '',
      searchValueDelayed: '',
      searchBarBackground: '',
    }
  },
  head() {
    return {
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
    filteredResults() {
      let results = []

      if (this.fetchedData.length > 0) {
        // call filterResults from mixin 'filters'
        results = this.filterResults(
          this.fetchedData,
          this.filters,
          this.searchValueDelayed,
          this.filters.specializations,
          'and'
        )
      }
      return results
    },
    mappedResults() {
      // call mapResults from mixin 'filters'
      return this.mapResults(this.filteredResults)
    },
    visibleResults() {
      return this.mappedResults
        ? this.mappedResults
        : new Array(10).fill(this.getResultDataObject(true))
    },
    filterCount() {
      // call countFilters from mixin 'filters'
      return this.countFilters(this.filteredResults)
    },
  },
  created() {
    this.initConfigPropertiesFromEnvvars()
  },
  mounted() {
    this.fetchResults()

    // Define CSS Variables
    this.setStandardGlobalCSSVariables(
      this.$refs.homepage,
      this.getConfigProperty('primaryColor')
    )

    window.addEventListener('scroll', this.adjustHeaderHeight)
    window.addEventListener('touchmove', this.adjustHeaderHeight)
    window.addEventListener('resize', () => {
      this.isInLandscapeMode = this.landscapeMode()
    })

    document.onkeyup = function (e) {
      if (e.ctrlKey && e.key === 'k') {
        // Ctrl+K: focus searchbar
        e.preventDefault()
        e.stopPropagation()
        const searchbar = document.getElementById('searchbar')
        if (searchbar) searchbar.focus()
        return false
      } else if (e.key === 'Tab') {
        // tab: scroll element into view, so it's completely visible
        const activeElement = document.activeElement
        if (activeElement.parentElement.id === 'actorsList') {
          document.activeElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          })
        }
      }
    }

    this.$root.$on('set-filters', this.setFilters)
  },
  methods: {
    async fetchResults() {
      this.fetchedData = await this.fetchAllCompanies()
      this.loading = false
    },
    toggleAdvancedFiltersVisibility() {
      this.areAdvancedFiltersVisible = !this.areAdvancedFiltersVisible
    },
    delaySearch() {
      clearTimeout(searchTypingTimer)
      searchTypingTimer = setTimeout(this.doneTyping, 250)
    },
    doneTyping() {
      this.searchValueDelayed = this.searchValue
    },
    setFilters(newFilters) {
      this.filters = newFilters
    },
    resetFilters() {
      this.filters = {}
    },
    showMapModal() {
      this.$modal.show(
        WebComponent,
        {
          showHomeView: false,
          showLanguageSelect: false,
          initialFilters: this.filters,
          primaryColor: this.getConfigProperty('primaryColor'),
        },
        {
          name: 'webcomponent',
          focusTrap: true,
          width: '90%',
          height: this.isInLandscapeMode ? '90%' : '85%',
          transition: 'modal',
        }
      )
    },
    showFilterModal() {
      this.$modal.show(
        FiltersMenu,
        { initialFilters: this.filters, filterCount: this.filterCount },
        {
          name: 'filtersmenu',
          focusTrap: true,
          width: '95%',
          height: 'auto',
          shiftY: 0.25,
          styles:
            'background-color: ' +
            twConfig.theme.colors.secondary +
            ';' +
            'border-radius: ' +
            twConfig.theme.borderRadius.lg +
            ';',
          transition: 'modal',
        }
      )
    },
    adjustHeaderHeight() {
      const scrollTop =
        document.body.scrollTop || document.documentElement.scrollTop
      const newHeight = 200 - scrollTop > 75 ? 200 - scrollTop : 75
      if (this.$refs.searchBar) {
        const animation = this.$refs.searchBar.animate(
          { height: newHeight + 'px' },
          500
        )
        const searchBarStyle = this.$refs.searchBar.style
        animation.onfinish = function () {
          animation.cancel()
          searchBarStyle.height = newHeight + 'px'
        }
      }
      if (this.$refs.searchBarOffsetBox) {
        const newHeightOffsetBox = 50.0 * ((newHeight - 75.0) / 125.0)
        const animation = this.$refs.searchBarOffsetBox.animate(
          { height: newHeightOffsetBox + 'px' },
          500
        )
        const searchBarOffsetBoxStyle = this.$refs.searchBarOffsetBox.style
        animation.onfinish = function () {
          animation.cancel()
          searchBarOffsetBoxStyle.height = newHeightOffsetBox + 'px'
        }
      }
    },
  },
}
</script>

<style>
.homepage {
  display: initial;
  /**
   * INFO: the at rule @conainer is supported by all major Browsers since February 2023,
   * but some linters still warn about it.
   *
   * browser-compatibility: https://developer.mozilla.org/en-US/docs/Web/CSS/@container#browser_compatibility
   * stylelint 14.12.0: https://github.com/stylelint/stylelint/releases/tag/14.12.0
   */
  container-type: inline-size;
  container-name: noi-automotive-component-view;

  & .search-bar-ct {
    @apply fixed my-4 rounded-lg bg-gray-100;

    max-width: calc(100% - 2.5rem);
    width: 1500px;
    height: 200px;
    top: 100px !important;
    left: 50%;
    transform: translate(-50%, 0);
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    background-position: center;
    background-size: cover;

    container-type: inline-size;
    container-name: search-bar-ct;

    & .search-bar {
      @apply h-12 flex;

      max-width: calc(1300px * 0.4 - 3rem);
      width: calc(100% - 2 * theme('spacing.6'));

      & .text-input {
        @apply w-full rounded-lg;

        border: 2px solid white;

        & input {
          @apply flex-initial rounded-lg;
        }
      }
    }
    & .search-bar-offset-box {
      height: 30px;
    }

    & .filter-bt {
      @apply flex-none ml-4 inline-block;

      border-radius: 18px;
      position: relative;
    }
  }

  & .company-list {
    @apply relative flex h-fit mx-auto;

    max-width: 1300px;
    top: calc(
      300px + 2 * theme('spacing.4')
    ); /* 100px header height, 200px search-bar-ct height, 2 * theme('spacing.4') 200px search-bar-ct margin */

    & aside {
      @apply pl-5;

      flex: 30%;

      & .map-col {
        @apply mb-6;

        & .top-desc {
          @apply flex items-center text-sm text-grey font-light;

          height: 30px;
        }

        & .map-ct {
          @apply bg-secondary cursor-pointer;
          filter: drop-shadow(0 9px 7px rgba(0, 0, 0, 0.1));

          height: 240px;
          width: 100%;

          & .map {
            @apply pointer-events-none;

            & .ol-viewport {
              @apply rounded-t-lg;
            }
          }
        }
      }
    }

    & main {
      flex: 70%;
    }
  }
}

.full-screen-loader {
  @apply fixed flex items-center justify-center top-0 right-0 bottom-0 left-0 bg-white bg-opacity-75 z-30 opacity-0 pointer-events-none;

  height: 100vh;

  &.visible {
    @apply opacity-100 pointer-events-auto;
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.5s;
}
.modal-enter,
.modal-leave-active {
  opacity: 0;
}
</style>
