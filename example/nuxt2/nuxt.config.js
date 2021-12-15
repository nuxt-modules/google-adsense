export default {
  buildModules: [
    '@nuxt/typescript-build',
    ['../../src/index', {
      test: true
    }]
  ]
}
