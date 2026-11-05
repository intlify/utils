# Function: getPathLocale()

get the locale from the path

## Signature

```ts
export function getPathLocale(request: IncomingMessage, options: PathOptions = {}): Intl.Locale
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| `request` | `IncomingMessage` | the request |
| `options` | `PathOptions` | the path options object _(optional, default: {})_ |

## Returns

`Intl.Locale` — The locale that resolved from path

## Throws

- `RangeError` — Throws the `RangeError` if the language in the path, that is not a well-formed BCP 47 language tag.
