<template>
  <div style="height: 100vh; overflow: hidden">
    <WebComponent website-mode="true" />
  </div>
</template>

<script>
export default {
  head() {
    return {
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('home.meta.description'),
        },
      ],
    }
  },
}
</script>
