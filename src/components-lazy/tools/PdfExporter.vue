<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

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
        filename:
          exportName + (pdfSlice > 0 ? ' - ' + pdfSlice : '') || 'export',
        html2canvas: {
          allowTaint: true,
          scale: 2,
          useCORS: true,
        },
      }"
      @startPagination="hasStartedGeneration()"
      @hasDownloaded="hasGeneratedPdf($event)"
    >
      <section slot="pdf-content" class="company-page">
        <div
          v-for="(data, index) in currentPdfCompanies"
          :key="data.id"
          class="company-view"
          :style="{
            height: companyViewHeight + 'px',
          }"
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
                    backgroundImage:
                      data.attributes.mainImage &&
                      data.attributes.mainImage.data &&
                      data.attributes.mainImage.data.attributes.formats
                        ? 'url(' +
                          getApiEndpoint() +
                          getAvailableImageFormat(
                            data.attributes.mainImage.data.attributes.formats
                          ) +
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
                      backgroundImage:
                        data.attributes.auxiliaryImage &&
                        data.attributes.auxiliaryImage.data &&
                        data.attributes.auxiliaryImage.data.attributes.formats
                          ? 'url(' +
                            getApiEndpoint() +
                            getAvailableImageFormat(
                              data.attributes.auxiliaryImage.data.attributes
                                .formats
                            ) +
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
            <div class="data-ct">
              <h1>{{ data.attributes.name }}</h1>
              <div class="data-cols">
                <div class="col">
                  <h2>{{ $t('common.company') }}</h2>
                  <!-- prettier-ignore -->
                  <p class="text">{{ removeUnnecessaryNewlines(data.attributes.companyDescription) }}</p>

                  <h2>{{ $t('common.productsAndServices') }}</h2>
                  <!-- prettier-ignore -->
                  <p class="text">{{ removeUnnecessaryNewlines(data.attributes.productsAndServices) }}</p>

                  <h2>{{ $t('common.references') }}</h2>
                  <!-- prettier-ignore -->
                  <p class="text">{{ removeUnnecessaryNewlines(data.attributes.references) }}</p>
                </div>
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
                <a
                  :href="
                    appendPrefixToUrl(data.attributes.companyContact.website)
                  "
                  >{{ data.attributes.companyContact.website }}</a
                >
              </p>
            </div>
            <div class="column second">
              <p v-if="data.attributes.companyContact" class="mb-6">
                {{ $t('common.contact') }}:
                <a :href="'mailto:' + data.attributes.contactPerson.email">{{
                  data.attributes.contactPerson.personName
                }}</a>
                <span v-if="data.attributes.contactPerson.role"
                  >({{ data.attributes.contactPerson.role }})</span
                >
              </p>
              <p
                v-if="
                  data.attributes.metrics && data.attributes.metrics.turnover
                "
              >
                {{ $t('filters.turnover') }}:
                {{
                  formatWithThousandSeparator(data.attributes.metrics.turnover)
                }}
                €
              </p>
              <p
                v-if="
                  data.attributes.metrics &&
                  data.attributes.metrics.employeeNumber
                "
              >
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
              <p
                v-if="
                  data.attributes.certifications &&
                  getEnabledCertifications(data).length
                "
              >
                {{ $t('common.certifications') }}:
                {{ getEnabledCertifications(data).join(', ') }}
              </p>
            </div>
            <div class="column logo-ct">
              <div
                class="logo"
                :style="{
                  backgroundImage:
                    data.attributes.logo &&
                    data.attributes.logo.data &&
                    data.attributes.logo.data.attributes.formats
                      ? 'url(' +
                        getApiEndpoint() +
                        getAvailableImageFormat(
                          data.attributes.logo.data.attributes.formats
                        ) +
                        ')'
                      : undefined,
                }"
              ></div>
            </div>
          </div>
          <div class="page-num">
            {{ startCompanyNumber + index + 1 }}
          </div>
        </div>
      </section>
    </vue-html2pdf>
  </span>
</template>

<script>
// import VueHtml2pdf from 'vue-html2pdf'
import utils from '~/mixins/utils.js'

export default {
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

  data() {
    return {
      MAX_PDF_LENGTH: 25,
      pdfSlice: 0,
    }
  },

  computed: {
    companyViewHeight() {
      return this.automaticDownload ? 1122.3 : 1120
    },

    startCompanyNumber() {
      return this.MAX_PDF_LENGTH * this.pdfSlice
    },

    currentPdfCompanies() {
      return this.companies
        ? this.companies.slice(
            this.startCompanyNumber,
            this.startCompanyNumber + this.MAX_PDF_LENGTH
          )
        : []
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
      if (this.automaticDownload) {
        if (
          this.companies.length >
          this.startCompanyNumber + this.MAX_PDF_LENGTH + 1
        ) {
          this.pdfSlice = this.pdfSlice + 1
          this.$nextTick(() => {
            this.generatePdf()
          })
        } else {
          this.$emit('hasGeneratedMultiPagePdf')
        }
      }
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
        for (const [certificationId, certificationName] of Object.entries(
          CERTIFICATES_NAMES
        )) {
          if (data.attributes.certifications[certificationId] === true) {
            certifications.push(certificationName)
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

    & .data-ct {
      @apply overflow-hidden;

      height: 535px;

      & h1 {
        @apply uppercase leading-none font-bold flex-grow;

        font-size: 2rem;
        line-height: 2rem;
      }

      & .data-cols {
        @apply mt-8;

        & .col {
          @apply mb-5;

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
