<template>
  <div class="page-layout">
    <div>
      <div class="content">
        <p>
          The AdSense module will automatically switch to test mode when running Nuxt in dev mode.
          But you can keep test mode on in production by setting the configuration option test to true.
        </p>
        <p>
          Test mode uses a test publisher ID,
          so that you will not be violating AdSense TOS.
        </p>
        <p>
          Note that test advertisements will typically appear as an empty space,
          but will have the correct dimensions (i.e. will occupy the correct space needed by the rendered ad).
        </p>
        <p>
          In this example, ads within the pages are configured to refresh with query parameter changes.
        </p>

        <p><strong>The gray area shows the advertisement</strong></p>
      </div>
    </div>

    <Adsbygoogle :include-query="true" />
  </div>
</template>

<style scoped>
.page-layout {
  display: flex;
  flex-direction: column;
  gap: 36px;
}
</style>
