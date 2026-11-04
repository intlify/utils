import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  workspaces: {
    '.': {
      // the sources of the entries in package.json exports
      entry: ['src/index.ts', 'src/node.ts'],
      // the coverage provider of `vp test run --coverage`, and vitest is its required peer
      ignoreDependencies: ['@vitest/coverage-v8', 'vitest']
    }
  },
  rules: {
    types: 'off'
  }
}

export default config
