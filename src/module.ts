import { defineNuxtModule, createResolver, logger, addComponent } from '@nuxt/kit'
import defu from 'defu'
import { ADSENSE_URL, TEST_ID, CONFIG_KEY } from './config'

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


export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@nuxtjs/google-adsense',
    configKey: CONFIG_KEY,
    compatibility: {
      nuxt: '^3.0.0'
    }
  },
  defaults: (nuxt) => ({
    tag: 'adsbygoogle',
    pageLevelAds: false,
    includeQuery: false,
    analyticsUacct: '',
    analyticsDomainName: '',
    overlayBottom: false,
    test: nuxt.options.dev && process.env.NODE_ENV !== 'production' ? true : false,
    onPageLoad: false,
    pauseOnLoad: false,
  }),
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    if (options.test) {
      logger.info('Test mode enabled - Using Test AdSense ID')
      options.id = TEST_ID
    }

    if (!options.id || typeof options.id !== 'string') {
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

      // Add component to auto load
    addComponent({
      name: 'Adsbygoogle',
      filePath: resolve('runtime/components/Adsbygoogle.vue')
    })

    nuxt.options.runtimeConfig.public[CONFIG_KEY] = defu(
      nuxt.options.runtimeConfig.public[CONFIG_KEY],
      options
    )
  }
})

function createScriptMeta (script: string) {
  // Ensure `window.adsbygoogle` is defined
  script = `(window.adsbygoogle = window.adsbygoogle || []); ${script}`

  // wrap script inside a guard check to ensure it executes only once
  script = `if (!window.__abg_called){ ${script} window.__abg_called = true;}`
  return {
    hid: 'adsbygoogle',
    innerHTML: script
  }
}


function initializeAdClient(options: ModuleOptions) {
  const adsenseScript = `{
        google_ad_client: "${options.id}",
        overlays: {bottom: ${options.overlayBottom}},
        ${options.pageLevelAds ? 'enable_page_level_ads: true' : ''}
      }`

  if (!options.onPageLoad)
    return createScriptMeta(
      `adsbygoogle.pauseAdRequests=${options.pauseOnLoad ? '1' : '0'}
      adsbygoogle.push(${adsenseScript});`,
    )

  return createScriptMeta(
    `adsbygoogle.onload = function () {
              adsbygoogle.pauseAdRequests=${options.pauseOnLoad ? '1' : '0'};
              [].forEach.call(document.getElementsByClassName('adsbygoogle'), function () { adsbygoogle.push(${adsenseScript}); })
            };`)
}
