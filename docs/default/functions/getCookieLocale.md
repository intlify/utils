[**@intlify/utils**](../../index.md)

***

[@intlify/utils](../../index.md) / [default](../index.md) / getCookieLocale

# Function: getCookieLocale()

```ts
function getCookieLocale(request, options?): Locale;
```

get locale from cookie

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `request` | `Request` | The Request \| request |
| `options` | `CookieLocaleOptions` | The CookieLocaleOptions \| cookie locale options, `lang` option is `en-US` as default, you must specify the language tag with the [BCP 47 syntax](https://datatracker.ietf.org/doc/html/rfc4646#section-2.1). `name` option is `i18n_locale` as default. |

## Returns

`Locale`

The locale that resolved from cookie

## Example

example for Web API request on Cloudflare Workers:

```ts
import { getCookieLocale } from '@intlify/utils'

export default {
  fetch(request: Request) {
    const locale = getCookieLocale(request)
    console.log(locale) // output `Intl.Locale` instance
    // ...
    return new Response(`locale: ${locale.toString()}`)
  }
}
```

## Throws

Throws a `RangeError` if `lang` option or cookie name value are not a well-formed BCP 47 language tag.
