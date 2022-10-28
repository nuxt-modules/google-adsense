import { defineNuxtModule, logger, addComponentsDir, isNuxt2 as _isNuxt2, addPluginTemplate } from '@nuxt/kit'
import defu from 'defu'
import { ADSENSE_URL, DEFAULTS, ModuleOptions, TEST_ID, CONFIG_KEY } from './config'
import { resolveRuntimeDir, resolveTemplateDir } from './dirs'

export type { ModuleOptions }

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@nuxtjs/google-adsense',
    configKey: CONFIG_KEY,
    compatibility: {
      nuxt: '^2.15.0 || ^3.0.0-rc.11'
    }
  },
  defaults: (nuxt) => ({
    ...DEFAULTS,
    test: nuxt.options.dev && process.env.NODE_ENV !== 'production'
  }),
  setup (options, nuxt) {
    if (options.test) {
      logger.info('Test mode enabled - Using Test Adsense ID')
      options.id = TEST_ID
    }

    if (!options.id || typeof options.id !== 'string') {
      logger.warn('Invalid Adsense client ID specified')
      return
    }

    const isNuxt2 = _isNuxt2(nuxt)

    const useNuxtMeta = (fn: Function) => fn(isNuxt2 ? nuxt.options.head : nuxt.options.app.head)

    useNuxtMeta((head: any) => {
      head.script = head.script ?? []

      // Add the async Google AdSense script to head
      head.script.push({
        hid: 'adsbygoogle-script',
        defer: true,
        crossorigin: 'anonymous',
        src: `${ADSENSE_URL}?client=${options.id}`
      })

      const adsenseScript = `{
        google_ad_client: "${options.id}",
        overlays: {bottom: ${options.overlayBottom}},
        ${options.pageLevelAds ? 'enable_page_level_ads: true' : ''}
      }`
      // Initialize Adsense with ad client id
      if (!options.onPageLoad) {
        head.script.push(
          createScriptMeta(
            `adsbygoogle.pauseAdRequests=${options.pauseOnLoad ? '1' : '0'};
            adsbygoogle.push(${adsenseScript});`, isNuxt2)
        )
      } else {
        head.script.push(
          createScriptMeta(
            `adsbygoogle.onload = function () {
              adsbygoogle.pauseAdRequests=${options.pauseOnLoad ? '1' : '0'};
              [].forEach.call(document.getElementsByClassName('adsbygoogle'), function () { adsbygoogle.push(${adsenseScript}); })
            };`, isNuxt2)
        )
      }

      // If in DEV mode, add robots meta first to comply with Adsense policies
      // To prevent MediaPartners from scraping the site
      if (options.test) {
        head.meta = head.meta ?? []
        head.meta.unshift({
          name: 'robots',
          content: 'noindex,noarchive,nofollow'
        })
      }
    })

    if (isNuxt2) {
      addPluginTemplate({
        src: resolveTemplateDir('./plugin.mjs'),
        filename: 'adsbygoogle.js',
        options: {
          component: resolveRuntimeDir('./components/Adsbygoogle.vue'),
          alias: options.tag
        }
      })
    } else {
      // Add component to auto load
      addComponentsDir({
        path: resolveRuntimeDir('components-v3'),
      })
    }

    // Inject options into runtime config
    if (isNuxt2) {
      nuxt.options.publicRuntimeConfig[CONFIG_KEY] = defu(
        nuxt.options.publicRuntimeConfig[CONFIG_KEY],
        options
      )
    } else {
      nuxt.options.runtimeConfig.public[CONFIG_KEY] = defu(
        nuxt.options.runtimeConfig.public[CONFIG_KEY],
        options
      )
    }
  }
})

function createScriptMeta (script: string, isNuxt2: boolean) {
  // Ensure `window.adsbygoogle` is defined
  script = `(window.adsbygoogle = window.adsbygoogle || []); ${script}`
  // wrap script inside a guard check to ensure it executes only once
  script = `if (!window.__abg_called){ ${script} window.__abg_called = true;}`
  return {
    hid: 'adsbygoogle',
    innerHTML: script
  }
}
