[**@intlify/utils**](../../index.md)

***

[@intlify/utils](../../index.md) / [default](../index.md) / getQueryLocale

# Function: getQueryLocale()

```ts
function getQueryLocale(request, options): Locale;
```

get the locale from the query

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `request` | `Request` | the Request \| request |
| `options` | `QueryOptions` | The QueryOptions \| query options, `lang` option is `en-US` as default, `name` option is `locale` as default. |

## Returns

`Locale`

The locale that resolved from query

## Throws

Throws the `RangeError` if the language in the query, that is not a well-formed BCP 47 language tag.
