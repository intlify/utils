[**@intlify/utils**](../../index.md)

***

[@intlify/utils](../../index.md) / [node](../index.md) / getPathLocale

# Function: getPathLocale()

```ts
function getPathLocale(request, options): Locale;
```

get the locale from the path

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `request` | `IncomingMessage` | the IncomingMessage \| request |
| `options` | `PathOptions` | the PathOptions \| path options object |

## Returns

`Locale`

The locale that resolved from path

## Throws

Throws the `RangeError` if the language in the path, that is not a well-formed BCP 47 language tag.
