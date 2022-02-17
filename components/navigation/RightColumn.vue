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
</style>
