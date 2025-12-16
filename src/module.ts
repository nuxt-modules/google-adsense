import { defineNuxtModule, createResolver, logger, addComponent, addImports } from '@nuxt/kit'
import { defu } from 'defu'
import { initializeAdClient } from './utils'

export type AdFormats = 'auto' | 'fixed' | 'rectangle' | 'horizontal' | 'vertical'

export interface ModuleOptions {
  id?: string
  analyticsDomainName?: string
  analyticsUacct?: string
  adFormat?: AdFormats | string
  hideUnfilled?: boolean
  includeQuery?: boolean
  onPageLoad?: boolean
  overlayBottom?: boolean
  pageLevelAds?: boolean
  pauseOnLoad?: boolean
  tag?: string
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
      nuxt: '>=3.0.0',
    },
  },
  defaults: nuxt => ({
    id: TEST_ID,
    analyticsDomainName: '',
    analyticsUacct: '',
    hideUnfilled: false,
    includeQuery: false,
    onPageLoad: false,
    overlayBottom: false,
    pageLevelAds: false,
    pauseOnLoad: false,
    tag: 'adsbygoogle',
    test: nuxt.options.dev && (process.env.NODE_ENV !== 'production'),
  }),
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    if (options.test) {
      logger.info('Test mode enabled - Using Test AdSense ID')
      options.id = TEST_ID
    }
    else if (!options.id || typeof options.id !== 'string') {
      logger.warn('Invalid AdSense client ID specified')
      return
    }

    const head = nuxt.options.app.head
    head.script = head.script ?? []

    head.script.push({
      key: 'adsbygoogle-script',
      defer: true,
      crossorigin: 'anonymous',
      src: `${ADSENSE_URL}?client=${options.id}`,
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
        content: 'noindex,noarchive,nofollow',
      })
    }

    addImports({
      name: 'useAdsense',
      as: 'useAdsense',
      from: resolve('runtime/composables/adsense'),
    })

    addComponent({
      name: 'Adsbygoogle',
      filePath: resolve('runtime/components/Adsbygoogle.vue'),
    })

    nuxt.options.runtimeConfig.public.googleAdsense = defu(
      nuxt.options.runtimeConfig.public.googleAdsense,
      options,
    )
  },
})
