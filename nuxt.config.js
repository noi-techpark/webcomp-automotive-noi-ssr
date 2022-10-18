const AVAILABLE_LANGUAGES = ['en', 'de', 'it']

export default {
  ssr: false,

  srcDir: 'src/',
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'NOI Automotive Automation',
    htmlAttrs: {
      lang: 'it',
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
    {
      src: '@/plugins/vuelayers.js',
      ssr: false,
    },
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
  modules: [
    'nuxt-i18n',
    '@nuxtjs/axios',
    '@/shared/vuelayers',
    'nuxt-custom-elements',
  ],

  customElements: {
    entries: [
      {
        name: 'NOI Automotive',
        tags: [
          {
            name: 'NoiAutomotive',
            path: '@/components/bundle/WebComponent',
          },
        ],
      },
    ],
  },

  i18n: {
    locales: AVAILABLE_LANGUAGES,
    strategy: 'prefix_except_default',
    defaultLocale: 'en',
    vueI18n: {
      fallbackLocale: 'en',
      messages: AVAILABLE_LANGUAGES.reduce(
        (obj, key) => ({
          ...obj,
          [key]: require('./src/locales/' + key + '.json'),
        }),
        {}
      ),
    },
  },

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
