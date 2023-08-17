<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div ref="homepage" class="homepage"  style="height: 100vh;">
    <HeaderNOI />
    <div ref="searchBar" class="search-bar-ct" role=search>
      <div class="search-bar">
        <TextInput
          v-model="searchValue"
          :placeholder="$t('filters.searchPlaceholder')"
          type="search"
          aspect="fill"
        />
      </div>
    </div>
    <div class="company-list">
      <aside>
        <div class="map-col">
          <!--
          <div class="top-desc">
            TODO: add here optional top description 
          </div>
          -->
          <div class="map-ct clickable" data-not-lazy @click="showMapModal()">
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
        <div ref="filtersmenu" class="filters-menu" role="menu" :aria-label="$t('common.filters')">
          <h1 class="top-title">{{ $t('common.filters') }}</h1>
          <div class="list">
            <Select
              v-model="filters.industrialSector"
              :label="$t('filters.industrialSector')"
              :aria-label="'filter: ' + $t('filters.industrialSector')"
              aria-controls="actorsList"
              :options="industrialSectors"
              :filter-count="filterCount.industrialSectors"
              aspect="fill"
              :white-contrast="true"
              class="select"
              role="menuitem"
              aria-haspopup="listbox"
            />
            <Select
              v-model="filters.valueChainPosition"
              :label="$t('filters.valueChainPosition')"
              :aria-label="'filter: ' + $t('filters.valueChainPosition')"
              aria-controls="actorsList"
              :options="valueChainPositions"
              :filter-count="filterCount.valueChainPositions"
              aspect="fill"
              :white-contrast="true"
              class="select"
              role="menuitem"
              aria-haspopup="listbox"
            />
            <Select
              v-model="filters.employees"
              :label="$t('filters.numberOfEmployees')"
              :aria-label="'filter: ' + $t('filters.numberOfEmployees')"
              aria-controls="actorsList"
              :options="employees"
              :filter-count="filterCount.employeeNumber"
              aspect="fill"
              :v-contrast="true"
              class="select"
              role="menuitem"
              aria-haspopup="listbox"
            />
            <Select
              v-model="filters.turnover"
              :label="$t('filters.turnover')"
              :aria-label="'filter: ' + $t('filters.turnover')"
              aria-controls="actorsList"
              :options="turnovers"
              :filter-count="filterCount.turnovers"
              aspect="fill"
              :white-contrast="true"
              class="select"
              role="menuitem"
              aria-haspopup="listbox"
            />
            <Select
              v-model="filters.certification"
              :label="$t('filters.certification')"
              :aria-label="'filter: ' + $t('filters.certification')"
              aria-controls="actorsList"
              :options="certifications"
              :filter-count="filterCount.certifications"
              aspect="fill"
              :white-contrast="true"
              class="select"
              role="menuitem"
              aria-haspopup="listbox"
            />
            <Button
              :value="$t('filters.resetFilters')"
              class="reset-filters-bt"
              type="primary"
              @click="resetFilters"
            />
          </div>
        </div>
      </aside>
      <main>
        <div id="actorsList" class="results-ct" aria-live="polite">
          <NuxtLink
            v-for="(resultItem, index) in visibleResults"
            :key="new Date().getTime() + '-' + index"
            :to="'/actors/' + encodeURIComponent(resultItem.name)"
            target="_blank"
            :aria-label="$t('company.profile') + resultItem.name"
          >
            <ResultCard :result="resultItem" :max-description-length="300" :index="index" />
          </NuxtLink>
          <div v-if="!visibleResults.length" class="no-results-notice">
            {{ $t('common.noCompaniesFound') }}
          </div>
        </div>
      </main>
    </div>
  <div class="full-screen-loader" :class="{ visible: loading }">
    <Loader colorscheme="colored" />
  </div>
  </div>
</template>

<script>
import utils from '~/mixins/utils.js'
import filters from '~/mixins/filters.js'
import WebComponent from '@/components/bundle/WebComponent'

