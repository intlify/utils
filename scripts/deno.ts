import fsSync, { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { readPackageJSON } from 'pkg-types'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const TARGETS = [
  'constants.ts',
  'http.ts',
  'index.ts',
  'locale.ts',
  'shared.ts',
  'types.ts',
  'web.ts'
]

async function main() {
  const projectPath = path.resolve(__dirname, '..')
  const sourcePath = path.resolve(__dirname, '../src')
  const destPath = path.resolve(__dirname, '../deno')

  if (!fsSync.existsSync(destPath)) {
    throw new Error(`not found ${destPath}`)
  }

  console.log('copy some source files to denoland hosting directories 🦕 ...')

  // copy docs
  for (const p of ['README.md', 'LICENSE']) {
    await fs.copyFile(path.resolve(projectPath, p), path.resolve(destPath, p))
    console.log(`${path.resolve(projectPath, p)} -> ${path.resolve(destPath, p)}`)
  }

  // copy source files
  for (const target of TARGETS) {
    await fs.copyFile(path.resolve(sourcePath, target), path.resolve(destPath, target))
    console.log(`${path.resolve(sourcePath, target)} -> ${path.resolve(destPath, target)}`)
  }

  const pkgJSON = await readPackageJSON(projectPath)
  const devDependencies = pkgJSON.devDependencies || {}

  // add `npm:` prefix
  const webCode = await fs.readFile(path.resolve(destPath, 'web.ts'), 'utf8')
  const replacedWebCode = webCode.replace(
    "from 'cookie-es'",
    `from 'npm:cookie-es@${devDependencies['cookie-es']}'`
  )
  await fs.writeFile(path.resolve(destPath, 'web.ts'), replacedWebCode, 'utf8')

  console.log('... 🦕 done!')
}

await main()
