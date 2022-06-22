<template>
  <span class="pdf-export">
    <vue-html2pdf
      ref="mainExportPdf"
      :show-layout="false"
      :float-layout="true"
      :enable-download="true"
      :preview-modal="false"
      :paginate-elements-by-height="4250"
      :pdf-quality="2"
      :manual-pagination="true"
      pdf-format="a4"
      pdf-orientation="portrait"
      :html-to-pdf-options="{
        enableLinks: true,
        filename: exportName || 'export',
        html2canvas: {
          allowTaint: true,
          scale: 4,
          useCORS: true,
        },
      }"
      @hasStartedGeneration="hasStartedPdfGEneration()"
      @hasGenerated="hasGeneratedPdf($event)"
    >
      <section slot="pdf-content" class="company-page">
        <div
          v-for="(data, index) in companies"
          :key="data.id"
          class="company-view"
        >
          <div class="data-view">
            <div class="header">
              <strong>NOI</strong> | {{ $t('common.ecosystemAutomotive') }}
            </div>
            <div class="top-overview">
              <div class="col">
                <div
                  class="image"
                  :style="{
                    backgroundImage: data.attributes.mainImage
                      ? 'url(' +
                        $config.apiEndpoint +
                        data.attributes.mainImage.data.attributes.formats.large
                          .url +
                        ')'
                      : undefined,
                  }"
                ></div>
              </div>
              <div class="col">
                <p class="top-desc">
                  {{ data.attributes.mainImageDescription }}
                </p>
                <div class="middle-desc">
                  <div
                    class="second-image"
                    :style="{
                      backgroundImage: data.attributes.mainImage
                        ? 'url(' +
                          $config.apiEndpoint +
                          data.attributes.auxiliaryImage.data.attributes.formats
                            .medium.url +
                          ')'
                        : undefined,
                    }"
                  ></div>
                  <p class="second-desc">
                    {{ data.attributes.auxiliaryImageDescription }}
                  </p>
                </div>
              </div>
            </div>
            <h1>{{ data.attributes.name }}</h1>
            <div class="data-cols">
              <div class="col">
                <h2>{{ $t('common.company') }}</h2>
                <p class="text">{{ data.attributes.companyDescription }}</p>

                <h2>{{ $t('common.references') }}</h2>
                <p class="text">{{ data.attributes.references }}</p>
              </div>
              <div class="col">
                <h2>{{ $t('common.productsAndServices') }}</h2>
                <p class="text">{{ data.attributes.productsAndServices }}</p>
              </div>
            </div>
          </div>
          <div class="footer">
            <div class="column primary">
              <p class="uppercase">
                {{ data.attributes.legalName }}
              </p>
              <p v-if="data.attributes.companyAddressStreet">
                {{ data.attributes.companyAddressStreet.name }}
              </p>
              <p
                v-if="
                  data.attributes.companyLocation &&
                  data.attributes.companyAddressStreet
                "
              >
                {{ data.attributes.companyLocation.cap }}
                {{ data.attributes.companyAddressStreet.city }}
              </p>
              <p v-if="data.attributes.companyContact">
                <a :href="'tel:' + data.attributes.companyContact.phoneNumber"
                  >T {{ data.attributes.companyContact.phoneNumber }}</a
                >
              </p>
              <p v-if="data.attributes.companyContact">
                <a :href="'mailto:' + data.attributes.companyContact.email">{{
                  data.attributes.companyContact.email
                }}</a>
              </p>
              <p v-if="data.attributes.companyContact">
                <a :href="data.attributes.companyContact.website">{{
                  data.attributes.companyContact.website
                }}</a>
              </p>
            </div>
            <div class="column second">
              <p v-if="data.attributes.companyContact" class="mb-6">
                {{ $t('common.contact') }}:
                <a :href="'mailto:' + data.attributes.contactPerson.email">{{
                  data.attributes.contactPerson.personName
                }}</a>
                ({{ data.attributes.contactPerson.role }})
              </p>
              <p v-if="data.attributes.metrics">
                {{ $t('filters.turnover') }}:
                {{
                  formatWithThousandSeparator(data.attributes.metrics.turnover)
                }}
                €
              </p>
              <p v-if="data.attributes.metrics">
                {{ $t('common.employees') }}:
                {{ data.attributes.metrics.employeeNumber }}
              </p>
              <p
                v-if="
                  data.attributes.metrics && data.attributes.metrics.exportRatio
                "
              >
                {{ $t('common.exportRatio') }}:
                {{ data.attributes.metrics.exportRatio }}%
              </p>
              <p
                v-if="
                  data.attributes.metrics && data.attributes.metrics.rAndDRatio
                "
              >
                {{ $t('common.researchAndDevelopmentRatio') }}:
                {{ data.attributes.metrics.rAndDRatio }}%
              </p>
              <p v-if="data.attributes.certifications">
                {{ $t('common.certifications') }}:
                {{ getEnabledCertifications(data).join(', ') }}
              </p>
            </div>
            <div class="column logo-ct">
              <div
                class="logo"
                :style="{
                  backgroundImage: data.attributes.logo
                    ? 'url(' +
                      $config.apiEndpoint +
                      data.attributes.logo.data.attributes.formats.thumbnail
                        .url +
                      ')'
                    : undefined,
                }"
              ></div>
            </div>
          </div>
          <div class="page-num">
            {{ index + 1 }}
          </div>
        </div>
      </section>
    </vue-html2pdf>
  </span>
