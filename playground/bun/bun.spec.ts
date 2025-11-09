import { expect, test } from 'bun:test'

test('bun integration test', async () => {
  const process = Bun.spawn(['bun', 'run', './index.ts'], {
    stdin: 'inherit',
    cwd: import.meta.dir
  })
  await Bun.sleep(1000)

  const req = new Request('http://localhost:8124')
  req.headers.set('accept-language', 'en-US,en;q=0.9,ja;q=0.8')
  const res = await fetch(req)
  await Bun.sleep(1000)

  expect(await res.text()).toBe('detect locale: en-US')
  process.kill()
})
