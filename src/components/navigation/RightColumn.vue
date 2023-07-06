<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div class="right-column" :class="{ visible }">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
}
</script>

<style lang="postcss" scoped>
.right-column {
  @apply absolute top-0 left-navbar right-0 pointer-events-none h-full;

  &.visible {
    @apply pointer-events-auto;
  }
}

@container noi-automotive-component-view (max-width: theme('screens.md')) { /* stylelint-disable-line at-rule-no-unknown */
  .right-column {
    @apply left-0 h-auto bottom-0 z-10;
  }
}
</style>
