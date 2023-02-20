<template>
  <div>
    <WebComponent />
  </div>
</template>

<script>
import WebComponent from '@/components/bundle/WebComponent'
import vueI18n from '@/plugins/vueI18n'

export default {
  i18n: vueI18n,
  components: { WebComponent },

  props: {
    websiteMode: {
      type: String,
      default: 'false',
    },

    customLinks: {
      type: String,
      default: '',
    },

    defaultCompany: {
      type: String,
      default: '',
    },

    language: {
      type: String,
      default: 'en',
    },
  },
}
</script>
