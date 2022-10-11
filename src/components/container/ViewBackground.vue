<template>
  <div class="background" :class="{ visible }"></div>
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
.background {
  @apply absolute w-full h-full bg-black bg-opacity-75 opacity-0 pointer-events-none transition duration-300;

  &.visible {
    & .background {
      @apply opacity-100 pointer-events-auto;
    }
  }
}
</style>
