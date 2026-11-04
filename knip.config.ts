import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  workspaces: {
    '.': {
      ignoreDependencies: ['lint-staged']
    }
  },
  rules: {
    types: 'off'
  }
}

export default config
