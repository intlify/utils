import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  rollup: {
    emitCJS: true,
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
    {
      input: './src/web.ts',
    },
  ],
  externals: ['h3'],
})
