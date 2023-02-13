<template>
  <div class="component-view">
    <NavigationBar
      ref="navigationBar"
      :visible-company="visibleCompanyData"
      :display-as-website="displayAsWebsite"
      @onCompanyClick="showCompany"
      @didLeaveHome="hideHome"
      @didReachHome="showHome"
      @didFetchCompanies="setCompaniesList"
      @didFilterCompanies="setNewFilteredCompanies"
    />
    <MapView
      :filtered-companies="filteredCompanies"
      @showCompanyWithId="showCompanyWithId"
    />
    <HomeView
      :companies-list="companiesList"
      :filtered-companies="filteredCompanies"
      :visible="isHomeViewVisible"
      :display-as-website="displayAsWebsite"
      :custom-links="parsedCustomLinks"
      @showMapView="showMapView"
    />
    <CompanyView
      :data="visibleCompanyData || undefined"
      :visible="visibleCompanyData !== null"
      @onHide="hideCompany"
    />
    <div class="full-screen-loader" :class="{ visible: loading }">
      <Loader colorscheme="colored" />
    </div>
  </div>
</template>

<script>
import 'tailwindcss/tailwind.css'

export default {
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

  data() {
    return {
      loading: true,
      companiesList: [],
      filteredCompanies: [],
      isHomeViewVisible: true,
      visibleCompanyData: null,
      requestedCompanyDisplay: null,
    }
  },

  computed: {
    displayAsWebsite() {
      return this.websiteMode === 'true'
    },

    parsedCustomLinks() {
      if (this.customLinks) {
        return JSON.parse(this.customLinks)
      }

      return []
    },
  },

  watch: {
    companiesList(newList) {
      if (newList.length) {
        this.loading = false
        if (this.requestedCompanyDisplay) {
          this.showCompanyWithId(this.requestedCompanyDisplay)
          this.requestedCompanyDisplay = null
        }
      }
    },
  },

  created() {
    if (this.language) {
      if (this.$i18n.locale !== this.language) {
        this.$i18n.setLocale(this.language)
      }
    }

    if (this.defaultCompanyId) {
      this.requestedCompanyDisplay = Number(this.defaultCompany)
    }
  },

  mounted() {
    // if (this.$route.query.company) {
    //   this.requestedCompanyDisplay = Number(this.$route.query.company)
    // }
  },

  methods: {
    showCompanyWithId(companyId) {
      const companyData = this.companiesList.find(
        (company) => company.id === companyId
      )
      if (companyData) {
        this.showCompany(companyData)
      } else {
        this.resetUrl()
      }
    },

    showCompany(companyData) {
      this.visibleCompanyData = companyData
      if (this.$router) {
        this.$router.replace({
          name: this.$router.name,
          query: { company: companyData.id },
        })
      }
    },

    hideCompany() {
      this.visibleCompanyData = null
      this.resetUrl()
    },

    resetUrl() {
      if (this.$router) {
        this.$router.replace({
          name: this.$router.name,
          query: { company: undefined },
        })
      }
    },

    showHome() {
      this.isHomeViewVisible = true
      this.hideCompany()
    },

    hideHome() {
      this.isHomeViewVisible = false
    },

    showMapView() {
      this.$refs.navigationBar.showCategory(true)
    },

    setNewFilteredCompanies(filteredCompanies) {
      this.filteredCompanies = filteredCompanies
    },

    setCompaniesList(companiesList) {
      this.companiesList = companiesList
    },
  },
}
</script>

<style lang="postcss">
@import url('~assets/css/animations.css');
@import url('~assets/css/main.css');

.component-view {
  @apply relative w-full h-full overflow-hidden;

  min-height: 800px;
}

.full-screen-loader {
  @apply absolute flex items-center justify-center top-0 right-0 bottom-0 left-0 bg-white bg-opacity-75 z-30 opacity-0 pointer-events-none;

  &.visible {
    @apply opacity-100 pointer-events-auto;
  }
}
</style>
