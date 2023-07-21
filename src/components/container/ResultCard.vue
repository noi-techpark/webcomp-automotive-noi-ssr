<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div class="result clickable" @click="$emit('showResult', result)">
    <div v-if="result.isMainCategory" class="mainCategory">
      <div
        class="result clickable"
        :class="{
          'is-main-category': result.isMainCategory,
          'is-placeholder': result.isPlaceholder,
        }"
        @click="$emit('showResult', result)"
      >
        <div class="name">
          {{
            result.name +
              (result.isMainCategory ? ' (' + filterCount + ')' : '') || ''
          }}
          <div class="line"></div>
        </div>
        <div class="metric">{{ result.metric || '' }}</div>
        <div class="arrow">
          <Icon name="arrow-right-compressed" />
        </div>
      </div>
    </div>
    <!-- card design from https://tailwind-elements.com/docs/standard/components/cards/ -->
    <div
      v-else
      class="card"
    >
      <img
        class="card-image"
        :src="result.image ? getApiEndpoint() + getAvailableImageFormat(result.image.formats) : ''"
        alt=""
      />
      <div class="card-desc">
        <h5>
          {{ result.name }}
        </h5>
        <p class="card-company-desc">
          {{ truncate(result.companyDescription, 175, true) }}
        </p>
        <p class="card-company-city">
          {{ result.city }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import utils from '~/mixins/utils.js'

export default {
  mixins: [utils],

  props: {
    result: {
      type: Object,
      default: () => {},
    },
    filterCount: {
      type: Number,
      default: 0,
    },
  },
  mounted() {
    // console.log('This is a resultCard\nresult[%o]: %o', this.result)
  },

  methods: {
    onClick() {
      this.$emit('click')
    },
  },
}
</script>

<style lang="postcss" scoped>
.result {
  @apply flex flex-row mx-6 mb-4 cursor-pointer select-none;

  animation: fade-in 0.3s ease;
}

.card {
  @apply flex rounded-lg bg-secondary;

  & .card-image {
    @apply h-48 w-48 rounded-t-lg object-scale-down;
  }

  & .card-desc {
    @apply flex flex-col justify-start p-4 pt-0.5;

    & h5 {
      @apply mb-2 text-lg font-bold;
    }

    & .card-company-desc {
      @apply mb-4 text-base;
    }

    & .card-company-city {
      @apply text-xs;
    }
  }
}
@container noi-automotive-component-view (max-width: theme('screens.md')) {
  .card {
  
    & .card-image {
      @apply h-24 w-24;
    }
  }
}
</style>
