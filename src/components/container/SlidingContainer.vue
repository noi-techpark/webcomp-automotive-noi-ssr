<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div class="container" :class="{ visible }">
    <div class="content">
      <slot></slot>
    </div>
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
.container {
  @apply absolute w-full h-full bg-secondary transition duration-300 pointer-events-none;

  transform: translateY(100vh);
  max-width: initial;

  & .content {
    @apply relative h-full mr-auto ml-auto;

    max-width: 1200px;
  }

  &.visible {
    @apply transform-none pointer-events-auto;
  }
}
</style>
