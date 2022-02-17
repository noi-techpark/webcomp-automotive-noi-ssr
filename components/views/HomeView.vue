<template>
  <RightColumn class="home-view" :visible="visible">
    <ViewBackground :visible="visible" />
    <SlidingContainer class="container" :visible="visible">
      TODO: I'm home
    </SlidingContainer>
  </RightColumn>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      /* TODO */
    }
  },

  methods: {
    hideCompany() {
      this.$emit('hideCompany')
    },
  },
}
</script>

<style lang="postcss" scoped>
.home-view {
  /* TODO */
}
</style>
