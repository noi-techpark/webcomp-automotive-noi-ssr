<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <section>
    <p class="p-6">{{ isPdfReady ? 'Pdf downloaded' : 'Generating pdf...' }}</p>
    <client-only>
      <PdfExporter
        :export-name="'All companies - ' + lang"
        :companies="companies"
        @hasGeneratedMultiPagePdf="didGeneratePdf"
      />
    </client-only>
  </section>
</template>

<script>
import utils from '~/mixins/utils.js'

export default {
  components: {
    PdfExporter: () => import("@/components-lazy/tools/PdfExporter"),
  },
  
  mixins: [utils],

  data() {
    return {
      lang: this.$route.query.lang || 'en',
      companies: null,
      isPdfReady: false,
    }
  },

  mounted() {
    this.fetchCompanies()
  },

  methods: {
    async fetchCompanies() {
      this.companies = await this.fetchAllCompanies()
    },

    didGeneratePdf() {
      this.isPdfReady = true
    },
  },
}
</script>
