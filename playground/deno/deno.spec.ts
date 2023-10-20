import { assertEquals } from 'https://deno.land/std@0.204.0/assert/mod.ts'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

Deno.test('deno integration test', async () => {
  const command = new Deno.Command(Deno.execPath(), {
    stdout: 'null',
    args: [
      'run',
      '--allow-net',
      './main.ts',
    ],
  })
  const process = command.spawn()
  await sleep(1000)

  const req = new Request('http://localhost:8125')
  req.headers.set('accept-language', 'en-US,en;q=0.9,ja;q=0.8')
  const res = await fetch(req)
  await sleep(1000)

  assertEquals('detect accpect-language: en-US,en,ja', await res.text())

  process.kill('SIGINT')
  await process.status
})
