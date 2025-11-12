[**@intlify/utils**](../../index.md)

***

[@intlify/utils](../../index.md) / [hono](../index.md) / tryQueryLocale

# ~~Function: tryQueryLocale()~~

```ts
function tryQueryLocale(context, options): Locale | null;
```

try to get the locale from the query

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `context` | `Context` | A Context \| Hono context |
| `options` | `QueryOptions` | The QueryOptions \| query options, `lang` option is `en-US` as default, `name` option is `locale` as default. |

## Returns

`Locale` \| `null`

The locale that resolved from query. if the language in the query, that is not a well-formed BCP 47 language tag, return `null`.

## Description

Unlike [`getQueryLocale`](getQueryLocale.md), this function does not throw an error if the locale cannot be obtained, this function returns `null`.

## Deprecated

since v2. Use `tryQueryLocale` of `@intlify/utils` instead.
