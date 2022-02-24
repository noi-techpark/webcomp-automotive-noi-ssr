<template>
  <div class="component-view">
    <NavigationBar
      ref="navigationBar"
      @onCompanyClick="showCompany"
      @didLeaveHome="hideHome"
      @didReachHome="showHome"
      @didFetchCompanies="setCompaniesList"
      @didFilterCompanies="setNewFilteredCompanies"
    />
    <MapView
      :filtered-companies="filteredCompanies"
      @onCompanyClick="showCompany"
    />
    <HomeView
      :companies-list="companiesList"
      :filtered-companies="filteredCompanies"
      :visible="isHomeViewVisible"
      @showMapView="showMapView"
    />
    <CompanyView
      :data="visibleCompanyData || undefined"
      :visible="visibleCompanyData !== null"
      @onHide="hideCompany"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      companiesList: [],
      filteredCompanies: [],
      isHomeViewVisible: true,
      visibleCompanyData: null,
    }
  },

  methods: {
    showCompany(companyData) {
      console.log('COMPANY_DATA', companyData)
      this.visibleCompanyData = companyData
    },

    hideCompany() {
      this.visibleCompanyData = null
    },

    showHome() {
      this.isHomeViewVisible = true
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
.component-view {
  @apply relative w-full h-full;
}
</style>
