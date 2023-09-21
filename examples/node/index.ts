import { createServer } from 'node:http'
import { getAcceptLanguages } from '@intlify/utils/node'

const server = createServer((req, res) => {
  const acceptLanguages = getAcceptLanguages(req)

  res.writeHead(200)
  res.end(`detect accpect-language: ${acceptLanguages}`)
})

server.listen(8123)
console.log('server listening on 8123')
