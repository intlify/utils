// @ts-ignore: this is example
import { getHeaderLanguages } from '@intlify/utils'

const port = 8125
Deno.serve({
  port,
}, (req: Request) => {
  const languages = getHeaderLanguages(req)
  return new Response(`detect accpect-language: ${languages}`)
})
console.log(`server listening on ${port}`)
