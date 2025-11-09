import assert from 'node:assert'
import { exec } from 'node:child_process'
import process from 'node:process'
import test from 'node:test'
import playwright from 'playwright'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

function getText(page, selector, options) {
  return page.locator(selector, options).innerText()
}

test('browser integration test', async () => {
  const controller = new AbortController()
  const { signal } = controller
  const server = exec('pnpm run dev --port 3000', { signal, cwd: import.meta.dirname })

  const cleanup = () => {
    controller.abort()
    server.kill()
  }
  process.on('SIGINT', cleanup)
  process.on('SIGTERM', cleanup)
  process.on('SIGQUIT', cleanup)
  process.on('uncaughtException', cleanup)
  await sleep(2000)

  const browser = await playwright['chromium'].launch({ headless: true })
  const page = await browser.newPage({})
  await page.goto('http://localhost:3000')
  const data = await getText(page, '#is-locale')

  assert(data === `isLocale('en-US'): true`)

  browser.close()
  controller.abort()
  server.kill()
})
