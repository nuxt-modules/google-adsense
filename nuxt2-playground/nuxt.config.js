export default {
  buildModules: [
    '@nuxt/typescript-build',
    ['../../src/module', {
      test: true
    }]
  ]
}
