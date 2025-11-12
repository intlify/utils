[**@intlify/utils**](../../index.md)

***

[@intlify/utils](../../index.md) / [h3](../index.md) / tryCookieLocale

# Function: tryCookieLocale()

```ts
function tryCookieLocale(event, options): Locale | null;
```

try to get locale from cookie

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `event` | `H3Event` | The H3Event \| H3 event |
| `options` | `CookieLocaleOptions` | The CookieLocaleOptions \| cookie locale options |

## Returns

`Locale` \| `null`

The locale that resolved from cookie. if `lang` option or cookie name value are not a well-formed BCP 47 language tag, return `null`.

## Description

Unlike [`getCookieLocale`](getCookieLocale.md), this function does not throw an error if the locale cannot be obtained, this function returns `null`.
