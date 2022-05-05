<template>
  <span class="pdf-export">
    <vue-html2pdf
      ref="mainExportPdf"
      :show-layout="false"
      :float-layout="true"
      :enable-download="true"
      :preview-modal="false"
      :paginate-elements-by-height="4250"
      :filename="exportName || 'export'"
      :pdf-quality="2"
      :manual-pagination="true"
      pdf-format="a4"
      pdf-orientation="portrait"
      @hasStartedGeneration="hasStartedPdfGEneration()"
      @hasGenerated="hasGeneratedPdf($event)"
    >
      <section slot="pdf-content" class="company-page">
        <!-- TODO -->
        Hello
      </section>
    </vue-html2pdf>
  </span>
</template>

<script>
import VueHtml2pdf from 'vue-html2pdf'

export default {
  components: {
    VueHtml2pdf,
  },

  props: {
    companies: {
      type: Array,
      default: null,
    },
    exportName: {
      type: String,
      default: null,
    },
  },

  watch: {
    companies() {
      this.generatePdf()
    },
  },

  mounted() {
    if (this.companies) {
      this.generatePdf()
    }
  },

  methods: {
    generatePdf() {
      this.$refs.mainExportPdf.generatePdf()
    },

    hasStartedGeneration() {
      this.$emit('hasStartedGeneration')
    },

    hasGeneratedPdf() {
      this.$emit('hasGeneratedPdf')
    },
  },
}
</script>

<style lang="postcss" scoped>
/* TODO */
</style>
