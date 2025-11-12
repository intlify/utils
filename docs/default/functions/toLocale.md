[**@intlify/utils**](../../index.md)

***

[@intlify/utils](../../index.md) / [default](../index.md) / toLocale

# Function: toLocale()

```ts
function toLocale(val): Locale;
```

returns the Intl.Locale \| locale

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `val` | `string` \| `Locale` | The value for which the 'locale' is requested. |

## Returns

`Locale`

The locale

## Throws

Throws the `RangeError` if `val` is not a well-formed BCP 47 language tag.
