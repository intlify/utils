[**@intlify/utils**](../../index.md)

***

[@intlify/utils](../../index.md) / [h3](../index.md) / getCookieLocale

# ~~Function: getCookieLocale()~~

```ts
function getCookieLocale(event, options): Locale;
```

get locale from cookie

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `event` | `H3Event` | The H3Event \| H3 event |
| `options` | `CookieLocaleOptions` | The CookieLocaleOptions \| cookie locale options, `lang` option is `en-US` as default, you must specify the language tag with the [BCP 47 syntax](https://datatracker.ietf.org/doc/html/rfc4646#section-2.1). `name` option is `i18n_locale` as default. |

## Returns

`Locale`

The locale that resolved from cookie

## Example

example for h3:

```ts
import { createApp, eventHandler } from 'h3'
import { getCookieLocale } from '@intlify/utils/h3'

app.use(eventHandler(event) => {
  const locale = getCookieLocale(event)
  console.log(locale) // output `Intl.Locale` instance
  // ...
})
```

## Throws

Throws a `RangeError` if `lang` option or cookie name value are not a well-formed BCP 47 language tag.

## Deprecated

since v2. Use `getCookieLocale` of `@intlify/utils` instead.
