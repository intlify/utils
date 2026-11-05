# Function: createPathIndexLanguageParser()

create a parser, which can split with slash `/`

## Signature

```ts
export function createPathIndexLanguageParser(index = 0): PathLanguageParser
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| `index` | `unknown` | An index of locale, which is included in path _(optional, default: 0)_ |

## Returns

`PathLanguageParser` — A return a parser, which has `PathLanguageParser` interface
