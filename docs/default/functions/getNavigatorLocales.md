# Function: getNavigatorLocales()

get navigator locales

## Signature

```ts
export function getNavigatorLocales(): readonly Intl.Locale[]
```

## Returns

`readonly Intl.Locale[]` — The array of locales

## Tags

- `@description` — This function is a wrapper that maps in `Intl.Locale` in `navigator.languages`. The value depends on the environment. On the browser, you get the languages set in the browser. On the server side, it works only on a runtime that provides `navigator.languages` (such as Node.js), and you get the languages set in the server.
