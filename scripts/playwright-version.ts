import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { readPackageJSON } from 'pkg-types'
import { isExists } from './utils.ts'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

async function main() {
  const playwrightPath = path.resolve(__dirname, '../node_modules/playwright')
  if (!(await isExists(playwrightPath))) {
    throw new Error(`not found '${playwrightPath}'`)
  }

  const playwrightPkg = await readPackageJSON(playwrightPath)
  if (!playwrightPkg.version) {
    throw new Error(`not found 'version' in 'playwright'`)
  }
  console.log(playwrightPkg.version)
}

await main()
