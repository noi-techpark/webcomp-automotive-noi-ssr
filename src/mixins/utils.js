export default {
  methods: {
    getApiEndpoint() {
      return this.$config?.apiEndpoint || 'https://bk.opendatahub.com'
    },

    getApiCompaniesPath() {
      return (
        this.$config?.apiCompaniesPath ||
        '/api/published-companies/?fields[0]=data_'
      )
    },

    copyToClipboard(text) {
      const textArea = document.createElement('textarea')

      // Place in top-left corner of screen regardless of scroll position.
      textArea.style.position = 'fixed'
      textArea.style.top = 0
      textArea.style.left = 0

      // Ensure it has a small width and height. Setting to 1px / 1em
      // doesn't work as this gives a negative w/h on some browsers.
      textArea.style.width = '2em'
      textArea.style.height = '2em'

      // We don't need padding, reducing the size if it does flash render.
      textArea.style.padding = 0

      // Clean up any borders.
      textArea.style.border = 'none'
      textArea.style.outline = 'none'
      textArea.style.boxShadow = 'none'

      // Avoid flash of white box if rendered for any reason.
      textArea.style.background = 'transparent'

      textArea.value = text

      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      try {
        document.execCommand('copy')
      } catch (err) {
        // Nothing to do
      }

      document.body.removeChild(textArea)
    },

    mapCompaniesResult(response, lang) {
      return response.data.map((company) => company.attributes['data_' + lang])
    },

    formatWithThousandSeparator(number) {
      return number
        ? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
        : ''
    },

    getAvailableImageFormat(formats) {
      if (formats?.large) {
        return formats.large.url
      }

      if (formats?.medium) {
        return formats.medium.url
      }

      if (formats?.small) {
        return formats.small.url
      }

      return formats?.thumbnail?.url
    },

    removeUnnecessaryNewlines(string) {
      return string ? string.replaceAll(/([^.])(\n)/g, '$1 ').trim() : ''
    },

    appendPrefixToUrl(url) {
      if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url
      }

      return url
    },

    async fetchAllCompanies() {
      const SAFE_LOOP_LIMIT = 10 // More than 1000 companies are not supported
      const FETCH_LIMIT = 100

      let allCompanies = []

      let fetchedAllCompanies = false
      let currentLoop = 0

      while (fetchedAllCompanies === false || currentLoop >= SAFE_LOOP_LIMIT) {
        const response = await fetch(
          this.getApiEndpoint() +
            this.getApiCompaniesPath() +
            this.$i18n.locale +
            '&pagination[start]=' +
            currentLoop * FETCH_LIMIT +
            '&pagination[limit]=' +
            FETCH_LIMIT
          // NOTE: switch to "'/api/published-companies/?populate=*&locale=' +" and remove ".map" to fetch regular company data
        ).catch(() => {
          alert('Sorry, an error has occurred while fetching the companies.')
        })

        const fetchedCompanies = await response.json()

        const companiesList = this.mapCompaniesResult(
          fetchedCompanies,
          this.$i18n.locale
        )

        allCompanies = [...allCompanies, ...companiesList]

        if (companiesList.length < 100) {
          fetchedAllCompanies = true
        }
        currentLoop++
      }

      return allCompanies
    },
  },
}
