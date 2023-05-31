// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: CC0-1.0

import i18nOptions from './src/plugins/i18n.options'

export default {
  ssr: false, // NOTE: if ssr need to be enabled, first change the inclusion on vuelayers in the component MapView implementing a plugin
  target: 'static',

  srcDir: 'src/',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'NOI Automotive Automation',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com"',
      },
      {
        rel: 'preload',
        as: 'style',
        href: 'https://fonts.googleapis.com/css2?family=Hind:wght@300;400;500;700&display=swap',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Hind:wght@300;400;500;700&display=swap',
        media: 'print',
        onload: "this.media='all'",
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@/assets/css/main.css', '@/assets/css/animations.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '@/plugins/vue-notification', ssr: false },
    '@/plugins/notify',
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: [{ path: '~/components/', pathPrefix: false }],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ['@nuxtjs/i18n', '@/shared/vuelayers', 'nuxt-custom-elements'],

  customElements: {
    entries: [
      {
        name: 'NOI Automotive',
        tags: [
          {
            name: 'NoiAutomotive',
            path: '@/components/bundle/WebComponent',
            /* options: { // NOTE: uncomment this code part to test properties
              props: {
                language: 'de',
                defaultCompany: '840',
                customLinks: '[]',
              },
            }, */
          },
        ],
      },
    ],
  },

  i18n: i18nOptions,

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend: (config) => {
      const svgRule = config.module.rules.find((rule) => rule.test.test('.svg'))

      svgRule.test = /\.(png|jpe?g|gif|webp)$/

      config.module.rules.push({
        test: /\.svg$/,
        oneOf: [
          {
            resourceQuery: /inline/,
            loader: 'file-loader',
            query: {
              name: 'static/image/[name].[hash:8].[ext]',
            },
          },
          {
            loader: 'vue-svg-loader',
            options: {
              // Optional svgo options
              svgo: {
                plugins: [{ removeViewBox: false }],
              },
            },
          },
        ],
      })

      config.module.rules.push({
        test: /\.(png|jpe?g|gif|svg|webp|avif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              esModule: false,
              limit: 1000, // 1kB
              name: '[name].[ext]',
            },
          },
        ],
      })
    },
  },

  publicRuntimeConfig: {
    apiEndpoint: process.env.API_ENDPOINT,
    apiCompaniesPath: process.env.API_COMPANIES_PATH,
  },

  router: {
    linkActiveClass: 'active',
    linkExactActiveClass: 'current',
  },

  pageTransition: 'zoom-page',

  telemetry: false,
}
