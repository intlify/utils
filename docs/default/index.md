[**@intlify/utils**](../index.md)

***

[@intlify/utils](../index.md) / default

# default

`@intlify/utils` default module entry.

`@inlityf/utils` will export javascript runtime agnostic utility functions and types.

## Example

```ts
import { parseAcceptLanguage, isLocale, getHeaderLocale } from '@intlify/utils'
```

## Functions

| Function | Description |
| ------ | ------ |
| [createPathIndexLanguageParser](functions/createPathIndexLanguageParser.md) | create a parser, which can split with slash `/` |
| [getCookieLocale](functions/getCookieLocale.md) | get locale from cookie |
| [getHeaderLanguage](functions/getHeaderLanguage.md) | get language from header |
| [getHeaderLanguages](functions/getHeaderLanguages.md) | get languages from header |
| [getHeaderLocale](functions/getHeaderLocale.md) | get locale from header |
| [getHeaderLocales](functions/getHeaderLocales.md) | get locales from header |
| [getNavigatorLocale](functions/getNavigatorLocale.md) | get navigator locale |
| [getNavigatorLocales](functions/getNavigatorLocales.md) | get navigator locales |
| [getPathLocale](functions/getPathLocale.md) | get the locale from the path |
| [getQueryLocale](functions/getQueryLocale.md) | get the locale from the query |
| [isLocale](functions/isLocale.md) | check whether the value is a `Intl.Locale` instance |
| [normalizeLanguageName](functions/normalizeLanguageName.md) | normalize the language name |
| [parseAcceptLanguage](functions/parseAcceptLanguage.md) | parse `accept-language` header string |
| [registerPathLanguageParser](functions/registerPathLanguageParser.md) | register the path language parser |
| [setCookieLocale](functions/setCookieLocale.md) | set locale to the response `Set-Cookie` header. |
| [tryCookieLocale](functions/tryCookieLocale.md) | try to get locale from cookie |
| [tryHeaderLocale](functions/tryHeaderLocale.md) | try to get locale from header |
| [tryHeaderLocales](functions/tryHeaderLocales.md) | try to get locales from header |
| [tryPathLocale](functions/tryPathLocale.md) | try to get the locale from the path |
| [tryQueryLocale](functions/tryQueryLocale.md) | try to get the locale from the query |
| [validateLangTag](functions/validateLangTag.md) | validate the language tag whether is a well-formed [BCP 47 language tag](https://datatracker.ietf.org/doc/html/rfc4646#section-2.1). |
