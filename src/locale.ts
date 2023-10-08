import type {
  All,
  Concat,
  Filter,
  First,
  Includes,
  IsNever,
  Join,
  Length,
  Push,
  Shift,
  Split,
  StringToArray,
  TupleToUnion,
  UnionToTuple,
} from './types.ts'

export interface UnicodeLocaleId {
  lang: UnicodeLanguageId
  extensions: Array<
    UnicodeExtension | TransformedExtension | PuExtension | OtherExtension
  >
}

export type KV = [string, string] | [string]

export interface Extension {
  type: string
}

export interface UnicodeExtension extends Extension {
  type: 'u'
  keywords: KV[]
  attributes: string[]
}

export interface TransformedExtension extends Extension {
  type: 't'
  fields: KV[]
  lang?: UnicodeLanguageId
}
export interface PuExtension extends Extension {
  type: 'x'
  value: string
}

export interface OtherExtension extends Extension {
  type:
    | 'a'
    | 'b'
    | 'c'
    | 'd'
    | 'e'
    | 'f'
    | 'g'
    | 'h'
    | 'i'
    | 'j'
    | 'k'
    | 'l'
    | 'm'
    | 'n'
    | 'o'
    | 'p'
    | 'q'
    | 'r'
    | 's'
    | 'v'
    | 'w'
    | 'y'
    | 'z'
  value: string
}

export interface UnicodeLanguageId {
  lang: string
  script?: string
  region?: string
  variants: string[]
}

type Alphabets =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z'
type Digits = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
type Alpha = TupleToUnion<
  Concat<UnionToTuple<Alphabets>, UnionToTuple<Uppercase<Alphabets>>>
>
type AlphaNumber = TupleToUnion<
  Concat<UnionToTuple<Alpha>, UnionToTuple<Digits>>
>

export type CheckRange<
  T extends unknown[],
  Indexes extends number[],
> = Includes<Indexes, Length<T>> extends true ? true : false

// deno-fmt-ignore
export type ValidCharacters<
  T extends unknown[],
  UnionChars = Alphabets, // default alphabets
  Target = First<T>,
  Rest extends unknown[] = Shift<T>,
> = IsNever<Target> extends false
  ? [Includes<UnionToTuple<UnionChars>, Target>, ...ValidCharacters<Rest, UnionChars>]
  : []

export const localeErrors = /* @__PURE__ */ {
  1: 'missing unicode language subtag',
  2: 'malformed unicode language subtag',
  3: 'requires 2-3 or 5-8 alphabet lower characters',
  4: 'malformed unicode script subtag',
  5: 'unicode script subtag requires 4 alphabet lower characters',
  6: 'malformed unicode region subtag',
  7: 'unicode region subtag requires 2 alphabet lower characters or 3 digits',
  8: 'duplicate unicode variant subtag',
  9: 'malformed unicode extension',
  1024: 'Unexpected error',
} as const

/**
 * parse unicode language id
 * https://unicode.org/reports/tr35/#unicode_language_id
 */
export type ParseUnicodeLanguageId<
  T extends string,
  ErrorMsg extends Record<number, string> = typeof localeErrors,
  S extends unknown[] = Split<T, '-'>,
  Lang extends [string, number] = ParseLangSubtag<First<S>>,
  Rest1 extends unknown[] = Shift<S>,
  Script extends [string, number] = ParseScriptSubtag<First<Rest1>>,
  Rest2 extends unknown[] = Shift<Rest1>,
  Region extends [string, number] = ParseRegionSubtag<First<Rest2>>,
  Rest3 extends unknown[] = Shift<Rest2>,
  Variants extends [string[], number | never] = ParseVariantsSubtag<
    Rest3
  >,
  Errors extends unknown[] = Filter<[
    ErrorMsg[Lang[1]],
    ErrorMsg[Script[1]],
    ErrorMsg[Region[1]],
    ErrorMsg[Variants[1]],
  ], never>,
> = [
  {
    lang: Lang[0]
    script: Script[0]
    region: Region[0]
    variants: Variants[0]
  },
  Length<Errors> extends 0 ? never : Errors,
]

/**
 * parse unicode language subtag
 * https://unicode.org/reports/tr35/#unicode_language_subtag
 */
// deno-fmt-ignore
export type ParseLangSubtag<
  T,
  R extends [string, number] = IsNever<T> extends true
    ? [never, 1] // missing
    : T extends ''
      ? [never, 1] // missing
      : T extends 'root'
        ? ['root', never] // 'root' is special case
        : T extends string
          ? ParseUnicodeLanguageSubtag<T>
          : never // unexpected
> = R

/**
 * parse unicode language subtag (EBNF: = alpha{2,3} | alpha{5,8};)
 * https://unicode.org/reports/tr35/#unicode_language_subtag
 */
// TODO: Check if the language subtag is in CLDR
// deno-fmt-ignore
export type ParseUnicodeLanguageSubtag<
  T extends string,
  Chars extends unknown[] = StringToArray<T>,
