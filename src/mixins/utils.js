// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

const universalConfig = {
          apiEndpoint: 'https://bk.opendatahub.com',
          apiCompaniesPath: '/api/noi-companies',
          network: 'noi',
          headerLogoUrl: '',
          searchbarBackground: 'https://cdn.webcomponents.opendatahub.testingmachine.eu/dist/e3df9ad8-e78f-48d8-88d2-089657d27de5/home-cover.jpg',
          primaryColor: '#0000ff',
          hiddenFilters: undefined,
          visibleSpecializationAreas: undefined,
        }


export default {
  methods: {
    setConfigProperty(key, value) {
      if(value !== undefined) {
        universalConfig[key] = value
        if(key === 'network' && universalConfig.apiCompaniesPath === '/api/noi-companies') {
          universalConfig.apiCompaniesPath = '/api/' + value + '-companies'
        }
      }
    },
    getConfigProperty(key) {
      return universalConfig[key]
    },
    initConfigPropertiesFromEnvvars() {
      this.setConfigProperty('apiEndpoint', this.$config.apiEndpoint)
      this.setConfigProperty('apiCompaniesPath', this.$config.apiCompaniesPath)
      this.setConfigProperty('network', this.$config.network)
      this.setConfigProperty('headerLogoUrl', this.$config.headerLogoUrl)
      this.setConfigProperty('searchbarBackground', this.$config.searchbarBackground)
      this.setConfigProperty('primaryColor', this.$config.primaryColor)
      this.setConfigProperty('hiddenFilters', this.$config.hiddenFilters)
      this.setConfigProperty('visibleSpecializationAreas', this.$config.visibleSpecializationAreas)

      this.fetchSetup().then(setup => {
        if(this.$config.primaryColor === undefined || this.$config.primaryColor === '') {
          this.setConfigProperty('primaryColor', setup.primaryColor)
        }
        if(this.$config.headerLogoUrl === undefined || this.$config.headerLogoUrl === '') {
          this.setConfigProperty('headerLogoUrl', setup.headerLogoUrl)
        }
        if(this.$config.searchbarBackground === undefined || this.$config.searchbarBackground === '') {
          this.setConfigProperty('searchbarBackground', setup.searchbarBackground)
        }
      })
      .catch(err => console.log(err))
    },
    async fetchSetup() {
      let endpoint = this.getConfigProperty('apiEndpoint') + this.getConfigProperty('apiCompaniesPath')
      if (endpoint.slice(-1) === '/') {
        endpoint = endpoint.slice(0, endpoint.length - 1)
      }
      const response = await fetch(endpoint + '-setup')
      if (!response.ok) {
        throw new Error(`Error while fetching ${endpoint}-setup: errorcode was ${response.status}`);
      }
      return {
        primaryColor: response.data.primaryColor,
        headerLogoUrl: this.getConfigProperty('apiEndpoint') + response.data.logo.url,
        searchbarBackground: this.getConfigProperty('apiEndpoint') + response.data.coverImage.url
      }
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
      return response.data.map((company) => company['data_' + lang] ? company['data_' + lang] : company)
    },

    formatWithThousandSeparator(number) {
      return number
        ? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
        : ''
    },

    getAvailableImageFormat(formats, startFromLargest = true) {
      if(startFromLargest) {
        if (formats?.large) {
          return formats.large.url
        }

        if (formats?.medium) {
          return formats.medium.url
        }

        if (formats?.small) {
          return formats.small.url
        }
      } else {
        if (formats?.small) {
          return formats.small.url
        }

        if (formats?.medium) {
          return formats.medium.url
        }

        if (formats?.large) {
          return formats.large.url
        }
      }

      return formats?.thumbnail?.url
    },

    /**
     * returns a url similar to getAvailableImageFormat, but also takes datasets into account, where no formats are specified (only seen for avif images yet)
     */
    getAvailableImageFormatV2(image, startFromLargest) {
      if (image.formats) {
        return this.getAvailableImageFormat(image.formats)
      } else {
        return image.url
      }
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
          this.getConfigProperty('apiEndpoint') +
            this.getConfigProperty('apiCompaniesPath') +
            '?locale=' +
            this.$i18n.locale +
            '&populate=*' +
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

    async fetchCompanyById(companyId) {
      const response = await fetch(
        this.getConfigProperty('apiEndpoint') +
          this.getConfigProperty('apiCompaniesPath') +
          '?locale=' +
          this.$i18n.locale +
          '&populate=*' +
          '&' + encodeURIComponent('filters[companyId][$eq]') + "=" + encodeURIComponent(companyId)
      ).catch(() => {
        alert('Sorry, an error has occurred while fetching the company.')
      })
      const fetchedCompany = await response.json()

      return fetchedCompany
    },

    async fetchCompanyByName(companyName) {
      const response = await fetch(
        this.getConfigProperty('apiEndpoint') +
          this.getConfigProperty('apiCompaniesPath') +
          "?locale=" + this.$i18n.locale +
          '&' + encodeURIComponent('filters[name][$eq]') + "=" + encodeURIComponent(companyName)
      ).catch(() => {
        alert('Sorry, an error has occurred while fetching the company.')
      })
      const fetchedCompany = await response.json()

      return fetchedCompany
    },

    /**
     * This function calculates wether it's better (according to contrast) to use black or white as textcolor/foreground based on the backgroundcolor.
     * @param backgroundColor hexcolor, either with 3 or 6 digits
     * @returns 'black' or 'white'
     */
    getTextColor(backgroundColor) {
      // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
      backgroundColor = backgroundColor.replace(
        shorthandRegex,
        function (m, r, g, b) {
          return r + r + g + g + b + b
        }
      )

      const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
        backgroundColor
      )
      const brightness = Math.round(
        (parseInt(rgb[1], 16) * 299 +
          parseInt(rgb[2], 16) * 587 +
          parseInt(rgb[3], 16) * 114) /
          1000
      )
      return brightness > 125 ? 'black' : 'white'
    },
    hexAdjustBrightness(hexColor, percent) {
        let R = parseInt(hexColor.substring(1,3),16);
        let G = parseInt(hexColor.substring(3,5),16);
        let B = parseInt(hexColor.substring(5,7),16);

        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);

        R = (R<255)?R:255;
        G = (G<255)?G:255;
        B = (B<255)?B:255;

        R = Math.round(R)
        G = Math.round(G)
        B = Math.round(B)

        const RR = ((R.toString(16).length===1)?"0"+R.toString(16):R.toString(16));
        const GG = ((G.toString(16).length===1)?"0"+G.toString(16):G.toString(16));
        const BB = ((B.toString(16).length===1)?"0"+B.toString(16):B.toString(16));

        return "#"+RR+GG+BB;
    },
    setGlobalCSSVariable(rootElement, varname, value) {
      if(rootElement)
        rootElement.style.setProperty(varname, value)
    },
    setStandardGlobalCSSVariables(rootElement, primaryColor) {
      this.setGlobalCSSVariable(rootElement, '--primary-color', primaryColor);
      this.setGlobalCSSVariable(rootElement, '--primary-hover', this.hexAdjustBrightness(primaryColor, this.getTextColor(primaryColor) === 'white' ? -20 : 20));
      this.setGlobalCSSVariable(rootElement, '--primary-color-text', this.getTextColor(primaryColor));
    },
    truncate(str, length, useWordBoundary ){
      if (!str) { return ""; }
      if (str.length <= length) { return str; }
      const subString = str.slice(0, length-1); // the original check
      return (useWordBoundary
        ? subString.slice(0, subString.lastIndexOf(" "))
        : subString) + "…";
    },
    /*
     * returns true, when width (in px) of component-view is greater or equal than 768
     */
    landscapeMode(minWidth = 768) {
      /*
       * NOTE: To change the value for the css container queries, you'll need to configure tailwind.config.js.
       * For more info, read this: https://v2.tailwindcss.com/docs/breakpoints
       */
      const rootElement1 = this.$root.$el
      let rootElement2
      if (typeof window !== 'undefined')
        rootElement2 = document.getElementsByClassName('component-view')[0]
      const width = rootElement1?.clientWidth || rootElement2?.clientWidth

      if (width)
        return width >= minWidth
      else
        return false
    }
  },
}
