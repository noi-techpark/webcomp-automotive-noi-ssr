<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div class="navigation-ct">
    <div class="navigation-bar">
      <div v-if="displayAsWebsite" class="lang-selector">
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
        <div class="logo clickable" @click="backToCategories">
          <Icon name="logo" />
        </div><div class="logo clickable" @click="backToCategories">
          <Icon name="logo-automotive" />
        </div>
      </div>
        <hr />
        <Transition name="fade">
        <div v-if="curSectionTitle" class="section-title">
          <div class="main-title">
            <div class="title" :class="{ visible: mainCategory !== null }">
              {{ curSectionTitle }}
            </div>
          </div>
          <div class="subtitle">
            <div
              class="back-button"
              :class="{ visible: mainCategory !== null }"
              @click="backToCategories"
            >
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
      <div class="results-ct">
        <div
          v-for="(result, index) in resultsList"
          :key="new Date().getTime() + '-' + index"
          class="result clickable"
          :class="{
            'is-main-category': result.isMainCategory,
            'is-placeholder': result.isPlaceholder,
          }"
          @click="showResult(result)"
        >
          <div class="name">
            {{ result.name || '' }}
            <div class="line"></div>
          </div>
          <div class="metric">{{ result.metric || '' }}</div>
          <div class="arrow">
            <Icon name="arrow-right-compressed" />
          </div>
        </div>
        <div v-if="!resultsList.length" class="no-results-notice">
          {{ $t('common.noCompaniesFound') }}
        </div>
      </div>
    </div>
    <div class="filters-menu" :class="{ visible: isFiltersMenuVisible }">
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
          aspect="fill"
          :white-contrast="true"
          class="select"
        />
        <Select
          v-model="filters.valueChainPosition"
          :label="$t('filters.valueChainPosition')"
          :options="valueChainPositions"
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
            aspect="fill"
            :white-contrast="true"
            class="select"
          />
          <Select
            v-model="filters.employees"
            :label="$t('filters.numberOfEmployees')"
            :options="employees"
            aspect="fill"
            :v-contrast="true"
            class="select"
          />
          <Select
            v-model="filters.certification"
            :label="$t('filters.certification')"
            :options="certifications"
            aspect="fill"
            :white-contrast="true"
            class="select"
          />
        </div>
        <Button
          :value="$t('filters.resetFilters')"
          class="button"
          type="secondary"
          @click="resetFilters"
        />
      </div>
    </div>
  </div>
</template>

<script>
import utils from '~/mixins/utils.js'

