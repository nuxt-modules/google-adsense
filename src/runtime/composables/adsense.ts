import { RouteLocationNormalizedLoaded } from 'vue-router'
import { Ref, computed, ref } from 'vue'

export interface AdsByGoogleWindow extends Window {
  adsbygoogle: unknown[]
}
export declare let window: AdsByGoogleWindow


export function useAdsense(
  ad: Ref<HTMLElement | null>,
  ) {
  const innerHtml = computed(() => show.value ? '' : ' ')
  const key = computed(() => Math.random())
  const show = ref(true)

  function hasRouteChanged(
    newRoute: RouteLocationNormalizedLoaded,
    oldRoute?: RouteLocationNormalizedLoaded,
  ) {

    // check if path changed
    if (newRoute.path !== oldRoute?.path)
      return true

    const newQueryKeys = Object.keys(newRoute.query)
    const oldQueryKeys = Object.keys(oldRoute.query)

    // check if query changed
    return newQueryKeys.length !== oldQueryKeys.length
      || newQueryKeys.some((key) => newRoute.query[key] !== oldRoute.query[key])
  }

  async function updateAd() {
    if (process.server)
      return

    setTimeout(() => {
      if (ad.value?.innerHTML)
        return

      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (error) {
        console.error(error)
      }
    }, 50)
  }


  function generateAdRegion() {
    return `page-${Math.random()}`
  }


  return {
    generateAdRegion,
    hasRouteChanged,
    innerHtml,
    key,
    show,
    updateAd,
  }
}
