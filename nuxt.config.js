// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: CC0-1.0

import i18nOptions from './src/plugins/i18n.options'

const matomo =
  !process.env.DISABLED_MATOMO || process.env.DISABLED_MATOMO === 'false'

const targetConfig = !process.env.TARGET_CONFIG ? 'server' : process.env.TARGET_CONFIG;

console.log(targetConfig);

const config = {
  ssr: targetConfig === 'server', // NOTE: if ssr need to be enabled, first change the inclusion on vuelayers in the component MapView implementing a plugin
  target: targetConfig,

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
      { name: 'google-site-verification', content: 'xFg36VV3r7ycMqVCrgMcxwwHrOiZKU7j9zzjlZH9PNY' }, // Google Console verification token for Raphael Siller
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
    { src: '@/plugins/vue-notification.server.js', ssr: true },
    { src: '@/plugins/vue-notification.client.js', ssr: false },
    '@/plugins/vue-js-modal.js',
    '@/plugins/notify',
    { src: '@/plugins/vue-html2pdf.client.js', ssr: false },
    { src: '@/plugins/vuelayers.client.js', ssr: false },
    { src: '@/plugins/ol.client.js', ssr: false },
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
  modules: [
    'nuxt-i18n',
    '@/shared/vuelayers',
    'nuxt-custom-elements',
  ],

  customElements: {
    entries: [
      {
        name: 'NOI Automotive',
        shadow: true,
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
          },{
            name: 'CompanieMapping',
            path: '@/components-lazy/ui/generic/Map',
          },{
            name: 'PdfExport',
            path: '@/components-lazy/tools/PdfExporter',
          },
        ],
      },
    ],
  },

  i18n: i18nOptions,

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ['ol', 'vuelayers', 'twind'],
    extractCSS: targetConfig === 'server',
    tailwindcss: {
      viewer: false, // disabled because it causes `Error: Cannot find module 'tailwindcss/resolveConfig'`, fixed in https://github.com/nuxt-community/tailwindcss-module/pull/303
    },
    babel: {
      compact: process.env.NODE_ENV === 'production',
      presets: [
        ['@nuxt/babel-preset-app', {
          useBuiltIns: 'entry',
        }]
      ],
    },

    extend: (config) => {
      const svgRule = config.module.rules.find((rule) => rule.test.test('.svg'))

      svgRule.test = /\.(png|jpe?g|gif|webp)$/

      config.module.rules.push({
        test: /\.svg$/,
        oneOf: [
          {
            include: (absolutePath) => absolutePath.includes('search.svg'),
            loader: 'url-loader',
          },
          {
            exclude: (absolutePath) => absolutePath.includes('search.svg'),
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
        exclude: (absolutePath) => absolutePath.includes('search.svg'),
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
      config.module.rules.push(
        // Process any JS outside of the app with Babel.
        // Required because twind uses optional chaining, which isn't supported by default
        {
          test: /\.(js|cjs|mjs)$/,
          include: /@twind/,
          loader: require.resolve('babel-loader'),
          type: 'javascript/auto',
          options: {
            babelrc: false,
            configFile: false,
            compact: false,
            cacheDirectory: true,
            plugins: [
              '@babel/plugin-proposal-nullish-coalescing-operator',
              '@babel/plugin-proposal-optional-chaining',
            ],
          },
        }
      )
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

if (targetConfig === 'server') {
  // config.modules.push(['nuxt-lazy-load', { directiveOnly: true }])  // With directiveOnly, only images with v-lazy-load get lazy-loaded
  config.modules.push('nuxt-lazy-load')
}
// set env var 'MATOMO = true' to enable matomo for websites
// keep deactivated for webcomponents
if (matomo) {
  /* eslint-disable no-console */
  console.log('MATOMO ENABLED')
  console.log(matomo)
  /* eslint-enable */
  config.head.link.push({
    rel: 'stylesheet',
    href: 'https://scripts.opendatahub.com/cookieconsent/opendatahub/cookieconsent.css',
  })
  config.head.script = []
  config.head.script.push({
    body: true,
    type: 'text/javascript',
    src: 'https://scripts.opendatahub.com/cookieconsent/cookieconsent.js',
  })
  config.head.script.push({
    body: true,
    type: 'text/javascript',
    src: 'https://scripts.opendatahub.com/cookieconsent/cookieconsent-init.js',
  })
  config.head.script.push({
    type: 'text/plain',
    'data-cookiecategory': 'targeting',
    src: './matomo.js',
  })
}
export default config
