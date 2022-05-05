<template>
  <PdfExporter
    :export-name="'All companies - ' + lang"
    :companies="companies"
  />
</template>

<script>
import utils from '~/mixins/utils.js'

export default {
  mixins: [utils],

  data() {
    return {
      lang: this.$route.query.lang || 'en',
      companies: null,
    }
  },

  mounted() {
    this.fetchCompanies()
  },

  methods: {
    fetchCompanies() {
      this.$axios
        .get(
          this.$config.apiEndpoint + this.$config.apiCompaniesPath + this.lang
        )
        .then((response) => {
          this.companies = this.mapCompaniesResult(response, this.lang)
        })
        .catch(() => {
          alert('Sorry, an error has occurred while fetching the companies.')
        })
    },
  },
}
</script>
