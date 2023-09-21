# @intilfy/utils

[![npm version][npm-version-src]][npm-version-href] [![CI][ci-src]][ci-href]

<!--
[![npm
downloads][npm-downloads-src]][npm-downloads-href]
-->

> ⚠️ NOTICE: documentation is under construction 👷

Collection of i18n utilities

## 🌟 Features

✅️ &nbsp;**Modern:** ES Modules first and respect ECMAScript
Internationalization API

✅️ &nbsp;**Compatible:** support CommonJS and various JS environments

✅️️ &nbsp;**Minimal:** Small and fully tree-shakable

✅️️ &nbsp;**Type Strong:** Written in TypeScript, with full JSdoc

## 💿 Installation

### Node.js

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

**Note:** Make sure to recreate lockfile and `node_modules` after reinstall to
avoid hoisting issues.

</details>

### Deno

TODO:

### Bun

TODO:

### Browser

TODO:

## 🚀 Usage

TODO:

## 🔨 Utilities

### Common

- `isLocale`
- `parseAcceptLanguage`
- `validateLanguageTag`

You can do `import { ... } from '@intlify/utils'` the above utilities

### HTTP

- `getAcceptLanguages`
- `getLocale`
- `getCookieLocale`
- `setCookieLocale`

You can do `import { ... } from '@intlify/utils/{ENV}'` the above utilities.

`ENV` is one of the following:

- `node`: Node.js
- `web`: JS environments (Deno and Bun) supporting Web APIs such as
  [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) and
  [Respose](https://developer.mozilla.org/en-US/docs/Web/API/Response)
- `h3`: HTTP framework [h3](https://github.com/unjs/h3)

## 🙌 Contributing guidelines

If you are interested in contributing to `@intlify/utils`, I highly recommend
checking out [the contributing guidelines](/CONTRIBUTING.md) here. You'll find
all the relevant information such as
[how to make a PR](/CONTRIBUTING.md#pull-request-guidelines),
[how to setup development](/CONTRIBUTING.md#development-setup)) etc., there.

## ©️ License

[MIT](http://opensource.org/licenses/MIT)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@intlify/utils?style=flat&colorA=18181B&colorB=FFAD33
[npm-version-href]: https://npmjs.com/package/@intlify/utils
[npm-downloads-src]: https://img.shields.io/npm/dm/@intlify/utils?style=flat&colorA=18181B&colorB=FFAD33
[npm-downloads-href]: https://npmjs.com/package/@intlify/utils
[ci-src]: https://github.com/intlify/utils/actions/workflows/ci.yml/badge.svg
[ci-href]: https://github.com/intlify/utils/actions/workflows/ci.yml