export default {
  mixins: [utils],

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
  },

  data() {
    return {
      CATEGORY_PREFIX: 'CATEGORY-',
      filters: {},
      searchValue: '',
      curSectionTitle: null,
      mainCategory: null,
      isFiltersMenuVisible: false,
      areAdvancedFiltersVisible: false,
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

    mainCategories() {
      return [
        this.getResultDataObject(
          false,
          this.CATEGORY_PREFIX + 'automotiveAndMobility',
          this.$t('common.automotiveAndMobility'),
          null,
          true
        ),
        this.getResultDataObject(
          false,
          this.CATEGORY_PREFIX + 'manufacturing',
          this.$t('common.manufacturing'),
          null,
          true
        ),
        this.getResultDataObject(
          false,
          this.CATEGORY_PREFIX + 'agriAutomation',
          this.$t('common.agriAutomation'),
          null,
          true
        ),
      ]
    },

    industrialSectors() {
      return [
        {
          value: '',
          name: this.$t('common.select') + '...',
        },
        {
          value: 'Automotive_Technology',
          name: this.$t('filters.automotiveTechnology'),
        },
        {
          value: 'Machinery_and_Plant_construction',
          name: this.$t('filters.machineryAndPlantConstruction'),
        },
        {
          value: 'Electronics_and_Electrical_Engineering',
          name: this.$t('filters.electronicsElectricalEngineering'),
        },
        {
          value: 'Plastics_and_Chemistry',
          name: this.$t('filters.pasticsChemics'),
        },
        {
          value: 'Information_Technology',
          name: this.$t('filters.informationtechnology'),
        },
        {
          value: 'Research_and_Development',
          name: this.$t('filters.researchAndDevelopment'),
        },
        {
          value: 'Service_Providers_and_Consulting',
          name: this.$t('filters.serivceProvidersConsultants'),
        },
        {
          value: 'Education_and_Training',
          name: this.$t('filters.educationAndTraining'),
        },
        {
          value: 'Other',
          name: this.$t('filters.other'),
        },
      ]
    },

    valueChainPositions() {
      return [
        {
          value: '',
          name: this.$t('common.select') + '...',
        },
        {
          value: 'Users',
          name: this.$t('filters.users'),
        },
        {
          value: 'Developers',
          name: this.$t('filters.developers'),
        },
        {
          value: 'Laboratories',
          name: this.$t('filters.laboratories'),
        },
        {
          value: 'Production',
          name: this.$t('filters.production'),
        },
        {
          value: 'Suppliers',
          name: this.$t('filters.suppliers'),
        },
        {
          value: 'Providers',
          name: this.$t('filters.providers'),
        },
        {
          value: 'Commerce_and_distribution',
          name: this.$t('filters.commerceAndDistribution'),
        },
      ]
    },

    turnovers() {
      return [
        {
          value: '',
          name: this.$t('common.select') + '...',
        },
        {
          value: '< 1 Mio',
          name: '< 1 ' + this.$t('common.million') + ' €',
        },
        {
          value: '1 - 2 Mio',
          name: '1 - 2 ' + this.$t('common.million') + ' €',
        },
        {
          value: '2 - 10 Mio',
          name: '2 - 10 ' + this.$t('common.million') + ' €',
        },
        {
          value: '10 - 50 Mio',
          name: '10 - 50 ' + this.$t('common.million') + ' €',
        },
        {
          value: '50 - 250 Mio',
          name: '50 - 250 ' + this.$t('common.million') + ' €',
        },
        {
          value: '250 - 500 Mio',
          name: '250 - 500 ' + this.$t('common.million') + ' €',
        },
        {
          value: '> 500 Mio',
          name: '> 500 ' + this.$t('common.million') + ' €',
        },
        {
          value: 'NOT-DEFINED',
          name: this.$t('filters.notDefined'),
        },
      ]
    },

    employees() {
      return [
        {
          value: '',
          name: this.$t('common.select') + '...',
        },
        {
          value: '<5',
          name: '< 5',
        },
        {
          value: '5-10',
          name: '5 - 10',
        },
        {
          value: '10-50',
          name: '10 - 50',
        },
        {
          value: '50-150',
          name: '50 - 150',
        },
        {
          value: '150-250',
          name: '150 - 250',
        },
        {
          value: '>250',
          name: '> 250',
        },
        {
          value: 'NOT-DEFINED',
          name: this.$t('filters.notDefined'),
        },
      ]
    },

    certifications() {
      return [
        {
          value: '',
          name: this.$t('common.select') + '...',
        },
        {
          value: 'ISO_9001',
          name: 'ISO 9001',
        },
        {
          value: 'ISO_14001',
          name: 'ISO 14001',
        },
        {
          value: 'ISO_45001',
          name: 'ISO 45001',
        },
        {
          value: 'IATF16949',
          name: 'IATF16949',
        },
        {
          value: 'EN_ISO_17025',
          name: 'EN ISO 17025',
        },
        {
          value: 'Other',
          name: this.$t('filters.other'),
        },
      ]
    },

    filteredResults() {
      let results = []

      if (this.fetchedData) {
        results = [...this.fetchedData]

        if (this.searchValue) {
          const cleanSearchVal = this.searchValue.toLowerCase()
          results = results.filter((r) =>
            (
              r.attributes.name +
              ' ' +
              r.attributes.companyDescription +
              ' ' +
              r.attributes.productsAndServices +
              ' ' +
              r.attributes.references +
              ' ' +
              r.attributes.companyContact.email +
              ' ' +
              r.attributes.contactPerson.email +
              ' ' +
              r.attributes.contactPerson.personName +
              ' ' +
              r.attributes.companyAddressStreet +
              ' ' +
              r.attributes.companyAddressStreet.cap
            )
              .toLowerCase()
              .includes(cleanSearchVal)
          )
        }

        if (this.mainCategory && this.mainCategory !== true) {
          results = results.filter((r) => {
            return (
              r.attributes.specialization &&
              r.attributes.specialization[this.mainCategory]
            )
          })
        }

        if (this.filters.industrialSector) {
          results = results.filter(
            (r) =>
              r.attributes.industrialSector === this.filters.industrialSector
          )
        }

        if (this.filters.valueChainPosition) {
          results = results.filter(
            (r) =>
              r.attributes.valueChainPosition ===
              this.filters.valueChainPosition
          )
        }

        if (this.filters.turnover) {
          switch (this.filters.turnover) {
            case '< 1 Mio':
              results = results.filter(
                (r) =>
                  r.attributes.metrics &&
                  r.attributes.metrics.turnover < 1000000
              )
              break
            case '1 - 2 Mio':
              results = results.filter(
                (r) =>
                  r.attributes.metrics &&
                  r.attributes.metrics.turnover >= 1000000 &&
                  r.attributes.metrics.turnover < 2000000
              )
              break
            case '2 - 10 Mio':
              results = results.filter(
                (r) =>
                  r.attributes.metrics &&
                  r.attributes.metrics.turnover >= 2000000 &&
                  r.attributes.metrics.turnover < 10000000
              )
              break
            case '10 - 50 Mio':
              results = results.filter(
                (r) =>
                  r.attributes.metrics &&
                  r.attributes.metrics.turnover >= 10000000 &&
                  r.attributes.metrics.turnover < 50000000
              )
              break
            case '50 - 250 Mio':
              results = results.filter(
                (r) =>
                  r.attributes.metrics &&
                  r.attributes.metrics.turnover >= 5000000 &&
                  r.attributes.metrics.turnover < 250000000
              )
              break
            case '250 - 500 Mio':
              results = results.filter(
                (r) =>
                  r.attributes.metrics &&
                  r.attributes.metrics.turnover >= 25000000 &&
                  r.attributes.metrics.turnover < 500000000
              )
              break
            case '> 500 Mio':
              results = results.filter(
                (r) =>
                  r.attributes.metrics &&
                  r.attributes.metrics.turnover >= 500000000
              )
              break
            case 'NOT-DEFINED':
              results = results.filter(
                (r) => r.attributes.metrics && !r.attributes.metrics.turnover
              )
              break
          }
        }

        if (this.filters.employees) {
          switch (this.filters.employees) {
            case '<5':
              results = results.filter(
                (r) =>
                  r.attributes.metrics &&
                  r.attributes.metrics.employeeNumber < 5
              )
              break
            case '5-10':
              results = results.filter(
                (r) =>
                  r.attributes.metrics &&
                  r.attributes.metrics.employeeNumber >= 5 &&
                  r.attributes.metrics.employeeNumber < 10
              )
              break
            case '10-50':
              results = results.filter(
                (r) =>
                  r.attributes.metrics &&
                  r.attributes.metrics.employeeNumber >= 10 &&
                  r.attributes.metrics.employeeNumber < 50
              )
              break
            case '50-150':
              results = results.filter(
                (r) =>
                  r.attributes.metrics &&
                  r.attributes.metrics.employeeNumber >= 50 &&
                  r.attributes.metrics.employeeNumber < 150
              )
              break
            case '150-250':
              results = results.filter(
                (r) =>
                  r.attributes.metrics &&
                  r.attributes.metrics.employeeNumber >= 150 &&
                  r.attributes.metrics.employeeNumber < 250
              )
              break
            case '>250':
              results = results.filter(
                (r) =>
                  r.attributes.metrics &&
                  r.attributes.metrics.employeeNumber >= 250
              )
              break
            case 'NOT-DEFINED':
              results = results.filter(
                (r) =>
                  r.attributes.metrics && !r.attributes.metrics.employeeNumber
              )
              break
          }
        }

        if (this.filters.certification) {
          results = results.filter(
            (r) =>
              r.attributes.certifications &&
              r.attributes.certifications[this.filters.certification] === true
          )
        }
      }

      const mappedResults = results.map((r) =>
        this.getResultDataObject(
          false,
          r.id,
          r.attributes.name,
          null,
          false,
          r.attributes.companyLocation
            ? Number(r.attributes.companyLocation.lat)
            : 0,
          r.attributes.companyLocation
            ? Number(r.attributes.companyLocation.lng)
            : 0
        )
      )

      mappedResults.sort((a, b) => a.name.localeCompare(b.name))

      return mappedResults
    },

    visibleResults() {
      return this.fetchedData
        ? this.filteredResults
        : new Array(10).fill(this.getResultDataObject(true))
    },

    resultsList() {
      return !this.mainCategory ? this.mainCategories : this.visibleResults
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

    filteredResults(newCompaniesList) {
      this.$emit('didFilterCompanies', newCompaniesList)
    },

    visibleCompany(newVisibleCompany) {
      if (newVisibleCompany && this.isFiltersMenuVisible) {
        this.hideFiltersMenu()
      }
    },
  },

  mounted() {
    this.fetchResults()
  },

  methods: {
    changeLanguage(lang) {
      this.$i18n.setLocale(lang)
    },

    getResultDataObject(
      isPlaceholder,
      id,
      name,
      metric,
      isMainCategory,
      lat,
      lng
    ) {
      return {
        isPlaceholder,
        id,
        name,
        metric,
        isMainCategory,
        coordinates: {
          lat,
          lng,
        },
      }
    },

    showResult(result) {
      if (String(result.id).startsWith(this.CATEGORY_PREFIX)) {
        const categoryId = result.id.replace(this.CATEGORY_PREFIX, '')
        this.curSectionTitle = result.name
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
      this.curSectionTitle = ''
      this.hideFiltersMenu()
      this.didReachHome()
    },

    onCompanyClick(companyId) {
      const companyData = this.fetchedData.find((c) => c.id === companyId)
      this.hideFiltersMenu()
      this.$emit('onCompanyClick', companyData)
    },

    didLeaveHome() {
      this.$emit('didLeaveHome')
    },

    didReachHome() {
      this.$emit('didReachHome')
    },

    toggleFiltersMenu() {
      this.isFiltersMenuVisible = !this.isFiltersMenuVisible
    },

    showFiltersMenu() {
      this.isFiltersMenuVisible = true
    },

    hideFiltersMenu() {
      this.isFiltersMenuVisible = false
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
  },
}
</script>

<style lang="postcss" scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 250ms ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.navigation-ct {
  & .navigation-bar {
    @apply absolute w-navbar top-0 left-0 bottom-0 bg-white;

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
          @apply text-xl text-black uppercase hidden;

          animation: fade-in 0.3s ease;

          &.visible {
            @apply block;
          }
        }
      }

      & .subtitle {
        height: 1rem;

        & .back-button {
          @apply text-grey text-sm cursor-pointer select-none hidden;

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
        top: 1.5px;
      }
    }

    & .results-ct {
      @apply overflow-y-auto overflow-x-hidden;

      margin-top: 4px;
      height: calc(100% - 10rem - 66px);

      & .result {
        @apply flex flex-row mx-6 mb-4 cursor-pointer select-none;

        animation: fade-in 0.3s ease;

        & .name {
          @apply flex-grow text-base text-black pr-4;

          & .line {
            @apply w-8 bg-black hidden;

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
    @apply absolute top-0 left-navbar bottom-0 transition duration-300 bg-secondary px-5;

    width: 15rem;
    z-index: 1;
    transform: translateX(-100%);

    & .top-title {
      @apply text-lg text-black uppercase my-5;
    }

    & .close {
      @apply absolute top-3 right-3 w-8 h-8 bg-white cursor-pointer;

      border-radius: 50%;

      & .inner {
        @apply flex h-full w-full items-center justify-center;

        & .ico {
          @apply w-3 h-3;

          fill: theme(colors.grey) !important;
        }
      }
    }

    & .list {
      @apply absolute overflow-y-scroll top-20 bottom-0 left-0 right-0 px-5;

      & .select {
        @apply mb-4;
      }

      & .advanced-filters-bt {
        @apply text-base text-primary text-black cursor-pointer select-none mb-3;

        &:hover {
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

      & .button {
        @apply mb-3;
      }
    }

    &.visible {
      @apply transform-none;
    }
  }
}

@media (max-width: theme('screens.md')) {
  .navigation-ct {
    & .navigation-bar {
      @apply w-full;

      bottom: 40vh;
    }

    & .filters-menu {
      @apply left-0;

      z-index: 3;
      bottom: 40vh;
    }
  }
}
</style>