> = CheckRange<Chars, [2, 3, 5, 6, 7, 8]> extends true
  ? Includes<ValidCharacters<Chars, Alpha>, false> extends true // check if all chars are alphabets
    ? [never, 2] // malformed
    : [T, never]
  : [never, 3] // require characters length

/**
 * parse unicode script subtag
 * https://unicode.org/reports/tr35/#unicode_script_subtag
 */
// deno-fmt-ignore
export type ParseScriptSubtag<
  T,
  R extends [string, number] = IsNever<T> extends true
    ? [never, never] // missing
    : T extends ''
      ? [never, never] // missing
      : T extends string
        ? ParseUnicodeScriptSubtag<T>
        : never // unexpected
> = R

/**
 * paser unicode script subtag (EBNF: = alpha{4};)
 * https://unicode.org/reports/tr35/#unicode_script_subtag
 */
// TODO: Check if the script subtag is in CLDR
// deno-fmt-ignore
export type ParseUnicodeScriptSubtag<
T extends string,
Chars extends unknown[] = StringToArray<T>,
> = CheckRange<Chars, [4]> extends true
  ? Includes<ValidCharacters<Chars, Alpha>, false> extends true // check if all chars are alphabets
    ? [never, 4] // malformed
    : [T, never]
  : [never, 5] // require characters length

/**
 * parse unicode region subtag
 * https://unicode.org/reports/tr35/#unicode_region_subtag
 */
// deno-fmt-ignore
export type ParseRegionSubtag<
  T,
  R extends [string, number] = IsNever<T> extends true 
    ? [never, never] // missing
    : T extends ''
      ? [never, never] // missing
      : T extends string
        ? ParseUnicodeRegionSubtag<T>
        : never, // unexpected
> = R

/**
 * parse unicode region subtag (= (alpha{2} | digit{3}) ;)
 * https://unicode.org/reports/tr35/#unicode_region_subtag
 */
// TODO: Check if the region subtag is in CLDR
// deno-fmt-ignore
export type ParseUnicodeRegionSubtag<
  T extends string,
  Chars extends unknown[] = StringToArray<T>,
  HasAlphabetsOnly = All<ValidCharacters<Chars, Alpha>, true>,
  HasDigitsOnly = All<ValidCharacters<Chars, Digits>, true>,
> = CheckRange<Chars, [2, 3]> extends true 
  ? Length<Chars> extends 2
    ? HasAlphabetsOnly extends true
      ? [T, never]
      : HasDigitsOnly extends true
        ? [never, 7] // require characters length
        : [never, 6] // malformed
    : Length<Chars> extends 3
      ? HasDigitsOnly extends true
        ? [T, never]
        : HasAlphabetsOnly extends true
          ? [never, 7] // require characters length
          : [never, 6] // malformed
      : [never, 7] // require characters length
  : [never, 7] // require characters length

/**
 * parse unicode variant subtag
 * https://unicode.org/reports/tr35/#unicode_variant_subtag
 */
export type ParseVariantsSubtag<
  T extends unknown[],
  R extends [string[], number | never] = _ParseVariantsSubtag<T>,
> = R

// deno-fmt-ignore
type _ParseVariantsSubtag<
  T extends unknown[] = [],
  Accumrator extends [string[], number | never] = [[], never],
  HasVariants = Length<T> extends 0 ? false : true,
  Target = First<T>,
  Variant extends string = HasVariants extends true
    ? Target extends string ? Target : never
    : never,
  VariantSubTag = ParseUnicodeVariantsSubtag<Variant> extends [infer Tag, never] ? Tag : never,
  Rest extends unknown[] = Shift<T>,
  Duplicate = IsNever<Variant> extends false
    ? Includes<Accumrator[0], Variant> extends true ? true : false
    : false,
  VariantStr extends string = VariantSubTag extends string ? VariantSubTag : never,
 > = IsNever<Accumrator[1]> extends false
   ? [[...Accumrator[0]], Accumrator[1]]
   : Duplicate extends true
     ? [[...Accumrator[0]], 8]
     : IsNever<VariantStr> extends true
       ? [[...Accumrator[0]], never]
       : _ParseVariantsSubtag<Rest, [[...Push<Accumrator[0], VariantStr>], Accumrator[1]]>

/**
 * parse unicode variant subtag (= (alphanum{5,8} | digit alphanum{3}) ;)
 * https://unicode.org/reports/tr35/#unicode_variant_subtag
 */
// deno-fmt-ignore
type ParseUnicodeVariantsSubtag<
  T extends string,
  Chars extends unknown[] = StringToArray<T>,
  FirstChar = First<Chars>,
  RemainChars extends unknown[]= Shift<Chars>,
> = Length<Chars> extends 3
  ? All<ValidCharacters<[FirstChar], Digits>, true> extends true // check digit at first char
    ? All<ValidCharacters<RemainChars, AlphaNumber>, true> extends true// check alphanum at remain chars
      ? [T, never]
      : [never, never] // ignore
    : [never, never] // ignore
  : Length<Chars> extends 4
    ? [never, never] // ignore
    : CheckRange<Chars, [5, 6, 7, 8]> extends true
      ? All<ValidCharacters<Chars, AlphaNumber>, true> extends true// capture alphanum
        ? [T, never]
        : [never, never] // ignore
      : [never, never] // ignore

