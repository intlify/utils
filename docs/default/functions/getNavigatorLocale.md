# Function: getNavigatorLocale()

get navigator locale

## Signature

```ts
export function getNavigatorLocale(): Intl.Locale
```

## Returns

`Intl.Locale` — The locale

## Tags

- `@description` — This function is the `Intl.Locale` wrapper of `navigator.language`. The value depends on the environment. On the browser, you get the language set in the browser. On the server side, it works only on a runtime that provides `navigator.language` (such as Node.js), and you get the language set in the server.
