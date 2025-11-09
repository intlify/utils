import assert from 'node:assert'
import test from 'node:test'
import { createServer } from 'node:http'
import playwright from 'playwright'
import handler from 'serve-handler'
import process from 'node:process'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

function getText(page, selector, options) {
  return page.locator(selector, options).innerText()
}

test('browser integration test', async () => {
  const server = createServer((request, response) => {
    return handler(request, response)
  })
  server.listen(3000, () => {
    console.log('Running at http://localhost:3000')
  })

  const cleanup = () => {
    server.close()
  }
  process.on('SIGINT', cleanup)
  process.on('SIGTERM', cleanup)
  process.on('SIGQUIT', cleanup)
  process.on('uncaughtException', cleanup)
  await sleep(2000)

  const browser = await playwright['chromium'].launch({ headless: true })
  const page = await browser.newPage({})
  await page.goto('http://localhost:3000')
  const data = await getText(page, '#app')

  assert(data === `isLocale('en-US'): true`)

  browser.close()
  server.close()
})
