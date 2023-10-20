import assert from 'node:assert'
import test from 'node:test'
import { spawn } from 'node:child_process'
import { fetch } from 'ofetch'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

test('node integration test', async () => {
  const child = spawn('npx', ['--no-install', 'tsx', './index.ts'], {
    cwd: process.cwd(),
    stdio: 'inherit',
  })
  await sleep(2000)

  const req = new Request('http://localhost:8123')
  req.headers.set('accept-language', 'en-US,en;q=0.9,ja;q=0.8')
  const res = await fetch(req)
  await sleep(1000)

  assert.deepEqual('detect accpect-language: en-US,en,ja', await res.text())
  child.kill('SIGINT')
})
