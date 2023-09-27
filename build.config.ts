import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  replace: {
    'import.meta.vitest': 'false',
  },
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
  },
  entries: [
    {
      input: './src/index.ts',
    },
    {
      input: './src/h3.ts',
    },
    {
      input: './src/node.ts',
    },
  ],
  externals: ['h3'],
})
