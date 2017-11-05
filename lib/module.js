const { resolve } = require('path')

// Default for adslots (defaults to test mode)
const Defaults = {
  tag: 'adsbygoogle',
  id: null,
  pageLevelAds: false,
  includeQuery: false,
  analyticsUacct: '',
  analyticsDomainName: '',
  test: false
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
    async: true,
    src: AdSenseURL
  })

  // Unfortunalyley these lines are needed to prevent vue-meta from esacping the quotes in the following content
  this.options.head.__dangerouslyDisableSanitizers = this.options.head.__dangerouslyDisableSanitizers || []
  this.options.head.__dangerouslyDisableSanitizers.push('script')

  // Initialize Adsense with ad client id
  this.options.head.script.push({innerHTML: `
      (adsbygoogle = window.adsbygoogle || []).push({
        google_ad_client: "${options.id}",
        enable_page_level_ads: ${options.pageLevelAds ? 'true' : 'false'}
      });
  `})

  // If in DEV mode, add robots meta first to comply with Adsense policies
  // To prevent MediaPartenrs from scraping the site
  if (options.test) {
    this.options.head.meta.unshift({
      name: 'robots',
      content: 'noindex,noarchive,nofollow'
    })
  }
}

module.exports.meta = require('./../package.json')
