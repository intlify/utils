# @intilfy/utils

[![npm version][npm-version-src]][npm-version-href] [![npm downloads][npm-downloads-src]][npm-downloads-href] [![CI][ci-src]][ci-href]

Collection of i18n utilities

## 🌟 Features

✅️ &nbsp;**Modern:** ES Modules first and respect Web Standard and ECMAScript Internationalization APIs

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

### 🦕 Deno

> **Note:** Deno is no longer supported, and `@intlify/utils` is not published to [JSR](https://jsr.io/@intlify/utils) after 1.1.0. On Deno, you can still import the npm package with `npm:@intlify/utils`, but it is not tested.

### 🥟 Bun

```sh
bun add @intlify/utils
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

## 🍭 Playground

You can play the below examples:

- 🐢 [Node.js](https://github.com/intlify/utils/tree/main/examples/node): `npm run play:node`
- 🥟 [Bun](https://github.com/intlify/utils/tree/main/examples/bun): `npm run play:bun`
- 🌍 [Browser](https://github.com/intlify/utils/tree/main/examples/browser): `npm run play:browser`

## 🤝 API

See the [API docs](./docs/index.md)

## 🙌 Contributing guidelines

If you are interested in contributing to `@intlify/utils`, I highly recommend checking out [the contributing guidelines](/CONTRIBUTING.md) here. You'll find all the relevant information such as [how to make a PR](/CONTRIBUTING.md#pull-request-guidelines), [how to setup development](/CONTRIBUTING.md#development-setup)) etc., there.

## 🤝 Sponsors

The development of `@intlify/utils` is supported by my OSS sponsors!

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/kazupon/sponsors/sponsors.svg">
    <img alt="sponsor" src='https://cdn.jsdelivr.net/gh/kazupon/sponsors/sponsors.svg'/>
  </a>
</p>

## ©️ License

[MIT](http://opensource.org/licenses/MIT)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@intlify/utils?style=flat&colorA=18181B&colorB=FFAD33
[npm-version-href]: https://npmjs.com/package/@intlify/utils
[npm-downloads-src]: https://img.shields.io/npm/dm/@intlify/utils?style=flat&colorA=18181B&colorB=FFAD33
[npm-downloads-href]: https://npmjs.com/package/@intlify/utils
[ci-src]: https://github.com/intlify/utils/actions/workflows/ci.yml/badge.svg
[ci-href]: https://github.com/intlify/utils/actions/workflows/ci.yml
