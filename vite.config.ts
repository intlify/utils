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
      'src/locale.ts',
      // the type-level parser of src/locale.ts hits the instantiation depth limit of
      // TypeScript 7 (tsgolint). `vp test` still type-checks it with the TypeScript of the project
      'src/locale.test-d.ts',
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
    },
    overrides: [
      {
        // type utilities for the type-level parser, without JSDoc
        files: ['src/types.ts'],
        rules: { 'ox-jsdoc/require-jsdoc': 'off' }
      }
    ]
  }),
  fmt: defineFmtConfig({
    printWidth: 100,
    ignorePatterns: ['pnpm-lock.yaml', 'docs/**', 'tsconfig.json', 'CHANGELOG.md']
  })
})
