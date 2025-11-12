[**@intlify/utils**](../../index.md)

***

[@intlify/utils](../../index.md) / [h3](../index.md) / tryHeaderLocales

# ~~Function: tryHeaderLocales()~~

```ts
function tryHeaderLocales(event, options): Locale[] | null;
```

try to get locales from header

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `event` | `H3Event` | The H3Event \| H3 event |
| `options` | `HeaderOptions` | The HeaderOptions \| header options object |

## Returns

`Locale`[] \| `null`

The locales that wrapped from header, if you use `accept-language` header and `*` (any language) or empty string is detected, return an empty array. if header are not a well-formed BCP 47 language tag, return `null`.

## Description

wrap language tags with Intl.Locale \| locale, languages tags will be parsed from `accept-language` header as default. Unlike [getHeaderLocales](getHeaderLocales.md), this function does not throw an error if the locale cannot be obtained, this function returns `null`.

## Deprecated

since v2. Use `tryHeaderLocales` of `@intlify/utils` instead.
