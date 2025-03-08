<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <RightColumn :visible="visible">
    <ViewBackground :visible="visible" />
    <SlidingContainer class="container" :visible="visible">
      <div class="company-view">
        <div v-if="!displayAsWebsite" class="close" @click="hideCompany">
          <div class="inner">
            <Icon name="cross" />
          </div>
        </div>
        <main class="data-view">
          <div class="header-profile">
            <h1>{{ data?.name}}</h1>
            <img
              class="logo"
              :src="data?.logo
                    ? getConfigProperty('apiEndpoint') +
                      getAvailableImageFormatV2(data?.logo)
                    : ''"
              :alt="'Logo ' + data?.name"
            />
          </div>
          <div class="top-overview">
            <div class="col">
              <img
                v-if="!mainVideoID"
                class="image"
                :src="data?.mainImage
                      ? getConfigProperty('apiEndpoint') +
                        getAvailableImageFormatV2(data?.mainImage)
                      : ''"
                :alt="data?.mainImageDescription"
              />
                <iframe
                  v-else
                  width="100%"
                  height="270"
                  :src="YOUTUBE_URL_PREFIX + mainVideoID"
                  >
                </iframe>
            </div>
            <div class="col">
              <p class="top-desc">
                {{ !mainVideoID ? data?.mainImageDescription : data?.mainVideoDescription }}
              </p>
              <div v-if="data?.auxiliaryImage?.formats" class="middle-desc">
                <img
                  class="second-image"
                  :src="data?.auxiliaryImage
                        ? getConfigProperty('apiEndpoint') +
                          getAvailableImageFormatV2(data?.auxiliaryImage)
                        : ''"
                  :alt="data?.auxiliaryImageDescription"
                />
                <p class="second-desc">
                  {{ data?.auxiliaryImageDescription }}
                </p>
              </div>
            </div>
          </div>
          <div class="data-cols">
            <div class="col">
              <h2>{{ $t('common.company') }}</h2>
              <!-- prettier-ignore -->
              <p class="text">{{ removeUnnecessaryNewlines(data?.companyDescription) }}</p>

              <h2>{{ $t('common.productsAndServices') }}</h2>
              <!-- prettier-ignore -->
              <p class="text">{{ removeUnnecessaryNewlines(data?.productsAndServices) }}</p>

              <h2>{{ $t('common.references') }}</h2>
              <!-- prettier-ignore -->
              <p class="text">{{ removeUnnecessaryNewlines(data?.references) }}</p>
            </div>
            <!--
            <div
              v-if="
                data?.contactPerson &&
                data?.contactPerson.personName
              "
              class="col"
            >
              <h2 class="pt-5">{{ $t('common.contactPerson') }}</h2>
              <p class="text">{{ data?.contactPerson.personName }}</p>
              <p v-if="data?.contactPerson.email" class="text">
                <a
                  :href="'mailto:' + data?.contactPerson.email"
                  class="link"
                  >{{ data?.contactPerson.email }}</a
                >
              </p>
              <p v-if="data?.companyContact.phoneNumber" class="text">
                <a
                  :href="'tel:' + data?.companyContact.phoneNumber"
                  class="link"
                  >{{ data?.companyContact.phoneNumber }}</a
                >
              </p>
            </div>
            -->
          </div>
          <button class="download-bt" @click="downloadPdf">
            {{ $t('common.downloadPdf') }} ↓
          </button>
        </main>
        <div class="footer-ct">
        <footer class="footer" :aria-label="$t('company.footerDescription')">
          <div class="column">
            <p class="uppercase" :aria-label="$t('company.legalName')">
              {{ data?.legalName }}
            </p>
            <p v-if="data?.companyAddressStreet" :aria-label="$t('company.companyAddressStreet')">
              {{ data?.companyAddressStreet?.name }}
            </p>
            <p
              v-if="
                data?.companyLocation &&
                data?.companyAddressStreet
              "
              :aria-label="$t('company.companyLocation')"
            >
              {{ data?.companyLocation?.cap }}
              {{ data?.companyAddressStreet?.city }}
            </p>
            <p v-if="data?.companyContact" :aria-label="$t('company.phoneNumber')">
              <a :href="'tel:' + data?.companyContact?.phoneNumber">{{
                data?.companyContact?.phoneNumber
              }}</a>
            </p>
            <p v-if="data?.companyContact" :aria-label="$t('company.email')">
              <a :href="'mailto:' + data?.companyContact?.email">{{
                data?.companyContact?.email
              }}</a>
            </p>
            <p v-if="data?.companyContact" :aria-label="$t('company.website') + data?.name">
              <a
                :href="
                  appendPrefixToUrl(data?.companyContact?.website)
                "
                target="_blank"
                >{{ data?.companyContact?.website }}</a
              >
            </p>
          </div>
          <div class="column second" :aria-label="$t('company.footerDescription2')">
            <p v-if="data?.companyContact" :aria-label="$t('common.contact')">
              {{ $t('common.contact') }}:
              <a :href="'mailto:' + data?.contactPerson?.email">{{
                data?.contactPerson?.personName
              }}</a>
              <span v-if="data?.contactPerson?.role"
                >({{ data?.contactPerson?.role }})</span
              >
            </p>
            <p v-if="data?.contactPerson?.phoneNumber" class="text" :aria-label="$t('company.phoneNumberContactPerson')">
              <a :href="'tel:' + data?.contactPerson?.phoneNumber" class="link">{{
                data?.contactPerson?.phoneNumber
              }}</a>
            </p>
            <p
              v-if="data?.metrics && data?.metrics?.turnover"
            >
              {{ $t('filters.turnover') }}:
              {{
                formatWithThousandSeparator(data?.metrics?.turnover)
              }}
              €
            </p>
            <p
              v-if="
                data?.metric && data?.metrics?.employeeNumber
              "
            >
              {{ $t('common.employees') }}:
              {{ data?.metrics?.employeeNumber }}
            </p>
            <p
              v-if="
                data?.metrics && data?.metrics?.exportRatio
              "
            >
              {{ $t('common.exportRatio') }}:
              {{ data?.metrics?.exportRatio }}%
            </p>
            <p
              v-if="
                data?.metrics && data?.metrics?.rAndDRatio
              "
            >
              {{ $t('common.researchAndDevelopmentRatio') }}:
              {{ data?.metrics?.rAndDRatio }}%
            </p>
            <p
              v-if="
                data?.certifications && enabledCertifications.length
              "
            >
              {{ $t('common.certifications') }}:
              {{ enabledCertifications.join(', ') }}
            </p>
          </div>
        </footer>
        </div>
      </div>
    </SlidingContainer>
    <!-- Added style="visbility:hidden", because for some reason. The <vue-html2pdf></vue-html2pdf> was visible. Download Still works-->
    <client-only>
      <PdfExporter
        ref="pdfExporter"
        style="visibility: hidden;"
        :export-name="data?.name"
        :companies="[data]"
        :automatic-download="false"
      />
    </client-only>
  </RightColumn>
