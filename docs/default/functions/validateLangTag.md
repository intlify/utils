# Function: validateLangTag()

validate the language tag whether is a well-formed [BCP 47 language tag](https://datatracker.ietf.org/doc/html/rfc4646#section-2.1).

## Signature

```ts
export function validateLangTag(lang: string): boolean
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| `lang` | `string` | a language tag |

## Returns

`boolean` — Returns `true` if the language tag is valid, else `false`.
