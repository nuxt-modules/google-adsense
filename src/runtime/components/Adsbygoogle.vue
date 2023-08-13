<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { useRoute, useRuntimeConfig, ref, watch, useAdsense } from '#imports'
import type {ModuleOptions} from '../../module'

withDefaults(defineProps<{
  adClient?: string
  adSlot?: string | null
  adFormat?: string
  adLayout?: string | null
  adLayoutKey?: string | null
  adStyle?: Record<string, string>
  adFullWidthResponsive?: boolean
  pageUrl?: string | null
  analyticsUacct?: string | null
  analyticsDomainName?: string | null
  includeQuery?: boolean
}>(),
{
  adFormat: 'auto',
  adFullWidthResponsive: false,
  adLayout: null,
  adLayoutKey: null,
  analyticsUacct: null,
  analyticsDomainName: null,
  pageUrl: null,
  adSlot: null,
  adStyle: () => ({ display: 'block' }),
  adClient: 'ca-google',
  })

const config = useRuntimeConfig().public.googleAdsense as ModuleOptions
const options = { ...config }

const ad = ref<HTMLElement | null>(null)
const route = useRoute()

const {
  generateAdRegion,
  hasRouteChanged,
  innerHtml,
  key,
  show,
  updateAd
} = useAdsense(ad)

// update ad on route change
watch(route, (newRoute, oldRoute) => {
  const routeChanged = hasRouteChanged(newRoute, oldRoute)

  if (!routeChanged)
    return

  updateAd()
}, { immediate: true })

</script>

<template>
  <ins
    ref="ad"
    :key="key"
    class="adsbygoogle"
    :style="adStyle"
    :data-ad-client="adClient"
    :data-ad-slot="adSlot"
    :data-ad-format="adFormat"
    :data-ad-region="show ? generateAdRegion() : null"
    :data-ad-layout="adLayout"
    :data-ad-layout-key="adLayoutKey"
    :data-page-url="pageUrl"
    :data-analytics-uacct="analyticsUacct || options.analyticsUacct"
    :data-analytics-domain-name="analyticsDomainName || options.analyticsDomainName"
    :data-adtest="options.test ? 'on' : null"
    :data-adsbygoogle-status="show ? null : ''"
    :data-ad-full-width-responsive="adFullWidthResponsive"
  >
    {{ innerHtml }}
  </ins>
</template>
