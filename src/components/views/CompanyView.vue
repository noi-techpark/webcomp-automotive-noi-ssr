<template>
  <RightColumn :visible="visible">
    <ViewBackground :visible="visible" />
    <SlidingContainer class="container" :visible="visible">
      <div class="company-view">
        <div class="close" @click="hideCompany">
          <div class="inner">
            <Icon name="cross" />
          </div>
        </div>
        <div class="data-view">
          <div class="header">
            <h1>{{ data.attributes.name }}</h1>
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
            <div
              v-if="
                data.attributes.contactPerson &&
                data.attributes.contactPerson.personName
              "
              class="col"
            >
              <h2 class="pt-5">{{ $t('common.contactPerson') }}</h2>
              <p class="text">{{ data.attributes.contactPerson.personName }}</p>
              <p v-if="data.attributes.contactPerson.email" class="text">
                <a
                  :href="'mailto:' + data.attributes.contactPerson.email"
                  class="link"
                  >{{ data.attributes.contactPerson.email }}</a
                >
              </p>
              <p v-if="data.attributes.companyContact.phoneNumber" class="text">
                <a
                  :href="'tel:' + data.attributes.companyContact.phoneNumber"
                  class="link"
                  >{{ data.attributes.companyContact.phoneNumber }}</a
                >
              </p>
            </div>
          </div>
          <div class="download-bt" @click="downloadPdf">
            {{ $t('common.downloadPdf') }} ↓
          </div>
        </div>
        <div class="footer">
          <div class="column">
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
              <a :href="'tel:' + data.attributes.companyContact.phoneNumber">{{
                data.attributes.companyContact.phoneNumber
              }}</a>
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
                target="_blank"
                >{{ data.attributes.companyContact.website }}</a
              >
            </p>
          </div>
          <div class="column second">
            <p v-if="data.attributes.companyContact">
              {{ $t('common.contact') }}:
              <a :href="'mailto:' + data.attributes.contactPerson.email">{{
                data.attributes.contactPerson.personName
              }}</a>
              <span v-if="data.attributes.contactPerson.role"
                >({{ data.attributes.contactPerson.role }})</span
              >
            </p>
            <p
              v-if="data.attributes.metrics && data.attributes.metrics.turnover"
            >
              {{ $t('filters.turnover') }}:
              {{
                formatWithThousandSeparator(data.attributes.metrics.turnover)
              }}
              €
            </p>
            <p
              v-if="
                data.attributes.metric && data.attributes.metrics.employeeNumber
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
                data.attributes.certifications && enabledCertifications.length
              "
            >
              {{ $t('common.certifications') }}:
              {{ enabledCertifications.join(', ') }}
            </p>
          </div>
        </div>
      </div>
    </SlidingContainer>
    <PdfExporter
      ref="pdfExporter"
      :export-name="data.attributes.name"
      :companies="[data]"
      :automatic-download="false"
    />
  </RightColumn>
</template>

<script>
import utils from '~/mixins/utils.js'

export default {
  mixins: [utils],

  props: {
    data: {
      type: Object,
      default: () => ({
        attributes: {},
      }),
    },
    visible: {
      type: Boolean,
      required: true,
    },
  },

  computed: {
    enabledCertifications() {
      const certifications = []

      const CERTIFICATES_NAMES = {
        ISO_9001: 'ISO 9001',
        ISO_14001: 'ISO 14001',
        ISO_45001: 'ISO 45001',
        IATF16949: 'IATF16949',
        EN_ISO_17025: 'EN ISO 17025',
        Other: this.$t('filters.other'),
      }

      if (this.data.attributes.certifications) {
        for (const [certificationId, certificationName] of Object.entries(
          CERTIFICATES_NAMES
        )) {
          if (this.data.attributes.certifications[certificationId] === true) {
            certifications.push(certificationName)
          }
        }
      }

      return certifications
    },
  },

  methods: {
    downloadPdf() {
      this.$refs.pdfExporter.generatePdf()
    },

    hideCompany() {
      this.$emit('onHide')
    },
  },
}
</script>

<style lang="postcss" scoped>
.company-view {
  @apply h-full overflow-y-auto;

  & .close {
    @apply absolute top-3 right-3 w-8 h-8 bg-white cursor-pointer;

    border-radius: 50%;

    & .inner {
      @apply flex h-full w-full items-center justify-center;

      & svg {
        @apply w-3 h-3;

        fill: theme(colors.grey) !important;
      }
    }
  }

  & .data-view {
    @apply px-8 py-8;

    & .header {
      @apply flex flex-row;

      & h1 {
        @apply text-3xl font-bold flex-grow uppercase;
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
          @apply flex items-start text-xs text-grey font-light pt-2;

          height: 130px;
          width: 200px;
        }

        & .middle-desc {
          @apply flex flex-row;

          height: 140px;

          & .second-image {
            @apply h-full w-1/2 bg-white bg-cover bg-center;

            min-width: 200px;
          }

          & .second-desc {
            @apply flex items-end text-xs text-grey font-light pl-6;
          }
        }
      }
    }

    & .data-cols {
      @apply mt-8;

      & .col {
        @apply mb-5;

        & h2 {
          @apply text-base uppercase mt-8 font-medium;

          &:first-child {
            @apply mt-0;
          }
        }

        & .text {
          @apply text-base font-light;

          white-space: pre-wrap;

          & .link {
            @apply underline;
          }
        }
      }
    }

    & .download-bt {
      @apply text-base my-8 cursor-pointer;

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

@media (max-width: theme('screens.md')) {
  .company-view {
    & .data-view {
      & .header {
        & h1 {
          @apply mt-12;
        }
      }

      & .top-overview {
        @apply flex-col space-x-0;

        & .col {
          @apply w-auto;

          & .top-desc {
            @apply h-auto mb-8;
          }
        }
      }
    }

    & .footer {
      @apply flex-col items-start;

      & .column {
        &.second {
          @apply mt-4;
        }
      }
    }
  }
}
</style>
