import { promises as fs } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readPackageJSON, writePackageJSON } from 'pkg-types'
import { isExists } from './utils.ts'
import process from 'node:process'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

type Platform = 'browser' | 'node' | 'deno' | 'bun'

async function replaceNodePlatform(platform: 'browser' | 'node' | 'bun', playgroundPath: string) {
  const utilsPath = resolve(__dirname, '..')
  const utilsPkg = await readPackageJSON(resolve(utilsPath, 'package.json'))
  const utilsTgzPath = resolve(utilsPath, `intlify-utils-${utilsPkg.version}.tgz`)
  if (!await isExists(utilsTgzPath)) {
    return false
  }
  const targetPath = resolve(playgroundPath, platform, 'package.json')
  const platformPkg = await readPackageJSON(targetPath)
  platformPkg.dependencies![`@intlify/utils`] = `file:${utilsTgzPath}`
  await writePackageJSON(targetPath, platformPkg)
  return true
}

async function replaceBrowserPlatform(platform: 'browser', playgroundPath: string) {
  if (!replaceNodePlatform(platform, playgroundPath)) {
    return false
  }
  const codePath = resolve(playgroundPath, platform, 'index.js')
  const code = await fs.readFile(codePath, 'utf-8')
  const replacedCode = code.replace(
    'https://esm.sh/@intlify/utils',
    './node_modules/@intlify/utils/dist/index.mjs',
  )
  await fs.writeFile(codePath, replacedCode, 'utf-8')
  return true
}

async function replaceDenoPlatform(playgroundPath: string) {
  const denoConfigPath = resolve(playgroundPath, 'deno', 'deno.jsonc')
  const denoConfig = JSON.parse(await fs.readFile(denoConfigPath, 'utf-8')) as {
    imports: Record<string, unknown>
  }
  denoConfig['imports']['@intlify/utils'] = '../../dist/index.mjs'

  await fs.writeFile(denoConfigPath, JSON.stringify(denoConfig), 'utf-8')
  return true
}

async function main() {
  const playgroundPath = resolve(__dirname, '../playground')
  for (const platform of (await fs.readdir(playgroundPath)) as Platform[]) {
    if (platform === 'node' || platform === 'bun') {
      if (!await replaceNodePlatform(platform, playgroundPath)) {
        console.error(`cannot replace '@intlify/utils' dependency on ${platform}`)
      }
    } else if (platform === 'deno') {
      if (!await replaceDenoPlatform(playgroundPath)) {
        console.error(`cannot replace '@intlify/utils' dependency on ${platform}`)
      }
    } else if (platform === 'browser') {
      if (!await replaceBrowserPlatform(platform, playgroundPath)) {
        console.error(`cannot replace '@intlify/utils' dependency on ${platform}`)
      }
    } else {
      throw new Error(`no support '${platform}' platform`)
    }
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
