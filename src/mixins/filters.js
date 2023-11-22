// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export default {
  computed: {
    mainCategories() {
      return [
        this.getResultDataObject(
          false,
          this.CATEGORY_PREFIX + 'automotiveAndMobility',
          this.$t('common.automotiveAndMobility'),
          null,
          true
        ),
        this.getResultDataObject(
          false,
          this.CATEGORY_PREFIX + 'manufacturing',
          this.$t('common.manufacturing'),
          null,
          true
        ),
        this.getResultDataObject(
          false,
          this.CATEGORY_PREFIX + 'agriAutomation',
          this.$t('common.agriAutomation'),
          null,
          true
        ),
      ]
    },
    
    industrialSectors() {
      return [
        {
          value: '',
          name: this.$t('common.select') + '...',
        },
        {
          value: 'Automotive_Technology',
          name: this.$t('filters.automotiveTechnology'),
        },
        {
          value: 'Machinery_and_Plant_construction',
          name: this.$t('filters.machineryAndPlantConstruction'),
        },
        {
          value: 'Electronics_and_Electrical_Engineering',
          name: this.$t('filters.electronicsElectricalEngineering'),
        },
        {
          value: 'Plastics_and_Chemistry',
          name: this.$t('filters.pasticsChemics'),
        },
        {
          value: 'Information_Technology',
          name: this.$t('filters.informationtechnology'),
        },
        {
          value: 'Research_and_Development',
          name: this.$t('filters.researchAndDevelopment'),
        },
        {
          value: 'Service_Providers_and_Consulting',
          name: this.$t('filters.serivceProvidersConsultants'),
        },
        {
          value: 'Education_and_Training',
          name: this.$t('filters.educationAndTraining'),
        },
        {
          value: 'Other',
          name: this.$t('filters.other'),
        },
      ]
    },

    valueChainPositions() {
      return [
        {
          value: '',
          name: this.$t('common.select') + '...',
        },
        {
          value: 'Users',
          name: this.$t('filters.users'),
        },
        {
          value: 'Developers',
          name: this.$t('filters.developers'),
        },
        {
          value: 'Laboratories',
          name: this.$t('filters.laboratories'),
        },
        {
          value: 'Production',
          name: this.$t('filters.production'),
        },
        {
          value: 'Suppliers',
          name: this.$t('filters.suppliers'),
        },
        {
          value: 'Providers',
          name: this.$t('filters.providers'),
        },
        {
          value: 'Commerce_and_distribution',
          name: this.$t('filters.commerceAndDistribution'),
        },
      ]
    },

    turnovers() {
      return [
        {
          value: '',
          name: this.$t('common.select') + '...',
        },
        {
          value: '< 1 Mio',
          name: '< 1 ' + this.$t('common.million') + ' €',
        },
        {
          value: '1 - 2 Mio',
          name: '1 - 2 ' + this.$t('common.million') + ' €',
        },
        {
          value: '2 - 10 Mio',
          name: '2 - 10 ' + this.$t('common.million') + ' €',
        },
        {
          value: '10 - 50 Mio',
          name: '10 - 50 ' + this.$t('common.million') + ' €',
        },
        {
          value: '50 - 250 Mio',
          name: '50 - 250 ' + this.$t('common.million') + ' €',
        },
        {
          value: '250 - 500 Mio',
          name: '250 - 500 ' + this.$t('common.million') + ' €',
        },
        {
          value: '> 500 Mio',
          name: '> 500 ' + this.$t('common.million') + ' €',
        },
        {
          value: 'NOT-DEFINED',
          name: this.$t('filters.notDefined'),
        },
      ]
    },

    employees() {
      return [
        {
          value: '',
          name: this.$t('common.select') + '...',
        },
        {
          value: '<5',
          name: '< 5',
        },
        {
          value: '5-10',
          name: '5 - 10',
        },
        {
          value: '10-50',
          name: '10 - 50',
        },
        {
          value: '50-150',
          name: '50 - 150',
        },
        {
          value: '150-250',
          name: '150 - 250',
        },
        {
          value: '>250',
          name: '> 250',
        },
        {
          value: 'NOT-DEFINED',
          name: this.$t('filters.notDefined'),
        },
      ]
    },

    certifications() {
      return [
        {
          value: '',
          name: this.$t('common.select') + '...',
        },
        {
          value: 'ISO_9001',
          name: 'ISO 9001',
        },
        {
          value: 'ISO_14001',
          name: 'ISO 14001',
        },
        {
          value: 'ISO_45001',
          name: 'ISO 45001',
        },
        {
          value: 'IATF16949',
          name: 'IATF16949',
        },
        {
          value: 'EN_ISO_17025',
          name: 'EN ISO 17025',
        },
        {
          value: 'Other',
          name: this.$t('filters.other'),
        },
      ]
    },

    specializationOptions() {
      return [
        {
          value: 'automotiveAndMobility',
          name: this.$t('common.automotiveAndMobility'),
        },
        {
          value: 'manufacturing',
          name: this.$t('common.manufacturing'),
        },
        {
          value: 'agriAutomation',
          name: this.$t('common.agriAutomation'),
        },
      ]
    },
  },

  data() {
    return {
      CATEGORY_PREFIX: 'CATEGORY-', // if you change it here, you also have to change it in ~/components/navigation/NavigationBar.vue
    }
  },

  methods: {
    getResultDataObject(
      isPlaceholder,
      id,
      name,
      metric,
      isMainCategory,
      lat,
      lng,
      image,
      companyDescription,
      city,
      specialization,
    ) {
      return {
        isPlaceholder,
        id,
        name,
        metric,
        isMainCategory,
        coordinates: {
          lat,
          lng,
        },
        image,
        companyDescription,
        city,
        specialization
      }
    },

    filterResults(results = [], filters, searchValue, categoryFilter, mode='and', mainCategory, defaultCategoryValidated, displayMultipleCategories) {
      // Filter 
      const categoryFilterFunction = (catFilter, catAttr,)=>{
        if(mode === 'and') {
          return (
            (!catFilter.automotiveAndMobility || (catFilter.automotiveAndMobility && catAttr.automotiveAndMobility)) &&
            (!catFilter.manufacturing         || (catFilter.manufacturing         && catAttr.manufacturing        )) &&
            (!catFilter.agriAutomation        || (catFilter.agriAutomation        && catAttr.agriAutomation       ))
          )
        } else if (mode === 'or') {
          return(
            (catFilter.automotiveAndMobility  && catAttr.automotiveAndMobility) ||
            (catFilter.manufacturing          && catAttr.manufacturing) ||
            (catFilter.agriAutomation         && catAttr.agriAutomation)
          )
        }
      }

      if (results.length > 0) {
        if (searchValue) {
          const cleanSearchVal = searchValue.toLowerCase()
          results = results.filter((r) =>
            (
              r.attributes.name +
              ' ' +
              r.attributes.companyDescription +
              ' ' +
              r.attributes.productsAndServices +
              ' ' +
              r.attributes.references +
              ' ' +
              r.attributes.companyContact.email +
              ' ' +
              r.attributes.contactPerson.email +
              ' ' +
              r.attributes.contactPerson.personName +
              ' ' +
              r.attributes.companyAddressStreet.name +
              ' ' +
              r.attributes.companyAddressStreet.city
            )
              .toLowerCase()
              .includes(cleanSearchVal)
          )
        }

        /*
         * filter according to webcomponent-parameter visibleCategories
         * skip filtering, when:
         * -mode is 'and' and all filters are false
         * -mode is 'or' and all filters are true
         */
        if (categoryFilter && !(categoryFilter.automotiveAndMobility === categoryFilter.manufacturing === categoryFilter.agriAutomation === (mode === 'or'))) {
          results = results.filter((r) => {
            if(r?.attributes?.specialization) {
              return categoryFilterFunction(categoryFilter, r.attributes.specialization)
            } else {
              return false
            }
          })
        }

        if (mainCategory && mainCategory !== true) {
          results = results.filter((r) => {
            return (
              r.attributes.specialization &&
              r.attributes.specialization[mainCategory]
            )
          })
        } else if (
          defaultCategoryValidated &&
          displayMultipleCategories
        ) {
          results = results.filter((r) => {
            return (
              r.attributes.specialization &&
              r.attributes.specialization[defaultCategoryValidated]
            )
          })
        }

        if (filters.industrialSector) {
          results = results.filter(
            (r) =>
              r.attributes.industrialSector === filters.industrialSector
          )
        }

        if (filters.valueChainPosition) {
          results = results.filter(
            (r) =>
              r.attributes.valueChainPosition ===
              filters.valueChainPosition
          )
        }

        if (filters.turnover) {
          switch (filters.turnover) {
            case '< 1 Mio':
              results = results.filter(
                (r) =>
                  r.attributes.metrics &&
                  r.attributes.metrics.turnover < 1000000
              )
              break
            case '1 - 2 Mio':
              results = results.filter(
                (r) =>
                  r.attributes.metrics &&
                  r.attributes.metrics.turnover >= 1000000 &&
                  r.attributes.metrics.turnover < 2000000
              )
              break
            case '2 - 10 Mio':
              results = results.filter(
                (r) =>
                  r.attributes.metrics &&
                  r.attributes.metrics.turnover >= 2000000 &&
                  r.attributes.metrics.turnover < 10000000
              )
              break
            case '10 - 50 Mio':
              results = results.filter(
                (r) =>
                  r.attributes.metrics &&
                  r.attributes.metrics.turnover >= 10000000 &&
                  r.attributes.metrics.turnover < 50000000
              )
              break
            case '50 - 250 Mio':
              results = results.filter(
                (r) =>
                  r.attributes.metrics &&
                  r.attributes.metrics.turnover >= 5000000 &&
                  r.attributes.metrics.turnover < 250000000
              )
              break
            case '250 - 500 Mio':
              results = results.filter(
                (r) =>
                  r.attributes.metrics &&
                  r.attributes.metrics.turnover >= 25000000 &&
                  r.attributes.metrics.turnover < 500000000
              )
              break
            case '> 500 Mio':
              results = results.filter(
                (r) =>
                  r.attributes.metrics &&
                  r.attributes.metrics.turnover >= 500000000
              )
              break
            case 'NOT-DEFINED':
              results = results.filter(
                (r) => r.attributes.metrics && !r.attributes.metrics.turnover
              )
              break
          }
        }

        if (filters.employees) {
          switch (filters.employees) {
            case '<5':
              results = results.filter(
                (r) =>
                  r.attributes.metrics &&
                  r.attributes.metrics.employeeNumber < 5
              )
              break
            case '5-10':
              results = results.filter(
                (r) =>
                  r.attributes.metrics &&
                  r.attributes.metrics.employeeNumber >= 5 &&
                  r.attributes.metrics.employeeNumber < 10
              )
              break
            case '10-50':
              results = results.filter(
                (r) =>
                  r.attributes.metrics &&
                  r.attributes.metrics.employeeNumber >= 10 &&
                  r.attributes.metrics.employeeNumber < 50
              )
              break
            case '50-150':
              results = results.filter(
                (r) =>
                  r.attributes.metrics &&
                  r.attributes.metrics.employeeNumber >= 50 &&
                  r.attributes.metrics.employeeNumber < 150
              )
              break
            case '150-250':
              results = results.filter(
                (r) =>
                  r.attributes.metrics &&
                  r.attributes.metrics.employeeNumber >= 150 &&
                  r.attributes.metrics.employeeNumber < 250
              )
              break
            case '>250':
              results = results.filter(
                (r) =>
                  r.attributes.metrics &&
                  r.attributes.metrics.employeeNumber >= 250
              )
              break
            case 'NOT-DEFINED':
              results = results.filter(
                (r) =>
                  r.attributes.metrics && !r.attributes.metrics.employeeNumber
              )
              break
          }
        }

        if (filters.certification) {
          results = results.filter(
            (r) =>
              r.attributes.certifications &&
              r.attributes.certifications[filters.certification] === true
          )
        }
      }
      return results
    },

    mapResults(results) {
      const mappedResults = results.map((r) =>
        this.getResultDataObject(
          false,
          r.id,
          r.attributes.name,
          null,
          false,
          r.attributes.companyLocation
            ? Number(r.attributes.companyLocation.lat)
            : 0,
          r.attributes.companyLocation
            ? Number(r.attributes.companyLocation.lng)
            : 0,
            r.attributes?.mainImage?.data?.attributes,
            r.attributes?.companyDescription,
            r.attributes?.companyAddressStreet?.city,
            r.attributes?.specialization,
        )
      )

      mappedResults.sort((a, b) => a.name.localeCompare(b.name))

      return mappedResults
    },

    countFilters(results) {
      const sum = results.length

      // Initialize count Object
      const countCategories = { sumCompanies: sum }
      this.mainCategories.forEach((category) => {
        countCategories[category.id.replace(this.CATEGORY_PREFIX, '')] = 0
      })

      const countIndustrialSectors = { sumCompanies: sum }
      this.industrialSectors.forEach((sector) => {
        if (sector.value) countIndustrialSectors[sector.value] = 0
      })

      const countValueChainPositions = { sumCompanies: sum }
      this.valueChainPositions.forEach((position) => {
        if (position.value) countValueChainPositions[position.value] = 0
      })

      const countTurnovers = { sumCompanies: sum }
      this.turnovers.forEach((turnover) => {
        if (turnover.value) countTurnovers[turnover.value] = 0
      })

      const countEmployees = { sumCompanies: sum }
      this.employees.forEach((employee) => {
        if (employee.value) countEmployees[employee.value] = 0
      })

      const countCertifications = { sumCompanies: sum }
      this.certifications.forEach((certification) => {
        if (certification.value && certification.value)
          countCertifications[certification.value] = 0
      })

      const count = {
        sumCompanies: sum,
        categories: countCategories,
        industrialSectors: countIndustrialSectors,
        valueChainPositions: countValueChainPositions,
        turnovers: countTurnovers,
        employeeNumber: countEmployees,
        certifications: countCertifications,
      }

      // count the number of companies that apply to each filter
      results.forEach((result) => {
        const attr = result.attributes

        if (attr.specialization) {
          Object.keys(attr.specialization).forEach((key) => {
            if (attr.specialization[key] && key !== 'id')
              count.categories[key]++
          })
        }

        if (attr.industrialSector) {
          count.industrialSectors[attr.industrialSector]++
        }

        if (attr.valueChainPosition) {
          count.valueChainPositions[attr.valueChainPosition]++
        }

        if (attr.metrics) {
          // turnover
          const turnover = attr.metrics.turnover
          if (!turnover) {
            count.turnovers['NOT-DEFINED']++
          } else if (turnover < 1000000) {
            count.turnovers['< 1 Mio']++
          } else if (turnover < 2000000) {
            count.turnovers['1 - 2 Mio']++
          } else if (turnover < 10000000) {
            count.turnovers['2 - 10 Mio']++
          } else if (turnover < 50000000) {
            count.turnovers['10 - 50 Mio']++
          } else if (turnover < 250000000) {
            count.turnovers['50 - 250 Mio']++
          } else if (turnover < 500000000) {
            count.turnovers['250 - 500 Mio']++
          } else {
            count.turnovers['> 500 Mio']++
          }

          // employeeNumber
          const employeeNumber = attr.metrics.employeeNumber
          if (!employeeNumber) {
            count.employeeNumber['NOT-DEFINED']++
          } else if (employeeNumber < 5) {
            count.employeeNumber['<5']++
          } else if (employeeNumber < 10) {
            count.employeeNumber['5-10']++
          } else if (employeeNumber < 50) {
            count.employeeNumber['10-50']++
          } else if (employeeNumber < 150) {
            count.employeeNumber['50-150']++
          } else if (employeeNumber < 250) {
            count.employeeNumber['150-250']++
          } else {
            count.employeeNumber['>250']++
          }
        }

        if (attr.certifications) {
          Object.keys(attr.certifications).forEach((key) => {
            if (attr.certifications[key] && key !== 'id')
              count.certifications[key]++
          })
        }
      })

      return count
    },
  }
}
