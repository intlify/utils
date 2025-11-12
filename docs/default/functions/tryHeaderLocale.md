[**@intlify/utils**](../../index.md)

***

[@intlify/utils](../../index.md) / [default](../index.md) / tryHeaderLocale

# Function: tryHeaderLocale()

```ts
function tryHeaderLocale(request, options): Locale | null;
```

try to get locale from header

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `request` | `Request` | The Request \| request |
| `options` | `HeaderOptions` & `object` | The HeaderOptions \| header options object |

## Returns

`Locale` \| `null`

The first locale that resolved from header string. if you use `accept-language` header and `*` (any language) or empty string is detected, return `en-US`. if `lang` option or header are not a well-formed BCP 47 language tag, return `null`.

## Description

wrap language tag with Intl.Locale \| locale, languages tags will be parsed from `accept-language` header as default. Unlike [getHeaderLocale](getHeaderLocale.md), this function does not throw an error if the locale cannot be obtained, this function returns `null`.
