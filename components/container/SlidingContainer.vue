<template>
  <div class="container" :class="{ visible }">
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
.container {
  @apply absolute w-full h-full bg-secondary transition duration-300 pointer-events-none;

  transform: translateY(100vh);

  &.visible {
    @apply transform-none pointer-events-auto;
  }
}
</style>
