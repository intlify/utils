[**@intlify/utils**](../../index.md)

***

[@intlify/utils](../../index.md) / [default](../index.md) / tryCookieLocale

# Function: tryCookieLocale()

```ts
function tryCookieLocale(request, options): Locale | null;
```

try to get locale from cookie

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `request` | `Request` | The Request \| request |
| `options` | `CookieLocaleOptions` | The CookieLocaleOptions \| cookie locale options |

## Returns

`Locale` \| `null`

The locale that resolved from cookie. if `lang` option or cookie name value are not a well-formed BCP 47 language tag, return `null`.

## Description

Unlike [`getCookieLocale`](getCookieLocale.md), this function does not throw an error if the locale cannot be obtained, this function returns `null`.
