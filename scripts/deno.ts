import { promises as fs } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { isExists } from './utils.ts'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const TARGETS = [
  'constants.ts',
  'http.ts',
  'index.ts',
  'locale.ts',
  'shared.ts',
  'shim.d.ts',
  'types.ts',
  'web.ts',
]

async function main() {
  const projectPath = resolve(__dirname, '..')
  const sourcePath = resolve(__dirname, '../src')
  const destPath = resolve(__dirname, '../deno')

  if (!await isExists(destPath)) {
    throw new Error(`not found ${destPath}`)
  }

  console.log('copy some source files to denoland hosting directries 🦕 ...')

  // copy docs
  for (const p of ['README.md', 'LICENSE']) {
    fs.copyFile(resolve(projectPath, p), resolve(destPath, p))
    console.log(`${resolve(projectPath, p)} -> ${resolve(destPath, p)}`)
  }

  // copy source files
  for (const target of TARGETS) {
    fs.copyFile(resolve(sourcePath, target), resolve(destPath, target))
    console.log(`${resolve(sourcePath, target)} -> ${resolve(destPath, target)}`)
  }

  // add `npm:` prefix
  const webCode = await fs.readFile(resolve(destPath, 'web.ts'), 'utf-8')
  const replacedWebCode = webCode.replace('from \'cookie-es\'', 'from \'npm:cookie-es\'')
  await fs.writeFile(resolve(destPath, 'web.ts'), replacedWebCode, 'utf8')

  console.log('... 🦕 done!')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
