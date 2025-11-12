[**@intlify/utils**](../../index.md)

***

[@intlify/utils](../../index.md) / [hono](../index.md) / getPathLocale

# ~~Function: getPathLocale()~~

```ts
function getPathLocale(context, options): Locale;
```

get the locale from the path

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `context` | `Context` | A Context \| Hono context |
| `options` | `PathOptions` | the PathOptions \| path options object |

## Returns

`Locale`

The locale that resolved from path

## Throws

Throws the `RangeError` if the language in the path, that is not a well-formed BCP 47 language tag.

## Deprecated

since v2. Use `getPathLocale` of `@intlify/utils` instead.
