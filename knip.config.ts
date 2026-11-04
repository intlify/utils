import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  workspaces: {
    '.': {
      // the coverage provider of `vp test run --coverage`, and vitest is its required peer
      ignoreDependencies: ['@vitest/coverage-v8', 'vitest']
    }
  },
  rules: {
    types: 'off'
  }
}

export default config