</template>

<script>
import VueHtml2pdf from 'vue-html2pdf'
import utils from '~/mixins/utils.js'

export default {
  components: {
    VueHtml2pdf,
  },

  mixins: [utils],

  props: {
    companies: {
      type: Array,
      default: null,
    },
    exportName: {
      type: String,
      default: null,
    },
    automaticDownload: {
      type: Boolean,
      default: true,
    },
  },

  watch: {
    companies() {
      if (this.automaticDownload) {
        this.$nextTick(() => {
          this.generatePdf()
        })
      }
    },
  },

  mounted() {
    if (this.automaticDownload) {
      if (this.companies) {
        this.generatePdf()
      }
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

    getEnabledCertifications(data) {
      const certifications = []

      const CERTIFICATES_NAMES = {
        ISO_9001: 'ISO 9001',
        ISO_14001: 'ISO 14001',
        ISO_45001: 'ISO 45001',
        IATF16949: 'IATF16949',
        EN_ISO_17025: 'EN ISO 17025',
        Other: this.$t('filters.other'),
      }

      if (data.attributes.certifications) {
        for (const [certificationId, enabled] of Object.entries(
          data.attributes.certifications
        )) {
          if (enabled === true) {
            certifications.push(CERTIFICATES_NAMES[certificationId])
          }
        }
      }

      return certifications
    },
  },
}
</script>

<style lang="postcss" scoped>
.company-view {
  @apply px-20 overflow-hidden;

  height: 1120px;

  & .data-view {
    @apply py-8;

    & .header {
      @apply relative text-right pt-6 pb-4 left-5;

      font-size: 0.7rem;
      line-height: 1rem;
    }

    & .top-overview {
      @apply flex flex-row mt-2 pb-5 space-x-6 border-b border-black;

      & .col {
        width: 50%;

        & .image {
          @apply bg-white bg-cover bg-center;

          height: 220px;
        }

        & .top-desc {
          @apply flex items-start font-light;

          height: 100px;
          font-size: 0.55rem;
        }

        & .middle-desc {
          @apply flex flex-row;

          height: 120px;

          & .second-image {
            @apply h-full w-1/2 bg-white bg-cover bg-center;

            min-width: 180px;
          }

          & .second-desc {
            @apply flex items-end font-light pl-6 pb-1;

            font-size: 0.55rem;
          }
        }
      }
    }

    & h1 {
      @apply uppercase leading-none font-bold flex-grow;

      font-size: 2rem;
      line-height: 2rem;
    }

    & .data-cols {
      @apply mt-8 overflow-hidden;

      height: 470px;

      & .col {
        @apply mb-5;

        max-width: 700px;

        & h2 {
          @apply text-xs uppercase font-bold mt-8 mb-1;

          &:first-child {
            @apply mt-0;
          }
        }

        & .text {
          @apply text-xs font-light;

          white-space: pre-wrap;
        }
      }
    }

    & .contact-bt {
      @apply text-base my-8;

      &:hover {
        @apply underline;
      }
    }
  }

  & .footer {
    @apply flex flex-row items-start pt-4 border-t border-black;

    height: 170px;

    & .column {
      @apply h-full;

      & p {
        @apply text-xs text-black leading-5;
      }

      & .logo {
        @apply relative bg-contain bg-no-repeat -mt-6 -left-8;

        background-position: bottom right;
        width: 150px;
        height: 70px;
      }

      &.primary {
        & p {
          @apply font-bold;
        }
      }

      &.second {
        @apply pl-20;

        & p {
          @apply text-xs;
        }
      }

      &.logo-ct {
        @apply flex flex-grow items-end justify-end;
      }
    }
  }

  & .page-num {
    @apply relative text-right text-xs left-5;
  }
}
</style>
