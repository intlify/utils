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
The value depends on the environment. On the browser, you get the language set in the browser. On the server side, it works only on a runtime that provides `navigator.language` (such as Node.js), and you get the language set in the server.
