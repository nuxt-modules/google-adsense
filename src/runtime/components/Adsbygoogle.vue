<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable  vue/require-default-prop -->
<script setup lang="ts">
import type { AdFormats } from '../../module'
import { useAdsense } from '#imports'

const {
  adClient,
  analyticsDomainName,
  analyticsUacct,
  hideUnfilled,
  includeQuery,
} = withDefaults(defineProps<{
  adClient?: string
  adSlot?: string | null
  adFormat?: AdFormats | string
  adLayout?: string | null
  adLayoutKey?: string | null
  adStyle?: Record<string, string>
  adFullWidthResponsive?: boolean
  hideUnfilled?: boolean
  pageUrl?: string | null
  analyticsUacct?: string
  analyticsDomainName?: string
  includeQuery?: boolean
}>(),
{
  adFullWidthResponsive: false,
  adLayout: null,
  adLayoutKey: null,
  pageUrl: null,
  adSlot: null,
  adStyle: () => ({ display: 'block' }),
  adClient: undefined,
  hideUnfilled: undefined,
})

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
