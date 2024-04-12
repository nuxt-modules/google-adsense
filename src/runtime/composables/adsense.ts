import { computed, ref, nextTick, onMounted, watch, watchEffect } from 'vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { useCurrentElement } from '@vueuse/core'
import { defu } from 'defu'

import type { ComputedRef } from 'vue'
import { useRoute, useRuntimeConfig } from '#imports'

/// TYPES
export interface AdsByGoogleWindow extends Window {
  adsbygoogle: unknown[]
}
// eslint-disable-next-line import/no-mutable-exports
export declare let window: AdsByGoogleWindow

type RoutePathAndQuery = [
  RouteLocationNormalizedLoaded['path'],
  RouteLocationNormalizedLoaded['query'],
]

export type UseAdsenseOptions = {
  adClient?: string
  analyticsDomainName?: string
  analyticsUacct?: string
  hideUnfilled?: boolean
  includeQuery?: boolean
}

/// USE ADSENSE COMPOSABLE
export function useAdsense(input: UseAdsenseOptions) {
  const config = useRuntimeConfig().public.googleAdsense

  // override module config with component props
  const options = defu(input, config)

  const adClient = options.adClient ?? options.id
  const adTest = options.test ? 'on' : null
  const key = Math.random()

  // Ad element
  const ad = useCurrentElement()
  const adClass = ref('')
  const show = ref(false)

  // computed properties
  const adRegion = computed(() => show.value ? `page-${Math.random()}` : null)
  /**
   * isUnfilled - ad elements data - ad - status attribute,
   * watched to set adClass = 'hide-filled' if hideUnfilled = true
   */
  const isUnfilled = computed(() => ad.value
    ?.getAttribute('data-ad-status') === 'unfilled')
  /**
   * Route path & query attribute computed refs
   */
  const path = useRouteAttr('path')
  const queryParams = useRouteAttr('query')
  const status = computed(() => show.value ? null : '')

  async function updateAd() {
    if (import.meta.server)
      return

    // reset ad element
    show.value = false

    // show new ad on next tick
    await nextTick()
    showAd()
  }

  async function showAd() {
    // once ad element rerenders, request new ad
    show.value = true
    await nextTick()

    if (ad.value?.innerHTML)
      return

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    }
    catch (error) {
      console.error(error)
    }
  }

  // update ad on route change
  watch([path, queryParams], (
    newRoute,
    oldRoute,
  ) => {
    const routeChanged = hasRouteChanged(newRoute, oldRoute, options.includeQuery)

    if (ad.value && !ad.value.isConnected)
      return

    if (!routeChanged)
      return

    updateAd()
  })

  // update ad inner html, triggers rerender
  watchEffect(() => {
    if (!ad.value || !ad.value.isConnected)
      return

    if (show.value)
      ad.value.innerHTML = ''
    else
      ad.value.innerHTML = ' '
  })

  if (options.hideUnfilled) {
    /**
     * hide unfilled ads if hideUnfilled = true
     * watch for unfilled status and update ad class
     */
    watchEffect(() => isUnfilled.value && (adClass.value = 'hide-unfilled'))
  }

  onMounted(() => showAd())

  return {
    // computed properties
    adClass,
    dataAdClient: adClient,
    dataAdRegion: adRegion,
    dataAdTest: adTest,
    dataAnalyticsDomainName: options.analyticsDomainName,
    dataAnalyticsUacct: options.analyticsUacct,
    isUnfilled,
    key,
    status,

    // methods
    updateAd,
    showAd,
  }
}

/// UTILS

// Returns route path and query params as computed ref
function useRouteAttr<
  K extends keyof RouteLocationNormalizedLoaded,
>(name: K): ComputedRef<RouteLocationNormalizedLoaded[K]> {
  const route = useRoute()
  return computed(() => route[name])
}

function hasRouteChanged(
  newRoute: RoutePathAndQuery,
  oldRoute: RoutePathAndQuery,
  includeQuery?: boolean,
) {
  const [newPath, newQuery] = newRoute
  const [oldPath, oldQuery] = oldRoute

  // check if path changed
  if (newPath !== oldPath)
    return true

  if (!includeQuery)
    return

  // check if query params changed
  const newQueryKeys = Object.keys(newQuery)
  const oldQueryKeys = Object.keys(oldQuery)

  return newQueryKeys.length !== oldQueryKeys.length
    || newQueryKeys.some(key => newQuery[key] !== oldQuery[key])
}
