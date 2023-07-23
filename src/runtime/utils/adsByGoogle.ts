import { RouteLocationNormalizedLoaded } from 'vue-router'
import { Ref } from 'vue'
import { nextTick } from '#imports'


export interface AdsByGoogleWindow extends Window {
  adsbygoogle: unknown[]
}
export declare let window: AdsByGoogleWindow

export function useAdsense() {


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

  async function updateAd(show: Ref<boolean>) {
    if (process.server)
      return

    show.value = false
    await nextTick()
    show.value = true
  }

  function showAd(ad: HTMLElement | null) {
    setTimeout(() => {
      if (ad?.innerHTML)
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
    hasRouteChanged,
    updateAd,
    showAd,
    generateAdRegion
  }
}
