<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div ref="filtersmenu" class="filters-menu-website" role="menu" :aria-label="$t('common.filters')">
    <div class="titlebar">
    <h1 class="top-title">{{ $t('common.filters') }}</h1>
      <div v-if="isModal" class="close" @click="$emit('close')">
        <div class="inner">
          <Icon name="cross" class="ico" />
        </div>
      </div>
    </div>
    <div class="list">
      <div class="category-filter">
        <InputLabel :text="$t('filters.specialization')"/>
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
          :preselect-first="false">
            <template slot="option" slot-scope="props">
              <span>{{ props.option.name + " (" + filterCount.categories[props.option.value] + ")" }}</span>
            </template>
        </multiselect>
      </div>
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
        :value="$t('filters.applyFilters')"
        class="apply-filters-bt"
        type="primary"
        icon="filter"
        @click="applyFilters"
      />
      <Button
        :value="$t('filters.resetFilters')"
        class="reset-filters-bt"
        type="secondary"
        icon="cross"
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
    Multiselect
  },

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
    },
    isModal: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      filters: {},
      specializations: [],
    }
  },

  // follwing code would apply filters on every change.
  // watch: {
  //   filters(newFilters) {
  //     this.$root.$emit('set-filters', newFilters)
  //   },
  //   specializations(newSpecializations) {
  //     const newSpecializationBoolean = {
  //       automotiveAndMobility: false,
  //       manufacturing: false,
  //       agriAutomation: false,
  //     }
  //     newSpecializations.forEach((specialization)=>{
  //       newSpecializationBoolean[specialization.value] = true
  //     })
  //     this.filters.specializations = newSpecializationBoolean
  //     // this.$root.$emit('set-filters', this.filters)
  //   }
  // },

  mounted() {
    this.setStandardGlobalCSSVariables(this.$refs.filtersmenu, this.primaryColor);

    if (this.initialFilters) {
      this.filters = this.initialFilters
    }
  },

  methods: {
    resetFilters() {
      this.filters = { specializations: {
        automotiveAndMobility: false,
        manufacturing: false,
        agriAutomation: false,
      }}
      this.specializations = []
      this.$root.$emit('set-filters', this.filters);
    },
    applyFilters() {
      const newSpecializationBoolean = {
        automotiveAndMobility: false,
        manufacturing: false,
        agriAutomation: false,
      }

      this.specializations.forEach((specialization)=>{
        newSpecializationBoolean[specialization.value] = true
      })
      this.filters.specializations = newSpecializationBoolean

      this.$root.$emit('set-filters', this.filters);
    }
  }
}

</script>

<style>

.filters-menu-website {
  @apply relative bg-secondary drop-shadow-xl px-5 rounded-lg;

  border: 3px solid var(--primary-color);
  z-index: 1;

  & .titlebar {
    @apply flex justify-between px-5;

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

        border: 2px solid var(--primary-color);
      }
    }

    & .category-filter {
      @apply mb-4;

      & label {
        @apply w-fit py-1 px-3 rounded-lg;

        font-size: 1.25rem;
        background-color: var(--primary-color);
        color: var(--primary-color-text);
      }
    }

    & .apply-filters-bt {
      @apply self-end mb-2;
    }

    & .reset-filters-bt {
      @apply self-end;

      border: 2px solid var(--primary-color);
    }
  }
}

/* overwrite css for multiselect */
.multiselect {
  @apply rounded-lg bg-white drop-shadow-xl;

  border: 2px solid var(--primary-color);
}
.multiselect__tag {
  background: var(--primary-color);
}
.multiselect__tags {
  min-height: 1.5rem;
  padding-left: 1rem;
  border: none;
}

.multiselect__content-wrapper {
  border: 2px solid var(--primary-color);
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
  @apply text-sm text-black text-base;

  margin-left: 0;
}
</style>