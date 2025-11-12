[**@intlify/utils**](../../index.md)

***

[@intlify/utils](../../index.md) / [h3](../index.md) / getPathLocale

# ~~Function: getPathLocale()~~

```ts
function getPathLocale(event, options): Locale;
```

get the locale from the path

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `event` | `H3Event` | the H3Event \| H3 event |
| `options` | `PathOptions` | the PathOptions \| path options object |

## Returns

`Locale`

The locale that resolved from path

## Throws

Throws the `RangeError` if the language in the path, that is not a well-formed BCP 47 language tag.

## Deprecated

since v2. Use `getPathLocale` of `@intlify/utils` instead.
