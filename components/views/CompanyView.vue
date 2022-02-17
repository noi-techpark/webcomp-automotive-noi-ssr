<template>
  <RightColumn class="company-view" :visible="visible">
    <ViewBackground :visible="visible" />
    <SlidingContainer class="container" :visible="visible">
      <div class="close" @click="hideCompany">
        <Icon name="cross" />
      </div>
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
      this.$emit('onHide')
    },
  },
}
</script>

<style lang="postcss" scoped>
.company-view {
  & .container {
    /* TODO */
  }
}
</style>
