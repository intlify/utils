[**@intlify/utils**](../../index.md)

***

[@intlify/utils](../../index.md) / [default](../index.md) / normalizeLanguageName

# Function: normalizeLanguageName()

```ts
function normalizeLanguageName(langName): string;
```

normalize the language name

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `langName` | `string` | The target language name |

## Returns

`string`

The normalized language tag

## Description

This function normalizes the locale name defined in [gettext(libc) style](https://www.gnu.org/software/gettext/manual/gettext.html#Locale-Names) to [BCP 47 language tag](https://datatracker.ietf.org/doc/html/rfc4646#section-2.1)

## Example

```ts
const oldLangName = 'en_US'
const langTag = normalizeLanguageName(oldLangName)
console.log(langTag) // en-US
```
