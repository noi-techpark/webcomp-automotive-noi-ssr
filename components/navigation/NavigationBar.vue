<template>
  <div class="navigation-bar">
    <!-- TODO -->
    <div @click="onCompanyClick('test')">FIXME: showCompany</div>
    <div @click="didLeaveHome()">FIXME: leaveHome</div>
    <div @click="didReachHome()">FIXME: backHome</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      /* TODO */
    }
  },

  methods: {
    onCompanyClick(companyId) {
      this.$emit('onCompanyClick', companyId)
    },

    didLeaveHome() {
      this.$emit('didLeaveHome')
    },

    didReachHome() {
      this.$emit('didReachHome')
    },
  },
}
</script>

<style lang="postcss" scoped>
.navigation-bar {
  @apply absolute w-navbar top-0 left-0 bottom-0 bg-white;
}
</style>
