<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div
    ref="filtersmenu"
    class="filters-menu-website"
    role="menu"
    :aria-label="$t('common.filters')"
  >
    <h1 class="top-title">
      <Icon class="filter-icon" name="filter" /><b>{{
        $t('common.filters')
      }}</b>
    </h1>
    <div class="list">
      <div v-if="isFilterVisible('specializationArea')" class="category-filter">
        <InputLabel :text="$t('filters.specialization').toUpperCase()" />
        <multiselect
          v-model="specializations"
          :options="specializationOptions"
          label="name"
          track-by="value"
          :multiple="true"
          :close-on-select="false"
          :preserve-search="true"
          :placeholder="$t('common.select') + '...'"
          tag-placeholder=""
          select-label=""
          deselect-label=""
          :preselect-first="false"
        >
          <template slot="option" slot-scope="props">
            <span>{{
              props.option.name +
              ' (' +
              filterCount.categories[props.option.value] +
              ')'
            }}</span>
          </template>
        </multiselect>
      </div>
      <Select
        v-if="isFilterVisible('industrialSector')"
        v-model="filters.industrialSector"
        :label="$t('filters.industrialSector')"
        :aria-label="'filter: ' + $t('filters.industrialSector').toUpperCase()"
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
        v-if="isFilterVisible('valueChainPosition')"
        v-model="filters.valueChainPosition"
        :label="$t('filters.valueChainPosition').toUpperCase()"
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
        v-if="isFilterVisible('employees')"
        v-model="filters.employees"
        :label="$t('filters.numberOfEmployees').toUpperCase()"
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
        v-if="isFilterVisible('turnover')"
        v-model="filters.turnover"
        :label="$t('filters.turnover').toUpperCase()"
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
        v-if="isFilterVisible('certifications')"
        v-model="filters.certification"
        :label="$t('filters.certification').toUpperCase()"
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
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'

import utils from '~/mixins/utils.js'
import filters from '~/mixins/filters.js'

export default {
  components: {
    Multiselect,
  },

  mixins: [utils, filters],

  inject: {
    // inject primaryColor from WebComponent.vue
    primaryColor: {
      from: 'primary-color',
      default: '#0000ff',
    },
  },

  props: {
    initialFilters: {
      type: Object,
      default: null,
    },
    filterCount: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      filters: {},
      specializations: [],
    }
  },

  watch: {
    filters(newFilters) {
      this.$root.$emit('set-filters', newFilters)
    },
    specializations(newSpecializations) {
      const newSpecializationBoolean = {
        automotiveAndMobility: false,
        manufacturing: false,
        agriAutomation: false,
      }

      newSpecializations.forEach((specialization) => {
        newSpecializationBoolean[specialization.value] = true
      })
      this.filters.specializations = newSpecializationBoolean
      // this.$root.$emit('set-filters', this.filters)
    },
  },

  mounted() {
    this.setStandardGlobalCSSVariables(
      this.$refs.filtersmenu,
      this.getConfigProperty('primaryColor')
    )

    if (this.initialFilters) {
      this.filters = this.initialFilters
    }
  },

  methods: {
    resetFilters() {
      this.filters = {}
      this.specializations = []
    },
  },
}
</script>

<style>
.filters-menu-website {
  @apply relative bg-white px-5 rounded-lg;
  filter: drop-shadow(0 9px 7px rgba(0, 0, 0, 0.1));

  z-index: 1;

  & .top-title {
    @apply text-2xl text-black uppercase pt-8 pb-4;

    & .filter-icon {
      @apply w-6 pr-2 align-baseline;
    }
  }

  & .list {
    @apply relative flex flex-col h-max left-0 right-0 pb-5;

    & .select {
      @apply mb-4;

      & label {
        @apply w-fit pt-1 rounded-lg mb-0;

        font-size: 1rem;
        color: var(--primary-color);
      }

      & .selector {
        @apply py-1;

        border: 1px solid var(--primary-color);

        & select {
          min-height: 32px;
        }
      }
    }

    & .category-filter {
      @apply mb-4;

      & label {
        @apply w-fit pt-1 rounded-lg mb-0;

        font-size: 1rem;
        color: var(--primary-color);
      }
    }

    & .reset-filters-bt {
      @apply self-end;
    }
  }
}

/* overwrite css for multiselect */
.multiselect {
  @apply rounded-lg bg-white;

  border: 1px solid var(--primary-color);
  width: calc(100% - 4px);

  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 500'><path d='m 3.562255,158.69404 3.6,-5.2 c 6.4,-9.1 18.9,-11.4 28.1,-5 l 214.699995,149.7 214.7,-149.6 c 9.1,-6.4 21.7,-4.1 28.1,5 l 3.6,5.2 c 6.4,9.1 4.1,21.7 -5,28.1 l -241.4,168.2 -241.399995,-168.3 c -9.10000002,-6.4 -11.3,-18.9 -5,-28.1 z' /></svg>");
  background-position: calc(98% - 1rem) center;
  background-size: 18px auto;
  background-repeat: no-repeat;
}
.multiselect--active {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 500'><path d='m 3.5880746,196.40172 3.6,5.2 c 6.4000004,9.1 18.9000004,11.4 28.1000004,5 L 249.98807,56.901718 l 214.7,149.600002 c 9.1,6.4 21.7,4.1 28.1,-5 l 3.6,-5.2 c 6.4,-9.1 4.1,-21.7 -5,-28.1 L 249.98807,0.00171832 8.5880746,168.30172 c -9.09999999,6.4 -11.3,18.9 -5,28.1 z' /></svg>");
  background-position: calc(98% - 1rem) 75%;
}
.multiselect__select {
  display: none;
}
.multiselect__tag {
  background: var(--primary-color);
}
.multiselect__tags {
  min-height: 1.5rem;
  padding-left: 1rem;
  border: none;
  background-color: transparent;
}

.multiselect__content-wrapper {
  border: 1px solid var(--primary-color);
}

.multiselect__option--highlight {
  background: var(--primary-hover);
}

.multiselect__option--highlight:after {
  background: var(--primary-hover);
}

.multiselect__option--selected.multiselect__option--highlight {
  background: var(--primary-hover);
}

.multiselect__option--selected.multiselect__option--highlight:after {
  background: var(--primary-hover);
}

.multiselect__tag-icon:hover {
  background: var(--primary-hover);
}

.multiselect__placeholder {
  @apply text-black text-opacity-60 text-base;

  margin-left: 0;
}
</style>
