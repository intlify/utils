# default

`@intlify/utils` default module entry.

`@intlify/utils` will export javascript runtime agnostic utility functions and types.

## Example

```ts
import { parseAcceptLanguage, isLocale, getHeaderLocale } from '@intlify/utils'
```

## Functions

| Function | Description |
| ------ | ------ |
| [createPathIndexLanguageParser](/docs/default/functions/createPathIndexLanguageParser.md) | create a parser, which can split with slash `/` |
| [getCookieLocale](/docs/default/functions/getCookieLocale.md) | get locale from cookie |
| [getHeaderLanguage](/docs/default/functions/getHeaderLanguage.md) | get language from header |
| [getHeaderLanguages](/docs/default/functions/getHeaderLanguages.md) | get languages from header |
| [getHeaderLocale](/docs/default/functions/getHeaderLocale.md) | get locale from header |
| [getHeaderLocales](/docs/default/functions/getHeaderLocales.md) | get locales from header |
| [getNavigatorLocale](/docs/default/functions/getNavigatorLocale.md) | get navigator locale |
| [getNavigatorLocales](/docs/default/functions/getNavigatorLocales.md) | get navigator locales |
| [getPathLocale](/docs/default/functions/getPathLocale.md) | get the locale from the path |
| [getQueryLocale](/docs/default/functions/getQueryLocale.md) | get the locale from the query |
| [isLocale](/docs/default/functions/isLocale.md) | check whether the value is a `Intl.Locale` instance |
| [normalizeLanguageName](/docs/default/functions/normalizeLanguageName.md) | normalize the language name |
| [parseAcceptLanguage](/docs/default/functions/parseAcceptLanguage.md) | parse `accept-language` header string |
| [registerPathLanguageParser](/docs/default/functions/registerPathLanguageParser.md) | register the path language parser |
| [setCookieLocale](/docs/default/functions/setCookieLocale.md) | set locale to the response `Set-Cookie` header. |
| [toLocale](/docs/default/functions/toLocale.md) | returns the locale |
| [tryCookieLocale](/docs/default/functions/tryCookieLocale.md) | try to get locale from cookie |
| [tryHeaderLocale](/docs/default/functions/tryHeaderLocale.md) | try to get locale from header |
| [tryHeaderLocales](/docs/default/functions/tryHeaderLocales.md) | try to get locales from header |
| [tryPathLocale](/docs/default/functions/tryPathLocale.md) | try to get the locale from the path |
| [tryQueryLocale](/docs/default/functions/tryQueryLocale.md) | try to get the locale from the query |
| [validateLangTag](/docs/default/functions/validateLangTag.md) | validate the language tag whether is a well-formed [BCP 47 language tag](https://datatracker.ietf.org/doc/html/rfc4646#section-2.1). |

