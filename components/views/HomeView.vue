<template>
  <RightColumn class="home-view-ct" :visible="visible">
    <ViewBackground :visible="visible" />
    <SlidingContainer class="container" :visible="visible">
      <div class="home-view">
        <h1>{{ $t('home.title') }}</h1>
        <div class="top-overview">
          <div class="image-ct">
            <div class="image"></div>
          </div>
          <div class="map-col">
            <div class="top-desc">
              <!-- TODO: add here optional top description -->
            </div>
            <div class="map-ct clickable" @click="showMapView()">
              <Map
                mode="preview"
                :visible-companies="filteredCompanies"
                class="map"
              />
            </div>
          </div>
        </div>
        <div class="data-cols">
          <div class="col">
            <p>
              {{ $t('home.firstSection.desc') }}<br /><br />{{
                $t('home.firstSection.descTwo')
              }}
            </p>
          </div>
        </div>
        <div class="metrics">
          <div v-for="metric in metrics" :key="metric.name" class="metric">
            <h3 class="value">{{ metric.value }}</h3>
            <div class="name">{{ metric.name }}</div>
          </div>
        </div>
        <div v-if="links.length" class="links">
          <a
            v-for="link in links"
            :key="link.url"
            :href="link.url"
            target="_blank"
            class="clickable"
            >{{ link.label }}</a
          >
        </div>
      </div>
    </SlidingContainer>
  </RightColumn>
</template>

<script>
export default {
  props: {
    companiesList: {
      type: Array,
      required: true,
    },

    filteredCompanies: {
      type: Array,
      required: true,
    },

    visible: {
      type: Boolean,
      required: true,
    },

    customLinks: {
      type: Array,
      default: null,
    },

    displayAsWebsite: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    links() {
      if (this.customLinks) {
        return this.customLinks
      }

      if (this.displayAsWebsite) {
        return [
          {
            link: 'https://noi.bz.it/en/privacy-cookie-policy',
            label: this.$t('common.privacyPolicy'),
          },
        ]
      }

      return []
    },

    uniqueCompaniesNumber() {
      const companiesList = {}

      if (this.companiesList) {
        this.companiesList.forEach((company) => {
          const legalName = company.attributes.legalName
          if (!companiesList[legalName]) {
            companiesList[legalName] = true
          }
        })
      }

      return Object.keys(companiesList).length
    },

    metrics() {
      return [
        {
          name: this.$t('common.totalCompanies'),
          value:
            this.companiesList && this.uniqueCompaniesNumber > 0
              ? this.uniqueCompaniesNumber
              : '-',
        },
        {
          name: this.$t('common.sectors'),
          value: '8',
        },
        /* TODO: re-enable once the keywords count will be available {
          name: this.$t('common.keywords'),
          value: '-',
        }, */
      ]
    },
  },

  methods: {
    showMapView() {
      this.$emit('showMapView')
    },
  },
}
</script>

<style lang="postcss" scoped>
.home-view {
  @apply px-8 py-8 h-full overflow-y-auto;

  & h1 {
    @apply text-3xl text-base font-bold;
  }

  & .top-overview {
    @apply flex flex-row my-6 space-x-6;

    & .image-ct {
      width: 50%;

      & .image {
        @apply bg-white bg-cover bg-center;

        height: 270px;
        background-image: url(/image/home-cover.jpg);
      }
    }

    & .map-col {
      width: 50%;

      & .top-desc {
        @apply flex items-center text-sm text-grey font-light;

        height: 30px;
      }

      & .map-ct {
        @apply cursor-pointer;

        height: 240px;
        width: 100%;

        & .map {
          @apply pointer-events-none;
        }
      }
    }
  }

  & .data-cols {
    @apply flex flex-row space-x-6;

    & .col {
      & h2 {
        @apply text-base uppercase;
      }

      & p {
        @apply text-base font-light;
      }
    }
  }

  & .metrics {
    @apply flex flex-row space-x-3 mt-6;

    & .metric {
      @apply bg-white px-6 py-5 flex-1;

      & .value {
        @apply text-xl font-bold;
      }

      & .name {
        @apply text-base;
      }
    }
  }

  & .links {
    @apply mt-6 text-sm;

    & a {
      @apply mr-2;

      &:hover {
        @apply underline;
      }
    }
  }
}

@media (max-width: theme('screens.md')) {
  .home-view-ct {
    top: 60vh !important;
  }
}
</style>
