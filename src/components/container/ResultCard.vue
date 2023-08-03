<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div class="result clickable" @click="$emit('showResult', result)">
    <!-- card design from https://tailwind-elements.com/docs/standard/components/cards/ -->
    <div
      class="card"
    >
      <img
        v-lazy-load
        class="card-image"
        :data-src="result.image ? getApiEndpoint() + getAvailableImageFormat(result.image.formats) : ''"
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
    @apply h-fit w-48 min-w-[12rem] rounded-lg object-top object-scale-down mix-blend-multiply;
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
