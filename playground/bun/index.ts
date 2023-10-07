import { getHeaderLocale } from '@intlify/utils'

const port = 8124
// @ts-ignore: this is example
Bun.serve({
  port,
  fetch(req: Request) {
    const locale = getHeaderLocale(req)
    return new Response(`detect locale: ${locale.toString()}`)
  },
})
console.log(`server listening on ${port}`)
