<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable  vue/require-default-prop -->
<script setup lang="ts">
import type { AdFormats } from '../../module'
import { useAdsense } from '#imports'

const {
  adClient = undefined,
  adSlot = null,
  adFormat,
  adLayout = null,
  adLayoutKey = null,
  adStyle = { display: 'block' },
  adFullWidthResponsive = false,
  hideUnfilled = undefined,
  pageUrl = null,
  analyticsUacct,
  analyticsDomainName,
  includeQuery,
} = defineProps<{
  adClient?: string
  adSlot?: string | null
  adFormat?: AdFormats | string
  adLayout?: AdLayouts | string
  adLayoutKey?: string | null
  adStyle?: Record<string, string>
  adFullWidthResponsive?: boolean
  hideUnfilled?: boolean
  pageUrl?: string | null
  analyticsUacct?: string
  analyticsDomainName?: string
  includeQuery?: boolean
}>()

const {
  adClass,
  dataAdClient,
  dataAdRegion,
  dataAdTest,
  dataAnalyticsDomainName,
  dataAnalyticsUacct,
  isUnfilled,
  key,
  status,

  // methods
  updateAd,
  showAd,
} = useAdsense({
  adClient,
  analyticsDomainName,
  analyticsUacct,
  hideUnfilled,
  includeQuery,
})

// expose to parent for customization
defineExpose({ isUnfilled, updateAd, showAd })
</script>

<template>
  <ins
    ref="ad"
    :key="key"
    :class="['adsbygoogle', adClass]"
    :style="adStyle"
    :data-ad-client="dataAdClient"
    :data-ad-slot="adSlot"
    :data-ad-format="adFormat"
    :data-ad-region="dataAdRegion"
    :data-ad-layout="adLayout"
    :data-ad-layout-key="adLayoutKey"
    :data-page-url="pageUrl"
    :data-analytics-uacct="dataAnalyticsUacct"
    :data-analytics-domain-name="dataAnalyticsDomainName"
    :data-adtest="dataAdTest"
    :data-adsbygoogle-status="status"
    :data-ad-full-width-responsive="adFullWidthResponsive"
  />
</template>

<style scoped>
.hide-filled {
  display: none important!;
}
</style>
