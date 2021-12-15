import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    { input: 'src/index' },
    { input: 'src/templates/', outDir: 'dist/templates', declaration: false }
  ],
  declaration: true
})
