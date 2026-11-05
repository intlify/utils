# Function: tryQueryLocale()

try to get the locale from the query

## Signature

```ts
export function tryQueryLocale(request: IncomingMessage, options: QueryOptions = {}): Intl.Locale | null
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| `request` | `IncomingMessage` | the request |
| `options` | `QueryOptions` | The query options, `lang` option is `en-US` as default, `name` option is `locale` as default. _(optional, default: {})_ |

## Returns

`Intl.Locale | null` — The locale that resolved from query. if the language in the query, that is not a well-formed BCP 47 language tag, return `null`.

## Tags

- `@description` — Unlike [`getQueryLocale`](/docs/node/functions/getQueryLocale.md), this function does not throw an error if the locale cannot be obtained, this function returns `null`.
