import { getAcceptLanguages } from 'https://esm.sh/@intlify/utils/web'

const port = 8125
Deno.serve({
  port,
}, (req: Request) => {
  const acceptLanguages = getAcceptLanguages(req)
  return new Response(`detect accpect-language: ${acceptLanguages}`)
})
console.log(`server listening on ${port}`)
