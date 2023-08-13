import { defineNuxtModule, createResolver, logger, addComponent, addImports } from '@nuxt/kit'
import { defu } from 'defu'
import { initializeAdClient } from './utils'


export interface ModuleOptions {
  tag?: string,
  id?: string,
  analyticsUacct?: string,
  analyticsDomainName?: string,
  pageLevelAds?: boolean,
  includeQuery?: boolean,
  overlayBottom?: boolean,
  onPageLoad?: boolean,
  pauseOnLoad?: boolean,
  test?: boolean
}

// AdSense script URL
const ADSENSE_URL = '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
// Default client ID for testing
const TEST_ID = 'ca-google'



export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@nuxtjs/google-adsense',
    configKey: 'googleAdsense',
    compatibility: {
      nuxt: '^3.X.X'
    }
  },
  defaults: (nuxt) => ({
    id: TEST_ID,
    tag: 'adsbygoogle',
    pageLevelAds: false,
    includeQuery: false,
    analyticsUacct: '',
    analyticsDomainName: '',
    overlayBottom: false,
    test: nuxt.options.dev && (process.env.NODE_ENV !== 'production'),
    onPageLoad: false,
    pauseOnLoad: false,
  }),
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    if (options.test) {
      logger.info('Test mode enabled - Using Test AdSense ID')
      // options.id = TEST_ID
    }
    else if (options.id !== TEST_ID || typeof options.id !== 'string') {
      logger.warn('Invalid AdSense client ID specified')
      return
    }

    const head = nuxt.options.app.head
    head.script = head.script ?? []

    head.script.push({
      hid: 'adsbygoogle-script',
      defer: true,
      crossorigin: 'anonymous',
      src: `${ADSENSE_URL}?client=${options.id}`
    })

    // Initialize AdSense with ad client id
    const scriptMeta = initializeAdClient(options)
    head.script.push(scriptMeta)

    // If in DEV mode, add robots meta first to comply with AdSense policies
    // To prevent MediaPartners from scraping the site
    if (options.test) {
      head.meta = head.meta ?? []
      head.meta.unshift({
        name: 'robots',
        content: 'noindex,noarchive,nofollow'
      })
    }

    addImports({
      name: 'useAdsense',
      as: 'useAdsense',
      from: resolve('runtime/composables/adsense')
    })

      // Add component to auto load
    addComponent({
      name: 'Adsbygoogle',
      filePath: resolve('runtime/components/Adsbygoogle.vue')
    })

    nuxt.options.runtimeConfig.public.googleAdsense = defu(
      nuxt.options.runtimeConfig.public.googleAdsense,
      options
    )
  }
})
