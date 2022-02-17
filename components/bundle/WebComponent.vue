<template>
  <div class="component-view">
    <NavigationBar
      @onCompanyClick="showCompany"
      @didLeaveHome="hideHome"
      @didReachHome="showHome"
      @didFilterCompanies="setNewFilteredCompanies"
    />
    <MapView
      :filtered-companies="filteredCompanies"
      @onCompanyClick="showCompany"
    />
    <HomeView :visible="isHomeViewVisible" />
    <CompanyView
      :visible="showCompanyWithId !== null"
      :company-id="showCompanyWithId"
      @onHide="hideCompany"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      filteredCompanies: [],
      isHomeViewVisible: true,
      showCompanyWithId: null,
    }
  },

  methods: {
    showCompany(companyId) {
      this.showCompanyWithId = companyId
    },

    hideCompany() {
      this.showCompanyWithId = null
    },

    showHome() {
      this.isHomeViewVisible = true
    },

    hideHome() {
      this.isHomeViewVisible = false
    },

    setNewFilteredCompanies(filteredCompanies) {
      this.filteredCompanies = filteredCompanies
    },
  },
}
</script>

<style lang="postcss">
.component-view {
  @apply relative w-full h-full;
}
</style>
