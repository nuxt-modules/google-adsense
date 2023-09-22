<script setup lang="ts">
import { computed, navigateTo, useRoute } from '#imports'
const route = useRoute()

function changeQueryParams() {
  if (hasQueryParams.value)
    navigateTo({
      path: currentRoute.value,
      query: {}
    })
  else
    navigateTo({
      path: currentRoute.value,
      query: { test: 'true' }
    })
}

const currentRoute = computed(() => route.fullPath)
const hasQueryParams = computed(() => currentRoute.value.includes('?'))
</script>

<template>
  <div class="default-layout">
    <h1>[DEFAULT LAYOUT]</h1>
    <nav>
      <NuxtLink to="/">
        Home
      </NuxtLink>
      <NuxtLink to="/page2">
        Page 2
      </NuxtLink>
    </nav>

    <p>Ad in layout refreshes on navigation</p>
    <Adsbygoogle
      ad-format="horizontal"
      data-ad-full-width-responsive="true"
      :ad-style="{ display: 'inline-block', height: '90px', maxWidth: '1000px'}"
    />

    <button @click="changeQueryParams()">
      Change Query Params
    </button>


    <NuxtPage />
  </div>
</template>

<style>
button {
  margin: auto;
  background: #00DC82;
  padding: 8px;
}

.default-layout {
  display: flex;
  flex-direction: column;
  gap: 36px;
  height: 100vh;
  padding: 24px;
  margin: auto;
}

.default-layout  h2 {
  margin-top: auto;
  text-align: center;
}

nav {
  display: flex;
  gap: 12px;
}
</style>
