import type { ModuleOptions } from "src/module"


export function initializeAdClient(options: ModuleOptions) {
  const adsenseScript = `{
        google_ad_client: "${options.id}",
        overlays: {bottom: ${options.overlayBottom}},
        ${options.pageLevelAds ? 'enable_page_level_ads: true' : ''}
      }`

  if (!options.onPageLoad)
    return createScriptMeta(
      `adsbygoogle.pauseAdRequests=${options.pauseOnLoad ? '1' : '0'};
      adsbygoogle.push(${adsenseScript});`,
    )

  return createScriptMeta(
    `adsbygoogle.onload = function() {
      adsbygoogle.pauseAdRequests=${options.pauseOnLoad ? '1' : '0'};
      [].forEach.call(document.querySelectorAll("ins.adsbygoogle[data-ad-client='${options.id}']"), function() { adsbygoogle.push(${adsenseScript}); })
    };`)
}

function createScriptMeta(script: string) {
  // Ensure `window.adsbygoogle` is defined
  script = `(window.adsbygoogle = window.adsbygoogle || []); ${script}`

  // wrap script inside a guard check to ensure it executes only once
  script = `if (!window.__abg_called){ ${script} window.__abg_called = true;}`
  return {
    hid: 'adsbygoogle',
    innerHTML: script
  }
}
