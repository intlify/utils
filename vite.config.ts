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
    entry: ['src/index.ts', 'src/h3.ts', 'src/hono.ts', 'src/node.ts'],
    outDir: 'dist',
    format: ['esm'],
    fixedExtension: false,
    dts: true,
    clean: true,
    deps: {
      // the h3 and hono adapters use the h3 and hono of the user, though they are devDependencies here
      neverBundle: ['h3', 'hono', /^hono\//],
      // cookie-es is bundled on purpose. Fail if any other package of node_modules is bundled
      onlyBundle: ['cookie-es']
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
