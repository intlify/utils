[**@intlify/utils**](../../index.md)

***

[@intlify/utils](../../index.md) / [default](../index.md) / getNavigatorLocale

# Function: getNavigatorLocale()

```ts
function getNavigatorLocale(): Locale;
```

get navigator locale

## Returns

`Locale`

The Intl.Locale \| locale

## Description

This function is the `Intl.Locale` wrapper of `navigator.language`.
The value depends on the environments. if you use this function on the browser, you can get the languages, that are set in the browser, else if you use this function on the server side (Deno only), that value is the language set in the server.
