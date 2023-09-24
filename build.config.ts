import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  replace: {
    'import.meta.vitest': undefined,
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
    {
      input: './src/web.ts',
    },
  ],
  externals: ['h3'],
  hooks: {
    'rollup:options': (_ctx, options) => {
      // deno-lint-ignore no-explicit-any
      ;(options.plugins as any).push({
        name: 'workaround-strip-in-source-test',
        transform(code: string, _id: string) {
          return {
            code: code.replace(/import.meta.vitest/g, 'false'),
            map: null,
          }
        },
      })
    },
  },
})
