import { getLocale } from '@intlify/utils/web'

const port = 8124
Bun.serve({
  port,
  fetch(req: Request) {
    const locale = getLocale(req)
    return new Response(`detect locale: ${locale.toString()}`)
  },
})
console.log(`server listening on ${port}`)
