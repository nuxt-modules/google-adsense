export default {
  components: true,
  buildModules: [
    '@nuxt/typescript-build',
    ['../../src/index', {
      test: true
    }]
  ]
}
