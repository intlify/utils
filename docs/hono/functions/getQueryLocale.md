[**@intlify/utils**](../../index.md)

***

[@intlify/utils](../../index.md) / [hono](../index.md) / getQueryLocale

# ~~Function: getQueryLocale()~~

```ts
function getQueryLocale(context, options): Locale;
```

get the locale from the query

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `context` | `Context` | A Context \| Hono context |
| `options` | `QueryOptions` | The QueryOptions \| query options, `lang` option is `en-US` as default, `name` option is `locale` as default. |

## Returns

`Locale`

The locale that resolved from query

## Throws

Throws the `RangeError` if the language in the query, that is not a well-formed BCP 47 language tag.

## Deprecated

since v2. Use `getQueryLocale` of `@intlify/utils` instead.
