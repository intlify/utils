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
This function return values depends on the environments. if you use this function on the browser, you can get the languages, that are set in the browser, else if you use this function on the server side (Deno only), that value is the languages set in the server.
