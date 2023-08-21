<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
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
</template>

<script>
import utils from '~/mixins/utils.js'
import filters from '~/mixins/filters.js'

export default {
  mixins: [utils, filters],

  inject: {
    // inject primaryColor from WebComponent.vue
    primaryColor: {
      from: 'primary-color',
      default: '#0000ff'
    }
  },

  props: {
    initialFilters: {
      type: Object,
      default: null,
    },
    filterCount: {
      type: Object,
      default: ()=>{}
    }
  },

  data() {
    return {
      filters: {},
    }
  },

  watch: {
    filters(newFilters) {
      this.$root.$emit('set-filters', newFilters)
    }
  },

  mounted() {
    this.setStandardGlobalCSSVariables(this.$refs.filtersmenu, this.primaryColor);

    if (this.initialFilters) {
      this.filters = this.initialFilters
    }
  },

  methods: {
    resetFilters() {
      this.filters = {}
    },
  }
}

</script>

<style>

.filters-menu {
  @apply relative bg-secondary drop-shadow-xl px-5 rounded-lg;

  border: 3px solid var(--primary-color);
  z-index: 1;

  & .top-title {
    @apply text-lg text-black uppercase my-5;
  }

  & .list {
    @apply relative flex flex-col h-max left-0 right-0 px-5 pb-5;

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
      @apply self-end;
    }
  }
}
</style>