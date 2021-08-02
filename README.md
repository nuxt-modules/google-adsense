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

 'google-adsense': {
    id: 'ca-pub-#########'
  }
}
```

The asynchronous ad code (`//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js`) is automatically
added to the `<head>` section of your pages.


## Configuration options

| Option | type |  description
| -------- | ---- | -----------
| `id` | String | Your Google Adsense Publisher client ID (i.e. `ca-pub-#########`). **Required** when not in test mode.
| `pageLevelAds` | Boolean | Enable Adsense Page Level Ads. Default is `false`. Refer to the AdSense docs for details.
| `tag` | String | AdSense component tag name. Defaults to `adsbygoogle`.
| `includeQuery` | Boolean | When `false`, only `$route.path` is checked for changes. If set to `true` `$route.query` will also be taken into account. The default is `false`.
| `analyticsUacct` | String | Google Analytics Account ID (if linking analytics with AdSense, i.e. `UA-#######-#`).
| `analyticsDomainName` | String | Google Analytics Account Domain (if linking analytics with AdSense, i.e. `example.com`).
| `overlayBottom` | Boolean | Enable Adsense Anchor Ads to show at bottom. Default is `false`. Refer to the AdSense docs for details.
| `onPageLoad` | Boolean | Loads Adsense script after page load. Default is `false`.
| `pauseOnLoad` | Boolean | Pauses ad requests to obtain user consent to use cookies or other local storage in accordance with the GDPR. Refer to the AdSense docs for details. `false`.
| `test` | Boolean | Force AdSense into _test_ mode (see below).

### Test mode

The AdSense module will automatically switch to `test` mode when runniung Nuxt in `dev` mode.
But you can keep test mode on in production by setting the configuration option `test` to `true`.

Test mode uses a test publisher ID, so that you will not be violating AdSense TOS.

Note that test advertisements will typically appear as an empty space, but will have the
correct dimensions (i.e. will occupy the correct space needed by the rendered ad).

## Usage

Insert the `<adsbygoogle />` component (or custom component name specified in options)
wherever you would like an advertisment placed.

The ad defaults to `auto` size format (configurable by setting the prop `ad-format`). This mode
is responsive by nature. You should place the `<adsbygoogle />` component inside a container element
that has a specified (min/max) width and (min/max) height (which can be based on media queries),
or use style or classes on the `<adsbygoogle />` component to restrict the advertisement to a
specific size (or sizes).

Use the `ad-slot` property to specify your google adsense ad slot value (specified as a string)

**Component props:**

| prop | type | description
| ---- | ---- | -----------
| `ad-slot` | String | Google Adsense adslot. **This prop is required when not in test mode**. Refer to your AdSense account for ad-slot values.
| `ad-format` | String | Defaults to `'auto'`. Refer to the adsense docs for other options
| `ad-style` | Object | Styles to apply to the rendered `<ins>` element. Default: `{ display: 'block' }`. Refer to VueJS [style binding docs](https://vuejs.org/v2/guide/class-and-style.html#Object-Syntax-1) for the Object format.
| `ad-layout` | String | Optional. Refer to the adsense docs
| `ad-layout-key` | String | Optional. Refer to the adsense docs
| `page-url` | String | Optional.  Set a reference page URL (of similar content) if the ad is on a page that requires authentication. When set, this prop must be a fully qualified URL (inclcuding protocol and hostname).
| `include-query` | Boolean | Override global option `includeQuery` on a per ad basis. Ensure all ads on a page have the same setting.
| `analytics-uacct` | String | Google Analytics Account ID (if linking analytics with AdSense, i.e. `UA-#######-#`). Defaults to the value specified in the plugin option `analyticsUacct`.
| `analytics-domain-name` | String | Google Analytics Account domain (if linking analytics with AdSense, i.e. `example.com`). Defaults to the value specified in the plugin option `analyticsDomainName`.


## Automatic updating of Ads
Whenever your route changes, any disaplayed ads will update, just as they would on normal
page loads.


## Caveats:
- **Note:** AdSense limits you to a maximum of three (3) ads per page.
- **Caution:** Reloading of ads arbitrarily (with minimal page content changes) may result in
the suspension of your AdSense account. _Refer to AdSense for full terms of use._
- Google needs to crawl each page where ads appear. Ensure your site SSR renders any page where
ads apepar. Ads on un-crawlable pages will not be shown.
- When placing ads on pages that require authentication, set `page-url` on the `<adsbygoogle />` component to the URL of a page on your site that is publicly accessible, which would have similar/relevant content.


## Background
This module uses a technique developed by the Angular team (with help from Google Adsense)
to handle updating ads on progressive web applications:
- https://github.com/leonardteo/google-ads-test-angularjs
- https://groups.google.com/forum/#!topic/angular/eyVo4XU04uk

Each time a new advertisement is requested, the adsense parameter `data-ad-region` is
updated to a random value. For this reason, you cannot set the `data-ad-region` attribute
on the `<adsbygoogle />` component.

For test mode, the following blog was used as a reference:
- https://www.thedev.blog/3087/test-adsense-ads-safely-without-violating-adsense-tos/


## License

[MIT License](./LICENSE)

Copyright (c) 2017 Troy Morehouse - Nuxt Community