</template>

<script>
import getYouTubeID  from 'get-youtube-id'
import utils from '~/mixins/utils.js'

export default {
  components: {
    PdfExporter: () => import("@/components-lazy/tools/PdfExporter"),
  },

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
    displayAsWebsite: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      YOUTUBE_URL_PREFIX: 'https://www.youtube.com/embed/',
      mainVideoID: '',
    }
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

      if (this.data?.certifications) {
        for (const [certificationId, certificationName] of Object.entries(
          CERTIFICATES_NAMES
        )) {
          if (this.data?.certifications[certificationId] === true) {
            certifications.push(certificationName)
          }
        }
      }

      return certifications
    },
  },

  updated() {
    this.mainVideoID = getYouTubeID(this.data?.mainVideo)
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
  @apply overflow-y-auto flex flex-col justify-between;
  height: 100vh;

  & .close {
    @apply absolute top-3 right-3 w-8 h-8 bg-white cursor-pointer;

    border-radius: 50%;
    z-index: 9998;

    & .inner {
      @apply flex h-full w-full items-center justify-center;

      & svg {
        @apply w-3 h-3;

        fill: theme(colors.grey) !important;
      }
    }
  }

  & .data-view {
    @apply px-8 bg-secondary;

    padding-top: 2rem;
    padding-left: max(2rem, calc(50vw - 600px + 2rem));
    padding-right: max(2rem, calc(50vw - 600px + 2rem));

    & .header-profile {
      @apply flex flex-row;

      & h1 {
        @apply text-3xl font-bold flex-grow uppercase;
      }

      & .logo {
        @apply relative bg-contain bg-no-repeat -mt-6 -left-8;

        background-position: top right;
        height: 150px;
        max-width: 200px;
        object-fit: contain;
        mix-blend-mode: multiply;
      }
    }

    & .top-overview {
      @apply flex flex-row my-6 space-x-6;

      & .col {
        width: 50%;

        & .image {
          @apply bg-white bg-cover bg-center object-contain;

          height: 270px;
          mix-blend-mode: multiply;
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
            @apply h-full w-1/2 bg-white bg-cover bg-center object-contain mix-blend-multiply;

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

      &:hover, &:focus {
        @apply underline;
      }
    }
  }

  & .footer-ct {
    width: 100vw;
    margin-left: auto;
    margin-right: auto;
    background-color: #ededed;

    & .footer {
      @apply flex flex-row items-center py-8;

      padding-left: max(2rem, calc(0.5 * (100vw - 1200px) + 2rem));
      padding-right: max(2rem, calc(0.5 * (100vw - 1200px) + 2rem));

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
}

@container noi-automotive-component-view (max-width: theme('screens.md')) {
  .company-view {
    & .data-view {

      & .header-profile {
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

    & .footer-ct {
      width: 100vw;
      margin-left: min(1px, calc(-0.5 * (100vw - 1200px)));
      background-color: #ededed;

      & .footer {
        @apply flex flex-row items-center py-8;

        padding-left: max(2rem, calc(0.5 * (100vw - 1200px) + 2rem));
        padding-right: max(2rem, calc(0.5 * (100vw - 1200px) + 2rem));

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
  }
}
</style>
