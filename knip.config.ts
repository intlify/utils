import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  workspaces: {
    '.': {
      ignoreDependencies: ['@vitest/coverage-v8', 'lint-staged']
    }
  },
  rules: {
    types: 'off'
  }
}

export default config
