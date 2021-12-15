<script>
import { h } from 'vue'
export default {
  render () {
    return h(
      'ins',
      {
        'class': ['adsbygoogle'],
        style: this.adStyle,
        'data-ad-client': this.adClient || this.options.id,
        'data-ad-slot': this.adSlot || null,
        'data-ad-format': this.adFormat,
        'data-ad-region': this.show ? this.adRegion() : null,
        'data-ad-layout': this.adLayout || null,
        'data-ad-layout-key': this.adLayoutKey || null,
        'data-page-url': this.pageUrl ? this.pageUrl : null,
        'data-analytics-uacct': this.analyticsUacct || this.options.analyticsUacct || null,
        'data-analytics-domain-name': this.analyticsDomainName || this.options.analyticsDomainName || null,
        'data-adtest': this.options.test ? 'on' : null,
        'data-adsbygoogle-status': this.show ? null : '',
        'data-full-width-responsive': this.adFullWidthResponsive || null,
        innerHTML: this.show ? '' : ' ',
        key: Math.random()
      }
    )
  },
  props: {
    adClient: {
      type: String,
      default: undefined
    },
    adSlot: {
      type: String
    },
    adFormat: {
      type: String,
      default: 'auto'
    },
    adLayout: {
      type: String
    },
    adLayoutKey: {
      type: String
    },
    adStyle: {
      type: Object,
      default () {
        return {
          display: 'block'
        }
      }
    },
    adFullWidthResponsive: {
      type: Boolean,
      default: false
    },
    pageUrl: {
      type: String
    },
    analyticsUacct: {
      type: String,
      default: undefined
    },
    analyticsDomainName: {
      type: String,
      default: undefined
    },
    includeQuery: {
      type: Boolean,
      default: undefined
    }
  },
  data () {
    return {
      show: true,
      renderQueue: [],
      key: Math.random()
    }
  },
  mounted () {
    this.showAd()
  },
  computed: {
    options() {
      const options = { ...useRuntimeConfig()['google-adsense'] || {} }
      if (options.test) {
        options.id = 'ca-google'
      }
      return options
    },
    _includeQuery() {
      return this.includeQuery || (typeof this.includeQuery === 'undefined' && this.options.includeQuery)
    }
  },
  watch: {
    '$route' (to, from) {
      // Update if element is connected to DOM.
      // Prevent updating not connected alive componentns.
      if (this.$el && !this.$el.isConnected) {
        return;
      }
      if (to.fullPath === from.fullPath) {
        return;
      }
      const keys = Object.keys
      const toQuery = to.query
      const fromQuery = from.query
      let changed = false
      if (to.path !== from.path) {
        changed = true
      } else if (this._includeQuery) {
        // If we include query params, check to see if they are loosely unequal
        changed = (keys(toQuery).length !== keys(fromQuery).length) || !keys(toQuery).every(k => toQuery[k] === fromQuery[k])
      }
      if (changed) {
        // If the route has changed, update the ad
        this.updateAd()
      }
    }
  },
  methods: {
    adRegion () {
      return 'page-' + Math.random()
    },
    updateAd () {
      if (this.isServer) {
        return
      }
      // Reset the INS element
      this.show = false

      // Show new ad on nextTick
      this.$nextTick(this.showAd)
    },
    showAd () {
      this.show = true
      setTimeout(() => {
        if (this.$el.innerHTML) {
          return
        }
        try {
          // Once ad container (<ins>) DOM has (re-)rendered, request a new advert
          (window.adsbygoogle = window.adsbygoogle || []).push({})
        } catch (error) {
          console.error(error)
        }
      }, 50)
    }
  }
}
</script>