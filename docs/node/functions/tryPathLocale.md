[**@intlify/utils**](../../index.md)

***

[@intlify/utils](../../index.md) / [node](../index.md) / tryPathLocale

# Function: tryPathLocale()

```ts
function tryPathLocale(request, options): Locale | null;
```

try to get the locale from the path

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `request` | `IncomingMessage` | the IncomingMessage \| request |
| `options` | `PathOptions` | the PathOptions \| path options object |

## Returns

`Locale` \| `null`

The locale that resolved from path. if the language in the path, that is not a well-formed BCP 47 language tag, return `null`.

## Description

Unlike [`getPathLocale`](getPathLocale.md), this function does not throw an error if the locale cannot be obtained, this function returns `null`.
