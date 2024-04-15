<script setup lang="ts">
import { computed, navigateTo, useRoute } from '#imports'

const route = useRoute()

function changeQueryParams() {
  if (hasQueryParams.value)
    navigateTo({
      path: currentRoute.value,
      query: {},
    })
  else
    navigateTo({
      path: currentRoute.value,
      query: { test: 'true' },
    })
}

const currentRoute = computed(() => route.fullPath)
const hasQueryParams = computed(() => currentRoute.value.includes('?'))
</script>

<template>
  <div class="default-layout">
    <h3>[DEFAULT LAYOUT]</h3>
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
      :ad-style="{ display: 'inline-block', height: '90px', maxWidth: '1000px' }"
    />

    <button @click="changeQueryParams()">
      Change Query Params
    </button>

    <NuxtPage />
  </div>
</template>

<style>
body {
  background-color: #18181B;
  color: #ffffff;
}

a {
  color: #ffffff;
  padding: 8px;
  border: 1px solid #ffffff54;
  border-radius: 5px;
}
button {
  margin: auto;
  background: #00DC82;
  color: #fff;
  padding: 8px;
  border-radius: 5px;
  border: transparent;
  text-decoration: none;
}

.default-layout {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 100vh;
  padding: 24px;
  margin: auto;
}

.default-layout  h2 h3 {
  text-align: center;
}

nav {
  display: flex;
  gap: 12px;
}
</style>
