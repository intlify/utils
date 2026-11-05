# Function: getCookieLocale()

get locale from cookie

## Signature

```ts
export function getCookieLocale(request: Request, options: CookieLocaleOptions = {}): Intl.Locale
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| `request` | `Request` | The request |
| `options` | `CookieLocaleOptions` | The cookie locale options, `lang` option is `en-US` as default, you must specify the language tag with the [BCP 47 syntax](https://datatracker.ietf.org/doc/html/rfc4646#section-2.1). `name` option is `i18n_locale` as default. _(optional, default: {})_ |

## Returns

`Intl.Locale` — The locale that resolved from cookie

## Throws

- `RangeError` — Throws a `RangeError` if `lang` option or cookie name value are not a well-formed BCP 47 language tag.

## Examples

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
