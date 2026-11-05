import { configDefaults, defineConfig } from 'vite-plus'
import {
  defaultIgnoreFilesOfEnforceHeaderCommentRule,
  defineFmtConfig,
  defineLintConfig
} from '@kazupon/vp-config'

export default defineConfig({
  staged: {
    '*': 'vp check --fix'
  },
  pack: {
    entry: ['src/index.ts', 'src/node.ts'],
    outDir: 'dist',
    format: ['esm'],
    fixedExtension: false,
    dts: true,
    clean: true,
    deps: {
      // nothing of node_modules is bundled. cookie-es is a dependency
      onlyBundle: []
    },
    // strip the in-source tests of src/node.ts
    define: {
      'import.meta.vitest': 'undefined'
    }
  },
  test: {
    // Vitest v4 compatibility: preserve mock call history.
    // Remove after tests no longer rely on calls from setup or earlier tests.
    // https://viteplus.dev/guide/vitest-v5#remove-unneeded-compatibility-settings
    // https://vitest.dev/guide/migration/#clearmocks-is-enabled-by-default
    clearMocks: false,
    includeSource: ['src/**/*.{js,ts}'],
    exclude: [...configDefaults.exclude, '**/playground/**'],
    typecheck: {
      enabled: true
    }
  },
  lint: defineLintConfig({
    ignorePatterns: [
      '.notes/**',
      '.plans/**',
      '.vscode',
      'dist',
      'docs/**',
      'tsconfig.json',
      'pnpm-lock.yaml',
      'playground/**',
      'CHANGELOG.md'
    ],
    comments: {
      enForceHeaderComment: {
        ignoreFiles: [
          ...defaultIgnoreFilesOfEnforceHeaderCommentRule,
          'scripts/**',
          'playground/**'
        ]
      }
    },
    jsdoc: {
      typescript: 'syntax'
    },
    regexp: {},
    vitest: {},
    rules: {
      'unicorn/filename-case': 'off',
      'unicorn/no-null': 'off',
      'unicorn/consistent-function-scoping': 'off',
      'unicorn/prefer-string-replace-all': 'off'
    }
  }),
  fmt: defineFmtConfig({
    printWidth: 100,
    ignorePatterns: ['pnpm-lock.yaml', 'docs/**', 'tsconfig.json', 'CHANGELOG.md']
  })
})
