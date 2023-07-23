<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { onMounted, useRoute, useRuntimeConfig, watchEffect } from '#imports'
import { useAdsense } from '../utils/adsByGoogle'
import { CONFIG_KEY } from '../../config'

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
const { generateAdRegion, hasRouteChanged, showAd, updateAd } = useAdsense()
const config = useRuntimeConfig().public[CONFIG_KEY]
const options = {
  ...config,
  id: config.test ? 'ca-google' : config.id,
}

const ad = ref<HTMLElement | null>(null)
const show = ref(false)
const route = useRoute()

const isConnected = computed(() => ad.value?.isConnected || false)
const innerHtml = computed(() => show.value ? '' : ' ')
const key = computed(() => Math.random())

// update ad on route change
watch(route, (newRoute, oldRoute) => {
  if (!isConnected.value)
    return

  const routeChanged = hasRouteChanged(newRoute, oldRoute)

  if (!routeChanged)
    return

  updateAd(show)
}, { immediate: true })

// trigger showAd
watchEffect(() => {
  if (!show.value)
    return

  showAd(ad.value)
})

// show ad on client and connected
onMounted(() => {
  if (process.client && isConnected.value)
    show.value = true
})
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
