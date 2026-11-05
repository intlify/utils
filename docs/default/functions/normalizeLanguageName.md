# Function: normalizeLanguageName()

normalize the language name

## Signature

```ts
export function normalizeLanguageName(langName: string): string
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| `langName` | `string` | The target language name |

## Returns

`string` — The normalized language tag

## Examples

```ts
const oldLangName = 'en_US'
const langTag = normalizeLanguageName(oldLangName)
console.log(langTag) // en-US
```

## Tags

- `@description` — This function normalizes the locale name defined in [gettext(libc) style](https://www.gnu.org/software/gettext/manual/gettext.html#Locale-Names) to [BCP 47 language tag](https://datatracker.ietf.org/doc/html/rfc4646#section-2.1)
