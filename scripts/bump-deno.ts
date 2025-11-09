import { applyEdits, modify, parse } from 'jsonc-parser'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { readPackageJSON } from 'pkg-types'
import semver from 'semver'

import type { ParseError } from 'jsonc-parser'

async function main() {
  const npmPath = path.resolve(process.cwd(), 'package.json')
  const npm = await readPackageJSON(npmPath)
  if (npm.version == null) {
    throw new Error('Failed to read package.json: version is not found')
  }

  const denoPath = path.resolve(process.cwd(), 'deno.jsonc')
  const denoConfig = await fs.readFile(denoPath, 'utf8').catch(() => '{}')
  const errors: ParseError[] = []
  const deno = parse(denoConfig, errors, { allowTrailingComma: true }) as { version: string }
  if (errors.length > 0) {
    throw new Error(`Failed to parse deno.jsonc: ${errors.map(e => e.error).join(', ')}`)
  }
  if (deno.version == null) {
    throw new Error('Failed to read deno.jsonc: version is not found')
  }

  if (!semver.gt(npm.version, deno.version)) {
    throw new Error(
      `Failed to bump: npm version (${npm.version}) is not greater than deno version (${deno.version})`
    )
  }

  console.log(`Bump deno version to ${npm.version}`)
  const denoConfigEdit = modify(denoConfig, ['version'], npm.version, {
    formattingOptions: { tabSize: 2, insertSpaces: true }
  })
  const denoConfigModified = applyEdits(denoConfig, denoConfigEdit)
  await fs.writeFile(denoPath, denoConfigModified)
}

await main()
