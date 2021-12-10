export default {
  buildModules: [
    '@nuxt/bridge',
    ['../../src/index', {
      test: true
    }]
  ]
}
