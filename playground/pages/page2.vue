<template>
  <div>
    <div>
      <p>
        The AdSense module will automatically switch to test mode when running Nuxt in dev mode.
        But you can keep test mode on in production by setting the configuration option test to true.
        <br>
        Test mode uses a test publisher ID,
        so that you will not be violating AdSense TOS.
        <br>
        Note that test advertisements will typically appear as an empty space,
        but will have the correct dimensions (i.e. will occupy the correct space needed by the rendered ad).
      </p>
      <NuxtLink to="/">
        Back to Home
      </NuxtLink>
      <p><strong>The gray area shows the advertisement</strong></p>
    </div>
    <Adsbygoogle />
  </div>
</template>

<style>
ins {
    background: #bbb;
}
</style>
