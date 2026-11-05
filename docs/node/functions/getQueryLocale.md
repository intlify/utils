# Function: getQueryLocale()

get the locale from the query

## Signature

```ts
export function getQueryLocale(request: IncomingMessage, options: QueryOptions = {}): Intl.Locale
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| `request` | `IncomingMessage` | the request |
| `options` | `QueryOptions` | The query options, `lang` option is `en-US` as default, `name` option is `locale` as default. _(optional, default: {})_ |

## Returns

`Intl.Locale` — The locale that resolved from query

## Throws

- `RangeError` — Throws the `RangeError` if the language in the query, that is not a well-formed BCP 47 language tag.