export default {
  components: {
    CompanieMapping: () => import('@/components-lazy/ui/generic/Map'),
  },

  mixins: [utils, filters],

  data() {
    return {
      loading: true,
      areAdvancedFiltersVisible: true,
      fetchedData: [],
      filters: {},
      filteredCompanies: [],
      searchValue: '',
      primaryColor: '#0000ff'
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

      if (this.fetchedData) {
        // call filterResults from mixin 'filters'
        results = this.filterResults(this.fetchedData, this.filters, this.searchValue)
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
  mounted() {
    this.fetchResults()

    // Define CSS Variables
    this.setGlobalCSSVariable('--primary-color', this.primaryColor);
    this.setGlobalCSSVariable('--primary-hover', this.hexAdjustBrightness(this.primaryColor, this.getTextColor(this.primaryColor) === 'white' ? -20 : 20));
    this.setGlobalCSSVariable('--primary-color-text', this.getTextColor(this.primaryColor));

    window.addEventListener('scroll', this.adjustHeaderHeight)

    document.onkeyup = function(e) {
      if (e.ctrlKey && e.key === 'k') { // Ctrl+K: focus searchbar
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('searchbar').focus()
        return false
      } else if (e.key === 'Tab') { // tab: scroll element into view, so it's completely visible
        const activeElement = document.activeElement
        if(activeElement.parentElement.id === 'actorsList') {
          console.log("activeElement: %o", document.activeElement)
          document.activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }
    };
  },
  methods: {
    async fetchResults() {
      this.fetchedData = await this.fetchAllCompanies()
      this.loading = false
    },
    toggleAdvancedFiltersVisibility() {
      this.areAdvancedFiltersVisible = !this.areAdvancedFiltersVisible
    },
    setFilters(newFilters) {
      this.filters = newFilters
    },
    resetFilters() {
      this.filters = {}
    },
    setGlobalCSSVariable(varname, value) {
      if(this.$refs.homepage)
        this.$refs.homepage.style.setProperty(varname, value)
    },
    showMapModal() {
      this.$modal.show(WebComponent, 
        {showHomeView: false, showLanguageSelect: false, initialFilters: this.filters},
        {name: 'webcomponent', focusTrap: true, width: '90%', height:  this.isInLandscapeMode ? '90%' : '85%', transition: 'modal',},
      )
    },
    mapModalBeforeOpen() {
      this.$root.$on('set-filters', this.setFilters)
    },
    mapModalClosed() {
      this.$root.$off('set-filters', this.setFilters)
    },
    adjustHeaderHeight() {
      const scrollTop = document.body.scrollTop || document.documentElement.scrollTop
      const newHeight = ((200 - scrollTop > 75) ? (200 - scrollTop) : 75)
      if(this.$refs.searchBar) {
        const animation = this.$refs.searchBar.animate({height: newHeight + 'px'}, 500)
        const searchBarStyle = this.$refs.searchBar.style 
        animation.onfinish = function () {
          animation.cancel()
          searchBarStyle.height = newHeight + 'px'
        }
      }
    }
  },
}
</script>

<style>
.homepage {
  & .search-bar-ct {
    @apply fixed my-4 rounded-lg;

    max-width: calc(100% - 2.5rem);
    width: 1500px;
    height: 200px;
    top: 100px !important;
    left: 50%;
    transform: translate(-50%, 0);
    z-index: 2;
    
    background-image: url('https://cdn.webcomponents.opendatahub.testingmachine.eu/dist/e3df9ad8-e78f-48d8-88d2-089657d27de5/home-cover.jpg');
    background-position: center;
    background-size: cover;

    & .search-bar {
      @apply absolute mx-12 h-12;

      width: calc(1300px * 0.3);
      top: calc(50% - ((theme('spacing.12') + 4px) / 2));

      & input {
        @apply rounded-lg;
      }
    }
  }

  & .company-list {
    @apply relative flex h-fit mx-auto;

    max-width: 1300px;
    top: calc(100px + 25vh + 2 * theme('spacing.4'));

    & aside {
      @apply pl-5;

      flex: 30%;

      & .map-col {
        & .top-desc {
          @apply flex items-center text-sm text-grey font-light;

          height: 30px;
        }

        & .map-ct {
          @apply bg-secondary drop-shadow-xl cursor-pointer;

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

      & .filters-menu {
        @apply relative bg-secondary drop-shadow-xl px-5 my-5 rounded-lg;

        border: 3px solid var(--primary-color);
        z-index: 1;

        & .top-title {
          @apply text-lg text-black uppercase my-5;
        }

        & .list {
          @apply relative overflow-y-auto h-[480px] left-0 right-0 px-5 pb-5;

          & .select {
            @apply mb-4;

            & label {
              @apply w-fit py-1 px-3 rounded-lg;

              font-size: 1.25rem;
              background-color: var(--primary-color);
              color: var(--primary-color-text);
            }

            & .selector {
              @apply py-1;

              border: 2px solid blue;
            }
          }

          & .reset-filters-bt {
            @apply absolute right-5;
          }
        }
      }
    }

    & main {
      flex: 70%;

      & .results-ct {
      @apply h-full;

        & .card {
          @apply bg-secondary;
        }

        & .no-results-notice {
          @apply mx-6 text-base text-grey my-6;
        }
      }
    }
  }
}
.full-screen-loader {
  @apply fixed flex items-center justify-center top-0 right-0 bottom-0 left-0 bg-white bg-opacity-75 z-30 opacity-0 pointer-events-none;

  &.visible {
    @apply opacity-100 pointer-events-auto;
  }
}
</style>
