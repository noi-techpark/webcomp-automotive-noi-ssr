// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export default {
  computed: {
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
  },
}
