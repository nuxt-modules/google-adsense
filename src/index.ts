import { resolveRuntimeDir, resolveTemplateDir } from './dirs'

// Default for adslots (defaults to test mode)
const Defaults = {
  tag: 'adsbygoogle',
  id: null,
  pageLevelAds: false,
  includeQuery: false,
  analyticsUacct: '',
  analyticsDomainName: '',
  overlayBottom: false,
  test: false,
  onPageLoad: false,
  pauseOnLoad: false
}

// Default client ID for testing
const TestID = 'ca-google'

// Adsense script URL
const AdSenseURL = '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'

export default function nuxtAdSense (moduleOptions = {}) {
  const nuxt = this.nuxt
  const options = Object.assign({}, Defaults, nuxt.options['google-adsense'] || moduleOptions)

  // Normalize options
  options.test = Boolean(options.test)
  options.pageLevelAds = Boolean(options.pageLevelAds)
  options.includeQuery = Boolean(options.includeQuery)
  options.analyticsUacct = options.analyticsUacct || ''
  options.analyticsDomainName = options.analyticsDomainName || ''
  options.overlayBottom = Boolean(options.overlayBottom)
  options.onPageLoad = Boolean(options.onPageLoad)
  options.pauseOnLoad = Boolean(options.pauseOnLoad)

  if (nuxt.options.dev && process.env.NODE_ENV !== 'production') {
    // If in DEV mode, place ads in 'test' state automatically
    // https://www.thedev.blog/3087/test-adsense-ads-safely-without-violating-adsense-tos/
    options.test = true
  }

  if (options.test) {
    // If in test mode, we ue the Test Client ID
    options.id = TestID
  }

  if (!options.id || typeof options.id !== 'string') {
    // Invalid adsense client ID, so don't include
    // console.warn('Invalid adsense client ID specified')
    return
  }

  // Set the desired component tag name
  options.tag = options.tag || Defaults.tag


  // Add the async Google AdSense script to head
  nuxt.options.head.script.push({
    hid: 'adsbygoogle-script',
    defer: true,
    crossorigin: 'anonymous',
    src: `${AdSenseURL}?client=${options.id}`
  })

  // Unfortunately these lines are needed to prevent vue-meta from esacping quotes in the init script
  nuxt.options.head.__dangerouslyDisableSanitizersByTagID = nuxt.options.head.__dangerouslyDisableSanitizersByTagID || {}
  nuxt.options.head.__dangerouslyDisableSanitizersByTagID.adsbygoogle = ['innerHTML']

  const adsenseScript = `{
    google_ad_client: "${options.id}",
    overlays: {bottom: ${options.overlayBottom}},
    ${options.pageLevelAds ? 'enable_page_level_ads: true' : ''}
  }`
  // Initialize Adsense with ad client id
  if (!options.onPageLoad) {
    nuxt.options.head.script.push(
      createScriptMeta(
        `adsbygoogle.pauseAdRequests=${options.pauseOnLoad ? '1' : '0'};
        adsbygoogle.push(${adsenseScript});`
      )
    )
  } else {
    nuxt.options.head.script.push(
      createScriptMeta(
        `adsbygoogle.onload = function () {
          adsbygoogle.pauseAdRequests=${options.pauseOnLoad ? '1' : '0'};
          [].forEach.call(document.getElementsByClassName('adsbygoogle'), function () { adsbygoogle.push(${adsenseScript}); })
        };`
      )
    )
  }

  // If in DEV mode, add robots meta first to comply with Adsense policies
  // To prevent MediaPartenrs from scraping the site
  if (options.test) {
    nuxt.options.head.meta.unshift({
      name: 'robots',
      content: 'noindex,noarchive,nofollow'
    })
  }
  
  // Register our plugin and pass config options
  this.addPlugin({
    'data-ad-client': `ca-pub-${options.id}`,
    src: resolveTemplateDir('./plugin.mjs'),
    fileName: 'adsbygoogle.mjs',
    options: {
      component: resolveRuntimeDir('./components/Adsbygoogle.vue'),
      alias: options.tag,
    }
  })
  
  // Inject options into runtime config
  nuxt.options.publicRuntimeConfig['google-adsense'] = {
    ...options,
    ...(nuxt.options.publicRuntimeConfig['google-adsense'] || {}),
  }
}

function createScriptMeta (script: string) {
  // Ensure `window.adsbygoogle` is defined
  script = `(window.adsbygoogle = window.adsbygoogle || []); ${script}`
  // wrapp script inside a guard check to ensure it executes only once
  script = `if (!window.__abg_called){ ${script} window.__abg_called = true;}`

  return {
    hid: 'adsbygoogle',
    innerHTML: script
  }
}
