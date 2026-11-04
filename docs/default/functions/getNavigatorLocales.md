[**@intlify/utils**](../../index.md)

***

[@intlify/utils](../../index.md) / [default](../index.md) / getNavigatorLocales

# Function: getNavigatorLocales()

```ts
function getNavigatorLocales(): readonly Locale[];
```

get navigator locales

## Returns

readonly `Locale`[]

The array of Intl.Locale \| locales

## Description

This function is a wrapper that maps in `Intl.Locale` in `navigator.languages`.
The value depends on the environment. On the browser, you get the languages set in the browser. On the server side, it works only on a runtime that provides `navigator.languages` (such as Node.js), and you get the languages set in the server.
