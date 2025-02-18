[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

---

**Note:** This branch is for **Nuxt 3** compatible module. Checkout [`legacy-v2` branch](https://github.com/nuxt-modules/google-adsense/tree/legacy-v2) for **Nuxt 2** support.

---


# Google AdSense
> Google AdSense integration for Nuxt.js. Advertisements will update whenever the page route changes

## Setup
- Add `@nuxtjs/google-adsense` dependency using yarn or npm to your project
- Add `@nuxtjs/google-adsense` to `modules` section of `nuxt.config.js`

```js
{
  modules: [
    // Simple usage
    ['@nuxtjs/google-adsense', {
      id: 'ca-pub-###########'
    }]
 ]
}
```

Using top level options:

```js
{
  modules: [
    ['@nuxtjs/google-adsense']
  ],

 googleAdsense: {
    id: 'ca-pub-#########'
  }
}

```
Using runtime config:

```js
{
  modules: [
    ['@nuxtjs/google-adsense']
  ],

  googleAdsense: {
    onPageLoad: false,
    pageLevelAds: false,
  },

  publicRuntimeConfig: {
    googleAdsense: {
      id: process.env.GOOGLE_ADSENSE_ID,
      test: process.env.GOOGLE_ADSENSE_TEST_MODE === 'true',
    },
  },
}
```

The asynchronous ad code (`//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js`) is automatically
added to the `<head>` section of your pages.


## Configuration options

| Option | type |  description
| -------- | ---- | -----------
| `id` | String | Your Google AdSense Publisher client ID (i.e. `ca-pub-#########`). **Required** when not in test mode.
| `adFormat` | String | Sets a global default ad format. Can be overridden with component props.
| `analyticsDomainName` | String | Google Analytics Account Domain (if linking analytics with AdSense, i.e. `example.com`).
| `analyticsUacct` | String | Google Analytics Account ID (if linking analytics with AdSense, i.e. `UA-#######-#`).
| `hideUnfilled` | Boolean | When `false`, unfilled ads will not be hidden, when `true` unfilled ads will be hidden. The default is `false`. 
| `includeQuery` | Boolean | When `false`, only `$route.path` is checked for changes. If set to `true` `$route.query` will also be taken into account. The default is `false`.
| `onPageLoad` | Boolean | Loads Adsense script after page load. Default is `false`.
| `overlayBottom` | Boolean | Enable Adsense Anchor Ads to show at bottom. Default is `false`. Refer to the AdSense docs for details.
| `pageLevelAds` | Boolean | Enable AdSense Page Level Ads. Default is `false`. Refer to the AdSense docs for details.
| `pauseOnLoad` | Boolean | Pauses ad requests to obtain user consent to use cookies or other local storage in accordance with the GDPR. Refer to the AdSense docs for details. `false`.
| `tag` | String | AdSense component tag name. Defaults to `adsbygoogle`.
| `test` | Boolean | Force AdSense into _test_ mode (see below).

### Test mode

The AdSense module will automatically switch to `test` mode when running Nuxt in `dev` mode.
But you can keep test mode on in production by setting the configuration option `test` to `true`.

Test mode uses a test publisher ID, so that you will not be violating AdSense TOS.

Note that test advertisements will typically appear as an empty space, but will have the
correct dimensions (i.e. will occupy the correct space needed by the rendered ad).

## Usage

Insert the `<Adsbygoogle />` component wherever you would like an advertisement placed.

You should place the `<Adsbygoogle />` component inside a container element
that has a specified (min/max) width and (min/max) height (which can be based on media queries),
or use style or classes on the `<Adsbygoogle />` component to restrict the advertisement to a
specific size (or sizes).

Use the `ad-slot` property to specify your Google AdSense ad slot value (specified as a string).

Please refer to the adsense documentation for more info.
[Google Adsense Documentation](https://support.google.com/adsense/answer/9183549?hl=en&ref_topic=9183242&sjid=7647008134090136391-NA)

**Component props:**

| prop | type | description
| ---- | ---- | -----------
| `ad-slot` | String | Google Adsense adslot. **This prop is required when not in test mode**. Refer to your AdSense account for ad-slot values.
| `ad-format` | String | Optional. Refer to the AdSense docs for other options
| `ad-style` | Object | Styles to apply to the rendered `<ins>` element. Default: `{ display: 'block' }`. Refer to VueJS [style binding docs](https://vuejs.org/v2/guide/class-and-style.html#Object-Syntax-1) for the Object format.
| `ad-layout` | String | Optional. Refer to the AdSense docs
| `ad-layout-key` | String | Optional. Refer to the AdSense docs
| `hide-unfilled` | Boolean | Optional. Hides unfilled ads if true.
| `page-url` | String | Optional.  Set a reference page URL (of similar content) if the ad is on a page that requires authentication. When set, this prop must be a fully qualified URL (including protocol and hostname).
| `include-query` | Boolean | Override global option `includeQuery` on a per ad basis. Ensure all ads on a page have the same setting.
| `analytics-uacct` | String | Google Analytics Account ID (if linking analytics with AdSense, i.e. `UA-#######-#`). Defaults to the value specified in the plugin option `analyticsUacct`.
| `analytics-domain-name` | String | Google Analytics Account domain (if linking analytics with AdSense, i.e. `example.com`). Defaults to the value specified in the plugin option `analyticsDomainName`.

**Component exposed internal data**
| name | type | description
| ____ | ____ | ___________
|`showAd` | method | Trigger the show ad method to show the ad.
| `updateAd` | method | Trigger the update ad method to refresh the ad.
| `isUnfilled` | computed ref | Tracks unfilled attribute on ad element. Returns `true` if `data-ad-state` = 'unfilled'.

## Automatic updating of Ads
Whenever your route changes or optionally if your route query parameters change, any displayed ads will update, just as they would on normal
page loads.


## Caveats:
- **Caution:** Reloading of ads arbitrarily (with minimal page content changes) may result in
the suspension of your AdSense account. _Refer to AdSense for full terms of use._
- Google needs to crawl each page where ads appear. Ensure your site SSR renders any page where
ads appear. Ads on un-crawlable pages will not be shown.
- When placing ads on pages that require authentication, set `page-url` on the `<Adsbygoogle />` component to the URL of a page on your site that is publicly accessible, which would have similar/relevant content.


## Background
This module uses a technique developed by the Angular team (with help from Google AdSense)
to handle updating ads on progressive web applications:
- https://github.com/leonardteo/google-ads-test-angularjs
- https://groups.google.com/forum/#!topic/angular/eyVo4XU04uk

Each time a new advertisement is requested, the AdSense parameter `data-ad-region` is
updated to a random value. For this reason, you cannot set the `data-ad-region` attribute
on the `<Adsbygoogle />` component.


## License

[MIT License](./LICENSE)


<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@nuxtjs/google-adsense/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/@nuxtjs/google-adsense

[npm-downloads-src]: https://img.shields.io/npm/dm/@nuxtjs/google-adsense.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/@nuxtjs/google-adsene

[license-src]: https://img.shields.io/npm/l/@nuxtjs/google-adsense.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/@nuxtjs/google-adsense

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
