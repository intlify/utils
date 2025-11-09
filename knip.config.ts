import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  workspaces: {
    '.': {
      entry: ['scripts/deno.ts'],
      ignoreFiles: ['deno/**'],
      ignoreDependencies: ['@vitest/coverage-v8', 'lint-staged', 'deno', 'miniflare']
    }
  },
  rules: {
    types: 'off'
  },
  ignoreWorkspaces: ['playground/deno']
}

export default config
