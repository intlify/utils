import { defineConfig } from 'vitest/config'
import config from './vitest.config.ts'

export default defineConfig({
  ...config,
  test: {
    ...config.test,
    typecheck: {
      tsconfig: './tsconfig.vitest.json'
    }
  }
})
