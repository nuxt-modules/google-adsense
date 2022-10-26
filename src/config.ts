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

export const DEFAULTS: ModuleOptions = {
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

export const CONFIG_KEY = 'google-adsense'

// Default client ID for testing
export const TEST_ID = 'ca-google'
// Adsense script URL
export const ADSENSE_URL = '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
