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
        <div v-for="data in companies" :key="data.id" class="company-view">
          <div class="data-view">
            <div class="header">
              <h1>{{ data.attributes.name }}</h1>
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
            <div v-if="data.attributes.contactPerson" class="contact-bt">
              <a :href="'mailto:' + data.attributes.contactPerson.email"
                >{{ $t('company.contactReferencePerson') }} →</a
              >
            </div>
          </div>
          <div class="footer">
            <div class="column">
              <p>
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
                <a
                  :href="'tel:' + data.attributes.companyContact.phoneNumber"
                  >{{ data.attributes.companyContact.phoneNumber }}</a
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
              <p v-if="data.attributes.companyContact">
                {{ $t('common.contact') }}:
                <a :href="'mailto:' + data.attributes.contactPerson.email">{{
                  data.attributes.contactPerson.personName
                }}</a>
                ({{ data.attributes.contactPerson.role }})
              </p>
              <p v-if="data.attributes.metrics">
                {{ $t('filters.turnover') }}:
                {{ data.attributes.metrics.turnover }}
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
          </div>
        </div>
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
      this.$nextTick(() => {
        this.generatePdf()
      })
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
  & .data-view {
    @apply px-8 py-8;

    & .header {
      @apply flex flex-row;

      & h1 {
        @apply text-3xl text-base font-bold flex-grow;
      }

      & .logo {
        @apply relative bg-contain bg-no-repeat -mt-6 -left-8;

        background-position: top right;
        width: 150px;
        height: 70px;
      }
    }

    & .top-overview {
      @apply flex flex-row my-6 space-x-6;

      & .col {
        width: 50%;

        & .image {
          @apply bg-white bg-cover bg-center;

          height: 270px;
        }

        & .top-desc {
          @apply flex items-center text-sm text-grey font-light;

          height: 130px;
        }

        & .middle-desc {
          @apply flex flex-row;

          height: 140px;

          & .second-image {
            @apply h-full w-1/2 bg-white bg-cover bg-center;

            min-width: 200px;
          }

          & .second-desc {
            @apply flex items-center text-sm text-grey font-light pl-6;
          }
        }
      }
    }

    & .data-cols {
      @apply mt-8;

      & .col {
        @apply mb-5;

        max-width: 700px;

        & h2 {
          @apply text-base uppercase mt-8;

          &:first-child {
            @apply mt-0;
          }
        }

        & .text {
          @apply text-base font-light;

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
    @apply flex flex-row items-center py-8 px-8;

    background-color: #ededed;

    & .column {
      @apply pr-10;

      & p {
        @apply text-base text-black mb-1;

        & a {
          @apply underline;
        }
      }

      &.second {
        & p {
          @apply text-sm text-grey;
        }
      }
    }
  }
}
</style>
