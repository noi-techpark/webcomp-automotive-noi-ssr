<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div id="actorsList" class="results-ct" aria-live="polite">
    <TransitionGroup name="list">
      <NuxtLink
        v-for="(resultItem, index) in resultList"
        :key="new Date().getTime() + '-' + index"
        :to="($i18n.locale != 'en' ? '/' + $i18n.locale : '') + '/actors/' + encodeURIComponent(resultItem.name)"
        target="_blank"
        :aria-label="$t('company.profile') + resultItem.name"
      >
        <ResultCard
          :result="resultItem"
          :max-description-length="maxDescriptionLength"
          :card-type="cardType"
          :index="index"
        />
      </NuxtLink>
    </TransitionGroup>
    <div v-if="!resultList.length" class="no-results-notice">
      {{ $t('common.noCompaniesFound') }}
    </div>
  </div>
</template>

<script>
import utils from '~/mixins/utils.js'

export default {
  mixins: [utils],

  props: {
    resultList: {
      type: Array,
      default: () => [],
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

<style>
.results-ct {
  @apply h-full;

  & .card {
    @apply bg-secondary;
  }

  & .no-results-notice {
    @apply mx-6 text-base text-grey my-6;
  }
}

.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(75%);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: sticky;
}
</style>
