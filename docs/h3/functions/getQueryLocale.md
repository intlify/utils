[**@intlify/utils**](../../index.md)

***

[@intlify/utils](../../index.md) / [h3](../index.md) / getQueryLocale

# Function: getQueryLocale()

```ts
function getQueryLocale(event, options): Locale;
```

get the locale from the query

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `event` | `H3Event` | the H3Event \| H3 event |
| `options` | `QueryOptions` | The QueryOptions \| query options, `lang` option is `en-US` as default, `name` option is `locale` as default. |

## Returns

`Locale`

The locale that resolved from query

## Throws

Throws the `RangeError` if the language in the query, that is not a well-formed BCP 47 language tag.
