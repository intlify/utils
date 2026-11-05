# Function: toLocale()

returns the locale

## Signature

```ts
export function toLocale(val: string | Intl.Locale): Intl.Locale
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| `val` | `string \| Intl.Locale` | The value for which the 'locale' is requested. |

## Returns

`Intl.Locale` — The locale

## Throws

- `RangeError` — Throws the `RangeError` if `val` is not a well-formed BCP 47 language tag.
