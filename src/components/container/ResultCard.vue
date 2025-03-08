<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <article :class="cardType" class="card clickable">
    <!-- card design from https://tailwind-elements.com/docs/standard/components/cards/ -->
    <img
      class="card-image"
      :src="result.image ? getConfigProperty('apiEndpoint') + getAvailableImageFormatV2(result.image, false) : ''"
      alt=""
    />
    <div class="card-desc">
      <h5>
        {{ result.name }}
      </h5>
      <p class="card-company-desc">
        {{ truncate(result.companyDescription, maxDescriptionLength, true) }}
      </p>
      <div class="card-company-bottom">
        <p class="card-company-city">
          {{ result.city }}
        </p>
        <div class="open-button">
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 500'  xmlns:v='https://vecta.io/nano'>
            <path
              style='fill:#ececec'
              d='M158.7 496.4l-5.2-3.6c-9.1-6.4-11.4-18.9-5-28.1L298.2 250 148.6 35.3c-6.4-9.1-4.1-21.7 5-28.1l5.2-3.6c9.1-6.4 21.7-4.1 28.1 5L355.1 250 186.8 491.4c-6.4 9.1-18.9 11.3-28.1 5z'
            />
          </svg>
        </div>
      </div>
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
    @apply flex flex-row mx-6 mb-4 cursor-pointer select-none rounded-lg bg-white;
    filter: drop-shadow(0 9px 7px rgba(0, 0, 0, 0.1));

    & .card-image {
      @apply m-2 rounded-2xl;

      min-width: 10rem;
      width: 10rem;
      height: 9rem;
    }

    & .card-desc {
      @apply flex flex-col justify-start p-4 pt-0.5 w-full;

      & h5 {
        @apply mb-2 mt-3 text-2xl font-bold;
      }

      & .card-company-desc {
        @apply mb-4 text-base;
      }

      & .card-company-bottom {
        flex-basis: 50%;
        display: flex;
        justify-content: space-between;
        align-items: end;

        & .card-company-city {
          @apply text-xs text-grey;
        }

        & .open-button {
          @apply w-5 h-5  rounded-full bg-black flex justify-center items-center;

          & svg {
            width: 60%;
          }
        }
      }
    }
  }
}
.mobile {

  &.card {
    @apply block m-4 rounded-lg bg-white;
    filter: drop-shadow(0 9px 7px rgba(0, 0, 0, 0.1));

    & .card-image {
      @apply m-2 rounded-2xl;

      min-width: 10rem;
      width: 10rem;
      height: 9rem;
    }

    & .card-desc {
      @apply p-4 pt-0.5;

      & h5 {
        @apply mb-1 text-lg font-bold;
      }

      & .card-company-desc {
        @apply mb-4 text-base;
      }

      & .card-company-bottom {
        flex-basis: 50%;
        display: flex;
        justify-content: space-between;
        align-items: end;

        & .card-company-city {
          @apply text-xs;
        }
        & .open-button {
          @apply w-5 h-5  rounded-full bg-black flex justify-center items-center;

          & svg {
            width: 60%;
          }

        }
      }
    }
  }
}
</style>
