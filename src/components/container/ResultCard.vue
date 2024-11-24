<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <article :class="cardType" class="card clickable">
    <!-- card design from https://tailwind-elements.com/docs/standard/components/cards/ -->
    <img
      class="card-image"
      :src="result.image ? getConfigProperty('apiEndpoint') + getAvailableImageFormat(result.image.formats, false) : ''"
      alt=""
    />
    <div class="card-desc">
      <h5>
        {{ result.name }}
      </h5>
      <p class="card-company-desc">
        {{ truncate(result.companyDescription, maxDescriptionLength, true) }}
      </p>
      <p class="card-company-city">
        {{ result.city }}
      </p>
    </div>
  </article>
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
    maxDescriptionLength: {
      type: Number,
      default: 175,
    },
    cardType: {
      type: String,
      default: 'desktop',
      validator(value) {
        return ['desktop', 'mobile'].includes(value)
      },
    }
  },
}
</script>

<style lang="postcss" scoped>
.desktop {
  &.card {
    @apply flex flex-row mx-6 mb-4 cursor-pointer select-none rounded-lg bg-secondary shadow;

    & .card-image {
      @apply h-fit w-48 min-w-[8rem] min-w-[12rem] rounded-lg object-top object-scale-down;
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
}
.mobile {

  &.card {
    @apply block m-4 rounded-lg bg-white shadow;

    & .card-image {
      @apply h-32 mx-auto rounded-lg object-scale-down;
    }

    & .card-desc {
      @apply p-4 pt-0.5;

      & h5 {
        @apply mb-1 text-lg font-bold;
      }

      & .card-company-desc {
        @apply mb-4 text-base;
      }

      & .card-company-city {
        @apply text-xs;
      }
    }
  }
}
</style>
