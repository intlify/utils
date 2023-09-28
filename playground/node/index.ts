import { createServer } from 'node:http'
import { getHeaderLanguages } from '@intlify/utils/node'

const server = createServer((req, res) => {
  const languages = getHeaderLanguages(req)

  res.writeHead(200)
  res.end(`detect accpect-language: ${languages}`)
})

server.listen(8123)
console.log('server listening on 8123')