// TODO:
type ParseUnicodeLocaleId<T extends string> = true

// TODO:
type ParseUnicodeExtensions<T extends string> = true

/**
 * parse unicode extension
 * https://unicode.org/reports/tr35/#unicode_locale_extensions
 *  = ((sep keyword)+
 *    |(sep attribute)+ (sep keyword)*) ;
 */
// deno-fmt-ignore
export type ParseUnicodeExtension<
  Chunks extends unknown[],
  Result extends [unknown[], unknown[]] = ParseAttribute<Chunks>,
  Attributes extends unknown[] = Result[0],
  Keywords extends unknown[] = ParseKeyword<Result[1]>,
> = Length<Keywords> extends 0
  ? Length<Attributes> extends 0
    ? [never, 8]
    : [{ type: 'u'; keywords: Keywords; attributes: Attributes }, never]
  : [{ type: 'u'; keywords: Keywords; attributes: Attributes }, never]

/**
 * parse attribute at unicode locale extension generally
 * `attribute` at https://unicode.org/reports/tr35/#Unicode_locale_identifier
 * (= alphanum{3,8} ;)
 */
// deno-fmt-ignore
export type ParseAttribute<
  Chunks extends unknown[],
  Attributes extends unknown[] = [],
  RemainChunks extends unknown[] = Shift<Chunks>,
  Chunk extends string = Chunks[0] extends string ? Chunks[0] : never,
  ChunkChars extends unknown[] = StringToArray<Chunk>,
> = Length<Chunks> extends 0
  ? [Attributes, RemainChunks]
  : Chunk extends string
    ? CheckRange<ChunkChars, [3, 4, 5, 6, 7, 8]> extends true // check attribute length
      ? All<ValidCharacters<ChunkChars, AlphaNumber>, true> extends true // check attribute characters
        ? ParseAttribute<
          RemainChunks,
          [...Push<Attributes, Chunk>]
        >
        : [Attributes, Chunks]
      : [Attributes, Chunks]
    : [Attributes, Chunks]

/**
 * parse keyword at unicode locale extension generally
 * `keyword` at https://unicode.org/reports/tr35/#Unicode_locale_identifier
 * (= key (sep type)? ;)
 */
export type ParseKeyword<
  Chunks extends unknown[],
  Sep extends string = '-',
  Key = ParseKeywordKey<Chunks>,
  Rest extends unknown[] = Shift<Chunks>,
  Value = ParseKeywordValue<Rest, Sep>,
> = IsNever<Key> extends true ? never
  : [Key, Value]

/**
 * parse keyword key at unicode locale extension generally
 * `key` at https://unicode.org/reports/tr35/#Unicode_locale_identifier
 * (= alphanum alpha ;)
 */
// deno-fmt-ignore
type ParseKeywordKey<
  Chunks extends unknown[],
  _Chunk = First<Chunks>,
  Chunk extends string = _Chunk extends string ? _Chunk : never,
  ChunkChars extends unknown[] = StringToArray<Chunk>,
  Key1 extends string = ChunkChars[0] extends string ? ChunkChars[0] : never,
  Key2 extends string = ChunkChars[1] extends string ? ChunkChars[1] : never,
> = Chunk extends string
  ? Length<ChunkChars> extends 2
    ? All<ValidCharacters<StringToArray<Key1>, AlphaNumber>, true> extends true
      ? All<ValidCharacters<StringToArray<Key2>, Alpha>, true> extends true
        ? Chunk
        : never
      : never
    : never
  : never

type ParseKeywordValue<
  Chunks extends unknown[],
  Sep extends string = '-',
  Types extends unknown[] = ParseKeywordType<Chunks>,
> = Length<Types> extends 0 ? '' : Join<Types, Sep>

/**
 * parse type on keyword at unicode locale extension generally
 * `type` at https://unicode.org/reports/tr35/#Unicode_locale_identifier
 * (= alphanum{3,8} (sep alphanum{3,8})* ;)
 */
// deno-fmt-ignore
type ParseKeywordType<
  Chunks extends unknown[],
  Types extends unknown[] = [],
  Chunk extends string = Chunks[0] extends string ? Chunks[0] : never,
  ChunkChars extends unknown[] = StringToArray<Chunk>,
> = Length<Chunks> extends 0
  ? Types
  : Chunk extends string
    ? CheckRange<ChunkChars, [3, 4, 5, 6, 7, 8]> extends true // check type length
      ? All<ValidCharacters<ChunkChars, AlphaNumber>, true> extends true // check type characters
        ? ParseKeywordType<Shift<Chunks>, [...Push<Types, Chunk>]>
        : Types
      : Types
    : Types

// TODO:
type ParseTransformedExtension<T extends string> = true

// TODO:
type ParsePuExtension<T extends string> = true

// TODO:
type ParseOtherExtension<T extends string> = true
