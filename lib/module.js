const { resolve } = require('path')

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
  onPageLoad: false
}

// Default client ID for testing
const TestID = 'ca-google'

// Adsense script URL
const AdSenseURL = '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'

module.exports = function nuxtAdSense (moduleOptions = {}) {
  const options = Object.assign({}, Defaults, this.options['google-adsense'] || moduleOptions)

  // Normalize options
  options.test = Boolean(options.test)
  options.pageLevelAds = Boolean(options.pageLevelAds)
  options.includeQuery = String(Boolean(options.includeQuery))
  options.analyticsUacct = options.analyticsUacct || ''
  options.analyticsDomainName = options.analyticsDomainName || ''
  options.overlayBottom = Boolean(options.overlayBottom)
  options.onPageLoad = Boolean(options.onPageLoad)

  if (this.options.dev && process.env.NODE_ENV !== 'production') {
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

  // Register our plugin and pass config options
  this.addPlugin({
    src: resolve(__dirname, './plugin.template.js'),
    fileName: 'adsbygoogle.js',
    options: options
  })

  // Add the async Google AdSense script to head
  this.options.head.script.push({
    hid: 'adsbygoogle-script',
    async: true,
    crossorigin: 'anonymous',
    src: `${AdSenseURL}?client=${options.id}`
  })

  // Unfortunately these lines are needed to prevent vue-meta from esacping quotes in the init script
  this.options.head.__dangerouslyDisableSanitizersByTagID = this.options.head.__dangerouslyDisableSanitizersByTagID || {}
  this.options.head.__dangerouslyDisableSanitizersByTagID.adsbygoogle = ['innerHTML']

  const adsenseScript = `{
    google_ad_client: "${options.id}",
    enable_page_level_ads: ${options.pageLevelAds ? 'true' : 'false'},
    overlays: {bottom: ${options.overlayBottom}}
  }`
  // Initialize Adsense with ad client id
  if (!options.onPageLoad) {
    this.options.head.script.push({
      hid: 'adsbygoogle',
      innerHTML: ensureScriptExecuteOnce(
        `(window.adsbygoogle = window.adsbygoogle || []).push(${adsenseScript});`
      )
    })
  } else {
    this.options.head.script.push({
      hid: 'adsbygoogle',
      innerHTML: ensureScriptExecuteOnce(
        `(window.adsbygoogle = window.adsbygoogle || []).onload = function () {
          [].forEach.call(document.getElementsByClassName('adsbygoogle'), function () { adsbygoogle.push(${adsenseScript}); })
        };`
      )
    })
  }

  // If in DEV mode, add robots meta first to comply with Adsense policies
  // To prevent MediaPartenrs from scraping the site
  if (options.test) {
    this.options.head.meta.unshift({
      name: 'robots',
      content: 'noindex,noarchive,nofollow'
    })
  }
}

function ensureScriptExecuteOnce (script) {
  return `if (!window.__abg_called){ ${script} window.__abg_called = true;}`
}

module.exports.meta = require('./../package.json')
