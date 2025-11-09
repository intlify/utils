import { getHeaderLanguages } from '@intlify/utils'; // module is mapped by `deno.jsonc`
// import { getHeaderLanguages } from 'https://deno.land/x/intlify_utils/mod.ts'

const port = 8125
Deno.serve({
  port,
}, (req: Request) => {
  const languages = getHeaderLanguages(req)
  return new Response(`detect accpect-language: ${languages}`)
})
console.log(`server listening on ${port}`)
