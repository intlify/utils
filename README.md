# @intilfy/utils

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![CI][ci-src]][ci-href]

Collection of i18n utilities

## 🌟 Features

✅️ &nbsp;**Modern:** ES Modules first and respect Web Standard and ECMAScript
Internationalization APIs

✅️ &nbsp;**Compatible:** support CommonJS and various JS environments

✅️️ &nbsp;**Minimal:** Small and fully tree-shakable

✅️️ &nbsp;**Type Strong:** Written in TypeScript, with full JSdoc

## 💿 Installation

### 🐢 Node.js

```sh
# Using npm
npm install @intlify/utils

# Using yarn
yarn add @intlify/utils

# Using pnpm
pnpm add @intlify/utils
```

<details>
  <summary>Using Edge Releases</summary>

If you are directly using `@intlify/utils` as a dependency:

```json
{
  "dependencies": {
    "@intlify/utils": "npm:@intlify/utils-edge@latest"
  }
}
```

**Note:** Make sure to recreate lockfile and `node_modules` after reinstall to avoid hoisting issues.

</details>

### 🦕 Deno

You can install via `import`.

in your code:

```ts
/**
 * you can install via other CDN URL such as skypack,
 * or, you can also use import maps
 * https://docs.deno.com/runtime/manual/basics/import_maps
 */
import { ... } from 'https://deno.land/x/intlify_utils/mod.ts'

// something todo
// ...
```

### 🥟 Bun

```sh
bun install @intlify/utils
```

### 🌍 Browser

in your HTML:

```html
<script type="module">
/**
 * you can install via other CDN URL such as skypack,
 * or, you can also use import maps
 */
import { isLocale } from 'https://esm.sh/@intlify/utils'

// something todo
// ...
</script>
```

<details>
  <summary>Using Edge Releases</summary>

```ts
import { isLocale } from 'https://esm.sh/@intlify/utils-edge'

// something todo
// ...
```

</details>

## 🍭 Playground

You can play the below examples:

- 🐢 [Node.js](https://github.com/intlify/utils/tree/main/examples/node):
  `npm run play:node`
- 🦕 [Deno](https://github.com/intlify/utils/tree/main/examples/deno):
  `npm run play:deno`
- 🥟 [Bun](https://github.com/intlify/utils/tree/main/examples/bun):
  `npm run play:bun`
- 🌍 [Browser](https://github.com/intlify/utils/tree/main/examples/browser):
  `npm run play:browser`

## 🔨 Utilities

### Common

- `isLocale`
- `toLocale`
- `parseAcceptLanguage`
- `validateLangTag`
- `normalizeLanguageName`

You can do `import { ... } from '@intlify/utils'` the above utilities

### Navigator

- `getNavigatorLocales`
- `getNavigatorLocale`

You can do `import { ... } from '@intlify/utils'` the above utilities

> ⚠NOTE: for Node.js You need to do `import { ... } from '@intlify/utils/node'`

### HTTP

- `getHeaderLanguages`
- `getHeaderLanguage`
- `getHeaderLocales`
- `getHeaderLocale`
- `getCookieLocale`
- `setCookieLocale`
- `getPathLocale`
- `getQueryLocale`
- `tryHeaderLocales`
- `tryHeaderLocale`
- `tryCookieLocale`
- `tryPathLocale`
- `tryQueryLocale`

The about utilies functions accpet Web APIs such as [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) and [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) that is supported by JS environments (such as Deno, Bun, and Browser)

#### Specialized environments

If you will use Node.js and H3, You can do `import { ... } from '@intlify/utils/{ENV}'` the above utilities.

The namespace `{ENV}` is one of the following:

- `node`: accpet `IncomingMessage` and `Outgoing` by Node.js [http](https://nodejs.org/api/http.html) module
- `h3`: accept `H3Event` by HTTP framework [h3](https://github.com/unjs/h3)
- `hono`: accept `Context` by edge-side web framework [hono](https://github.com/honojs/hono)

## 🙌 Contributing guidelines

If you are interested in contributing to `@intlify/utils`, I highly recommend checking out [the contributing guidelines](/CONTRIBUTING.md) here. You'll find all the relevant information such as [how to make a PR](/CONTRIBUTING.md#pull-request-guidelines), [how to setup development](/CONTRIBUTING.md#development-setup)) etc., there.

## ©️ License

[MIT](http://opensource.org/licenses/MIT)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@intlify/utils?style=flat&colorA=18181B&colorB=FFAD33
[npm-version-href]: https://npmjs.com/package/@intlify/utils
[npm-downloads-src]: https://img.shields.io/npm/dm/@intlify/utils?style=flat&colorA=18181B&colorB=FFAD33
[npm-downloads-href]: https://npmjs.com/package/@intlify/utils
[ci-src]: https://github.com/intlify/utils/actions/workflows/ci.yml/badge.svg
[ci-href]: https://github.com/intlify/utils/actions/workflows/ci.yml
