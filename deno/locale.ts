/**
 * NOTE:
 *  This test is work in pregoress ...
 *  We might remove this test file in the future,
 *  when we will find out that cannot support locale validation
 */

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

type OtherExtensions = TupleToUnion<
  Concat<UnionToTuple<OtherExtension['type']>, UnionToTuple<Digits>>
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
  10: 'missing tvalue for tkey',
  11: 'malformed transformed extension',
  12: 'malformed private use extension',
  13: 'There can only be 1 -u- extension',
  14: 'There can only be 1 -t- extension',
  15: 'There can only be 1 -x- extension',
  16: 'Malformed extension type',
  17: 'There can only be 1 -${type}- extension',
  1024: 'Unexpected error',
} as const

/**
 * parse unicode language id
 * https://unicode.org/reports/tr35/#unicode_language_id
 */
export type ParseUnicodeLanguageId<
  Chunks extends string | unknown[],
  ErrorMsg extends Record<number, string> = typeof localeErrors,
  Chars extends unknown[] = Chunks extends string ? Split<Chunks, '-'> : Chunks,
  Lang extends [string, number, unknown[]] = ParseLangSubtag<
    First<Chars>,
    Chars
  >,
  Rest1 extends unknown[] = Lang[2],
  Script extends [string, number, unknown[]] = ParseScriptSubtag<
    First<Rest1>,
    Rest1
  >,
  Rest2 extends unknown[] = Script[2],
  Region extends [string, number, unknown[]] = ParseRegionSubtag<
    First<Rest2>,
    Rest2
  >,
  Rest3 extends unknown[] = Region[2],
  Variants extends [string[], number | never, unknown[]] = ParseVariantsSubtag<
    Rest3
  >,
  Errors extends unknown[] = Filter<[
    ErrorMsg[Lang[1]],
    ErrorMsg[Script[1]],
    ErrorMsg[Region[1]],
    ErrorMsg[Variants[1]],
  ], never>,
  RestChars = Variants[2],
> = [
  {
    lang: Lang[0]
    script: Script[0]
    region: Region[0]
    variants: Variants[0]
  },
  Length<Errors> extends 0 ? never : Errors,
  RestChars,
]

/**
 * parse unicode language subtag
 * https://unicode.org/reports/tr35/#unicode_language_subtag
 */
// deno-fmt-ignore
export type ParseLangSubtag<
  Chunk,
  RestChunks extends unknown[] = [],
  Result extends [string, number, unknown[]] = IsNever<Chunk> extends true
    ? [never, 1, RestChunks] // missing
    : Chunk extends ''
      ? [never, 1, RestChunks] // missing
      : Chunk extends 'root'
        ? ['root', never, RestChunks] // 'root' is special case
        : Chunk extends string
          ? ParseUnicodeLanguageSubtag<Chunk, RestChunks>
          : never // unexpected
> = Result

/**
 * parse unicode language subtag (EBNF: = alpha{2,3} | alpha{5,8};)
 * https://unicode.org/reports/tr35/#unicode_language_subtag
 */
// TODO: Check if the language subtag is in CLDR
// deno-fmt-ignore
export type ParseUnicodeLanguageSubtag<
  Chunk extends string,
  RestChunks extends unknown[] = [],
  Chars extends unknown[] = StringToArray<Chunk>,
> = CheckRange<Chars, [2, 3, 5, 6, 7, 8]> extends true
  ? Includes<ValidCharacters<Chars, Alpha>, false> extends true // check if all chars are alphabets
    ? [never, 2, RestChunks] // malformed
    : [Chunk, never, Shift<RestChunks>]
  : [never, 3, RestChunks] // require characters length

/**
 * parse unicode script subtag
 * https://unicode.org/reports/tr35/#unicode_script_subtag
 */
// deno-fmt-ignore
export type ParseScriptSubtag<
  Chunk,
  RestChunks extends unknown[] = [],
  Result extends [string, number, unknown[]] = IsNever<Chunk> extends true
    ? [never, never, RestChunks] // missing
    : Chunk extends ''
      ? [never, never, RestChunks] // missing
      : Chunk extends string
        ? ParseUnicodeScriptSubtag<Chunk, RestChunks>
        : never // unexpected
> = Result

/**
 * parse unicode script subtag (EBNF: = alpha{4};)
 * https://unicode.org/reports/tr35/#unicode_script_subtag
 */
// TODO: Check if the script subtag is in CLDR
// deno-fmt-ignore
export type ParseUnicodeScriptSubtag<
  Chunk extends string,
  RestChunks extends unknown[] = [],
  Chars extends unknown[] = StringToArray<Chunk>,
> = CheckRange<Chars, [4]> extends true
  ? Includes<ValidCharacters<Chars, Alpha>, false> extends true // check if all chars are alphabets
    ? [never, 4, RestChunks] // malformed
    : [Chunk, never, Shift<RestChunks>]
  : Length<RestChunks> extends 0
    ? [never, 5, RestChunks] // require characters length
    : [never, never, RestChunks] // through

/**
 * parse unicode region subtag
 * https://unicode.org/reports/tr35/#unicode_region_subtag
 */
// deno-fmt-ignore
export type ParseRegionSubtag<
  Chunk,
  RestChunks extends unknown[] = [],
  Result extends [string, number, unknown[]] = IsNever<Chunk> extends true 
    ? [never, never, RestChunks] // missing
    : Chunk extends ''
      ? [never, never, RestChunks] // missing
      : Chunk extends string
        ? ParseUnicodeRegionSubtag<Chunk, RestChunks>
        : never, // unexpected
> = Result

/**
 * parse unicode region subtag (= (alpha{2} | digit{3}) ;)
 * https://unicode.org/reports/tr35/#unicode_region_subtag
 */
// TODO: Check if the region subtag is in CLDR
// deno-fmt-ignore
export type ParseUnicodeRegionSubtag<
  Chunk extends string,
  RestChunks extends unknown[] = [],
  Chars extends unknown[] = StringToArray<Chunk>,
  HasAlphabetsOnly = All<ValidCharacters<Chars, Alpha>, true>,
  HasDigitsOnly = All<ValidCharacters<Chars, Digits>, true>,
> = CheckRange<Chars, [2, 3]> extends true 
  ? Length<Chars> extends 2
    ? HasAlphabetsOnly extends true
      ? [Chunk, never, Shift<RestChunks>]
      : HasDigitsOnly extends true
        ? ThroughErrorWithChunks<RestChunks, [never, 7, RestChunks]> // require characters length
        : ThroughErrorWithChunks<RestChunks, [never, 6, RestChunks]> // malformed
    : Length<Chars> extends 3
      ? HasDigitsOnly extends true
        ? [Chunk, never, Shift<RestChunks>]
        : HasAlphabetsOnly extends true
          ? ThroughErrorWithChunks<RestChunks, [never, 7, RestChunks]> // require characters length
          : ThroughErrorWithChunks<RestChunks, [never, 6, RestChunks]> // malformed
      : [never, 7, RestChunks] // require characters length
  : ThroughErrorWithChunks<RestChunks, [never, 7, RestChunks]> // require characters length

type ThroughErrorWithChunks<Chunks extends unknown[], Result> = Length<Chunks> extends 0 ? Result
  : [never, never, Chunks]

/**
 * parse unicode variant subtag
 * https://unicode.org/reports/tr35/#unicode_variant_subtag
 */
export type ParseVariantsSubtag<
  Chunks extends unknown[],
  Result extends [string[], number | never, unknown[]] = _ParseVariantsSubtag<
    Chunks
  >,
> = Result

// deno-fmt-ignore
type _ParseVariantsSubtag<
  Chunks extends unknown[] = [],
  Accumrator extends [string[], number | never] = [[], never],
  HasVariants = Length<Chunks> extends 0 ? false : true,
  Target = First<Chunks>,
  Variant extends string = HasVariants extends true
    ? Target extends string ? Target : never
    : never,
  VariantSubTag = ParseUnicodeVariantsSubtag<Variant> extends [infer Tag, never] ? Tag : never,
  Rest extends unknown[] = Shift<Chunks>,
  Duplicate = IsNever<Variant> extends false
    ? Includes<Accumrator[0], Variant> extends true ? true : false
    : false,
  VariantStr extends string = VariantSubTag extends string ? VariantSubTag : never,
  RestChunks = IsNever<VariantSubTag> extends true ? Chunks : Rest,
 > = IsNever<Accumrator[1]> extends false
   ? [[...Accumrator[0]], Accumrator[1], RestChunks]
   : Duplicate extends true
     ? [[...Accumrator[0]], 8, RestChunks]
     : IsNever<VariantStr> extends true
       ? [[...Accumrator[0]], never, RestChunks]
       : _ParseVariantsSubtag<Rest, [[...Push<Accumrator[0], VariantStr>], Accumrator[1]]>

/**
 * parse unicode variant subtag (= (alphanum{5,8} | digit alphanum{3}) ;)
 * https://unicode.org/reports/tr35/#unicode_variant_subtag
 */
// deno-fmt-ignore
type ParseUnicodeVariantsSubtag<
  Chunk extends string,
  Chars extends unknown[] = StringToArray<Chunk>,
  FirstChar = First<Chars>,
  RemainChars extends unknown[]= Shift<Chars>,
> = Length<Chars> extends 3
  ? All<ValidCharacters<[FirstChar], Digits>, true> extends true // check digit at first char
    ? All<ValidCharacters<RemainChars, AlphaNumber>, true> extends true// check alphanum at remain chars
      ? [Chunk, never]
      : [never, never] // ignore
    : [never, never] // ignore
  : Length<Chars> extends 4
    ? [never, never] // ignore
    : CheckRange<Chars, [5, 6, 7, 8]> extends true
      ? All<ValidCharacters<Chars, AlphaNumber>, true> extends true// capture alphanum
        ? [Chunk, never]
        : [never, never] // ignore
      : [never, never] // ignore

// TODO:
type ParseUnicodeLocaleId<T extends string> = true

// TODO:
/**
 * parse unicode locale extensions
 * https://unicode.org/reports/tr35/#extensions
 *
 *  = unicode_locale_extensions
 *  | transformed_extensions
 *  | other_extensions ;
 */
type ParseUnicodeExtensions<
  Chunks extends unknown[],
  Extensions extends UnicodeLocaleId['extensions'] = [],
  ResultExtensions extends [Omit<UnicodeLocaleId, 'lang'>, number, unknown[]] =
    _ParseUnicodeExtensions<
      Chunks,
      Extensions
    >,
  Result extends [Omit<UnicodeLocaleId, 'lang'>, number, unknown[]] = Length<Chunks> extends 0
    ? [{ extensions: [] }, never, Chunks]
    : IsNever<ResultExtensions[1]> extends false ? [{ extensions: [] }, ResultExtensions[1], Chunks]
    : [ResultExtensions[0], never, ResultExtensions[2]],
> = Result

// type p1 = ParseUnicodeExtensions<['x', '1234']>

type _ParseUnicodeExtensions<
  Chunks extends unknown[],
  Extensions extends UnicodeLocaleId['extensions'] = [],
  ExistPuExtension extends PuExtension = never,
  ExistOtherExtensions extends unknown[] = [],
  Chunk = First<Chunks>,
  Type extends string = Chunk extends string ? Chunk : never,
  RestChunks extends unknown[] = Shift<Chunks>,
  // UnicodeExtension = Includes<['u', 'U'], Type> extends true,
  //   ? ParseUnicodeExtension<RestChunks>
  //   : never,
  // TransformedExtension = Includes<['t', 'T'], Type> extends true
  //   ? ParseTransformedExtension<RestChunks>
  //   : never,

  // parse for PuExtension
  ResultParsePu extends [PuExtension, number, unknown[]] = _ParseUnicodeExtensionsPu<
    RestChunks,
    Type,
    ExistPuExtension
  >,
  _ExtensionsPu extends UnicodeLocaleId['extensions'] = Push<
    Extensions,
    ResultParsePu[0]
  >, /*[
    ...(ResultParsePu[1] extends number ? Extensions
      : Push<Extensions, ResultParsePu[0]>),
  ],
  */
  // parse for OtherExtension
  /*
  ResultParseOther extends [OtherExtension, number, unknown[]] =
    _ParseUnicodeExtensionsOther<
      [...ResultParsePu[2]], // rest chunks
      Type,
      ExistOtherExtensions
    >,
  _ExtensionsOther extends UnicodeLocaleId['extensions'] =
    ResultParseOther[1] extends number ? [..._ExtensionsPu]
      : [...Push<_ExtensionsPu, ResultParseOther[0]>],
  NextExistOtherExtensions extends unknown[] = ResultParseOther[0] extends
    OtherExtension ? [...Push<ExistOtherExtensions, Type>]
    : [...ExistOtherExtensions],
    */
  // check error
  Error extends number = ResultParsePu[1] extends number ? ResultParsePu[1]
    // : ResultParseOther[1] extends number ? ResultParseOther[1]
    : never,
  // tweak shared chunks for next parsing
  NextChunks extends unknown[] = [...ResultParsePu[2]], // [...ResultParseOther[2]],
  // tweak extensions
  NextExtensions extends UnicodeLocaleId['extensions'] = _ExtensionsPu, // _ExtensionsOther,
  NextExistPuExtension extends PuExtension = ResultParsePu[0],
> = IsNever<Error> extends false ? [never, Error, Chunks]
  : Length<RestChunks> extends 0 ? [{ extensions: Extensions }, never, Chunks]
  : Length<NextChunks> extends 0 ? [{ extensions: NextExtensions }, never, NextChunks]
  : _ParseUnicodeExtensions<
    NextChunks,
    NextExtensions,
    NextExistPuExtension
  > // ResultParsePu[0]
// NextExistOtherExtensions

// type pp1 = _ParseUnicodeExtensions<['x', '1234']>

type _ParseUnicodeExtensionsPu<
  Chunks extends unknown[],
  Type extends string,
  ExistPuExtension extends PuExtension = never,
  ResultParsePuExtension extends unknown[] = CheckExtensionType<Type, ['x', 'X']> extends true
    ? ParsePuExtension<[...Chunks]>
    : never,
  _PuExtension extends PuExtension = ResultParsePuExtension[0] extends PuExtension
    ? ResultParsePuExtension[0]
    : never,
  RestChunks extends unknown[] = ResultParsePuExtension[2] extends unknown[]
    ? ResultParsePuExtension[2]
    : Chunks,
  Error extends number = IsNever<ExistPuExtension> extends false ? 14
    : ResultParsePuExtension[1] extends number ? ResultParsePuExtension[1]
    : never,
  Result extends [PuExtension, number, unknown[]] = [
    IsNever<ExistPuExtension> extends true ? _PuExtension : never,
    Error,
    RestChunks,
  ],
> = Result

// type _pu0 = _ParseUnicodeExtensionsPu<
//   ['1234'],
//   'x'
// >
// type _pu1 = _ParseUnicodeExtensionsPu<
//   ['1234'],
//   'x',
//   { type: 'x'; value: '111' }
// >

type _ParseUnicodeExtensionsOther<
  Chunks extends unknown[],
  Type extends string,
  ExistOtherExtensions extends unknown[] = never,
  MalformedError extends number = Includes<UnionToTuple<OtherExtensions>, Type> extends false ? 16
    : never,
  Error extends number = MalformedError extends number ? MalformedError
    : Includes<ExistOtherExtensions, Type> extends true ? 17
    : never,
  ResultParseOtherExtension extends [string, unknown[]] = IsNever<Error> extends true
    ? ParseOtherExtension<[...Chunks]>
    : [never, Chunks],
  RestChunks extends unknown[] = ResultParseOtherExtension[1] extends unknown[]
    ? ResultParseOtherExtension[1]
    : Chunks,
  Result extends [OtherExtension, number, unknown[]] = [
    ResultParseOtherExtension[0] extends string ? { type: 'a'; value: ResultParseOtherExtension[0] }
      : never,
    Error,
    RestChunks,
  ],
> = Result

// type _ou1 = _ParseUnicodeExtensionsOther<['abc'], 'z'>

type CheckExtensionType<
  Type extends string,
  Ext extends string[],
  Chars extends unknown[] = StringToArray<Type>,
> = Length<Chars> extends 1 ? Includes<Ext, Type> extends true ? true
  : false
  : false

/**
 * parse unicode locale extension
 * https://unicode.org/reports/tr35/#unicode_locale_extensions
 *
 *  = ((sep keyword)+ | (sep attribute)+ (sep keyword)*) ;
 */
// deno-fmt-ignore
export type ParseUnicodeExtension<
  Chunks extends unknown[],
  Sep extends string = '-',
  ResultFirstKeyword extends unknown[] = CollectFirstKeywords<Chunks, Sep>,
  FirstKeywolds extends unknown[] = ResultFirstKeyword[0] extends unknown[] ? ResultFirstKeyword[0] : never,
  FirstRestChunks extends unknown[] = ResultFirstKeyword[1] extends unknown[] ? ResultFirstKeyword[1] : Chunks,
  ResultAttribute extends [unknown[], unknown[]] = ParseAttribute<FirstRestChunks>,
  Attributes extends unknown[] = ResultAttribute[0],
  RestAttributeChunks extends unknown[] = ResultAttribute[1] extends unknown[] ? ResultAttribute[1] : never,
  ResultKeyword extends unknown[] = ParseKeyword<RestAttributeChunks, Sep>,
  _Keywords extends unknown[] = Push<[], ResultKeyword[0]>,
  Keywords extends unknown[] = Push<_Keywords, ResultKeyword[1]>,
  RestChunks extends unknown[] = ResultKeyword[2] extends unknown[] ? ResultKeyword[2] : never,
> = Length<FirstKeywolds> extends 0
  ? IsNever<ResultKeyword[0]> extends false
    ? Length<Keywords> extends 0
      ? Length<Attributes> extends 0
        ? [never, 9] // malformed
        : [{ type: 'u'; keywords: Keywords; attributes: Attributes }, never, RestChunks]
      : [{ type: 'u'; keywords: Keywords; attributes: Attributes }, never, RestChunks]
    : [{ type: 'u'; keywords: []; attributes: Attributes }, never, ResultKeyword[1]]
  : [{ type: 'u'; keywords: FirstKeywolds; attributes: [] }, never, FirstRestChunks]

type t0 = ParseUnicodeExtension<['c']>
type t1 = ParseUnicodeExtension<['co', 'standard']>
type t2 = ParseUnicodeExtension<['foo', 'bar', 'co', 'standard']>

// deno-fmt-ignore
export type CollectFirstKeywords<
  Chunks extends unknown[],
  Sep extends string = '-',
  Keywords extends unknown[] = [],
  ResultKeyword extends unknown[] = ParseKeyword<Chunks, Sep>,
  RestChunks extends unknown[] = ResultKeyword[2] extends unknown[] ? ResultKeyword[2] : never,
  _Keywords1 extends unknown[] = Push<[], ResultKeyword[0]>,
  _Keywords2 extends unknown[] = Push<_Keywords1, ResultKeyword[1]>,
> = Length<Chunks> extends 0
  ? Length<Keywords> extends 0
    ? [never, Chunks]
    : [Keywords, Chunks]
  : IsNever<ResultKeyword[0]> extends true
    ? [Keywords, Chunks]
    : CollectFirstKeywords<RestChunks, Sep, [..._Keywords2]>

// type c0 = CollectFirstKeywords<['c']>
// type c1 = CollectFirstKeywords<['co', 'standard', 'x']>
// type c2 = CollectFirstKeywords<['co', 'standard', 'r111', 'u']>
// type c4 = CollectFirstKeywords<['foo', 'bar', 'co', 'standard']>

/**
 * parse attribute at unicode locale extension generally
 * `attribute` at https://unicode.org/reports/tr35/#Unicode_locale_identifier
 *
 * (= alphanum{3,8} ;)
 */
// deno-fmt-ignore
export type ParseAttribute<
  Chunks extends unknown[],
  Attributes extends unknown[] = [],
  RestChunks extends unknown[] = Shift<Chunks>,
  Chunk extends string = Chunks[0] extends string ? Chunks[0] : never,
  ChunkChars extends unknown[] = StringToArray<Chunk>,
> = Length<Chunks> extends 0
  ? [Attributes, RestChunks]
  : Chunk extends string
    ? CheckRange<ChunkChars, [3, 4, 5, 6, 7, 8]> extends true // check attribute length
      ? All<ValidCharacters<ChunkChars, AlphaNumber>, true> extends true // check attribute characters
        ? ParseAttribute<
          RestChunks,
          [...Push<Attributes, Chunk>]
        >
        : [Attributes, Chunks]
      : [Attributes, Chunks]
    : [Attributes, Chunks]

// type pa1 = ParseAttribute<['foo', 'bar', 'co', 'standard']>
// type pa2 = ParseAttribute<['foo', 'bar']>
// type pa3 = ParseAttribute<['co', 'standard']>
// type pa4 = ParseAttribute<['c']>

/**
 * parse keyword at unicode locale extension generally
 * `keyword` at https://unicode.org/reports/tr35/#Unicode_locale_identifier
 *
 * (= key (sep type)? ;)
 */
// deno-fmt-ignore
export type ParseKeyword<
  Chunks extends unknown[],
  Sep extends string = '-',
  Key = ParseKeywordKey<Chunks>,
  Rest extends unknown[] = Shift<Chunks>,
  ResultValue extends unknown[] = ParseKeywordValue<Rest, Sep>,
> = IsNever<Key> extends true
  ? [never, Chunks]
  : [Key, ResultValue[0], ResultValue[1]]

// type k = ParseKeyword<['']>
// type k0 = ParseKeyword<['c']>
// type k1 = ParseKeyword<['co', 'standard', 'x']>
// type k2 = ParseKeyword<['co', 'standard', 'r111', 'u']>
// type k3 = ParseKeyword<['co', 'standard']>

/**
 * parse keyword key at unicode locale extension generally
 * `key` at https://unicode.org/reports/tr35/#Unicode_locale_identifier
 *
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

// deno-fmt-ignore
type ParseKeywordValue<
  Chunks extends unknown[],
  Sep extends string = '-',
  ResultKeywordType extends [unknown[], unknown[]] = ParseKeywordType<Chunks>,
> = Length<ResultKeywordType[0]> extends 0
  ? ['', ResultKeywordType[1]]
  : [Join<ResultKeywordType[0], Sep>, ResultKeywordType[1]]

/**
 * parse type on keyword at unicode locale extension generally
 * `type` at https://unicode.org/reports/tr35/#Unicode_locale_identifier
 *
 * (= alphanum{3,8} (sep alphanum{3,8})* ;)
 */
// deno-fmt-ignore
type ParseKeywordType<
  Chunks extends unknown[],
  Types extends unknown[] = [],
  Chunk extends string = Chunks[0] extends string ? Chunks[0] : never,
  ChunkChars extends unknown[] = StringToArray<Chunk>,
  ExitReturn = [Types, Chunks],
> = Length<Chunks> extends 0
  ? ExitReturn
  : Chunk extends string
    ? CheckRange<ChunkChars, [3, 4, 5, 6, 7, 8]> extends true // check type length
      ? All<ValidCharacters<ChunkChars, AlphaNumber>, true> extends true // check type characters
        ? ParseKeywordType<Shift<Chunks>, [...Push<Types, Chunk>]>
        : ExitReturn
      : ExitReturn
    : ExitReturn

/**
 * parse transformed extension
 * https://unicode.org/reports/tr35/#transformed_extensions
 *
 * 	= sep [tT] ((sep tlang (sep tfield)*) | (sep tfield)+) ;
 */
// deno-fmt-ignore
export type ParseTransformedExtension<
  Chunks extends unknown[],
  /* Excessive stack depth comparing types ...
  ResultLangId extends [UnicodeLanguageId, number, unknown[]] =
    ParseUnicodeLanguageId<Chunks>,
  */
  ResultLangId extends unknown[] = ParseUnicodeLanguageId<
    Chunks
  >,
  LangParseError extends number = ResultLangId[1] extends number ? ResultLangId[1] : never,
  RestChunks extends unknown[] = ResultLangId[2] extends unknown[]
    ? ResultLangId[2]
    : never,
  ResultFields extends unknown[] = ParseTransformedExtensionFields<RestChunks>,
  Fields extends unknown[] = ResultFields[0] extends unknown[] ? ResultFields[0] : never,
  TransformedParseError = ResultFields[1] extends number ? ResultFields[1] : never,
  NextChunks extends unknown[] = IsNever<LangParseError> extends false
    ? Chunks
    : IsNever<TransformedParseError> extends false
      ? RestChunks
      : ResultFields[2] extends unknown[]
        ? ResultFields[2]
        : Chunks
> = IsNever<LangParseError> extends false
  ? [{ type: 't', lang: ResultLangId[0], fields: ResultFields[0] }, LangParseError, NextChunks]
  : IsNever<TransformedParseError> extends false
    ? [{ type: 't', lang: ResultLangId[0], fields: ResultFields[0] }, TransformedParseError, NextChunks]
    : Length<Fields> extends 0
      ? [never, 11, Chunks] // malformed
      : [{ type: 't', lang: ResultLangId[0], fields: ResultFields[0] }, never, NextChunks]

// type pt1 = ParseTransformedExtension<
//   ['en', 'Kana', 'US', 'jauer', 'h0', 'hybrid']
// >
// type ll1 = ParseUnicodeLanguageId<
//   ['en', 'Kana', 'US', 'jauer', 'h0', 'hybrid']
// >
// type ll2 = ParseTransformedExtensionFields<['h0', 'hybrid']>

/**
 * parse `tfield` at unicode transformed extension
 * https://unicode.org/reports/tr35/#transformed_extensions
 */
// deno-fmt-ignore
type ParseTransformedExtensionFields<
  Chunks extends unknown[],
  Sep extends string = '-',
  Accumrator extends [unknown[], number, unknown[]] = [[], never, []],
  Key extends string = Chunks[0] extends string ? Chunks[0] : never,
  KeyChars extends unknown[] = StringToArray<Key>,
  ResultValue extends [unknown[], unknown[]] = ParseTransformedExtensionFieldsValue<
    Shift<Chunks>
  >,
  FieldsReturn = [Accumrator[0], Accumrator[1], Chunks],
> = Length<Chunks> extends 0
  ? FieldsReturn
  : CheckRange<KeyChars, [2]> extends true // check `tfield` length
    ? All<ValidCharacters<[KeyChars[0]], Alpha>, true> extends true // check `tfield` characters
      ? All<ValidCharacters<[KeyChars[1]], Digits>, true> extends true // check `tfield` characters
        ? Length<ResultValue[0]> extends 0
          ? [never, 10, Chunks] // missing
          : [Push<Accumrator[0], [Key, Join<ResultValue[0], Sep>]>, Accumrator[1], ResultValue[1]]
        : FieldsReturn
      : FieldsReturn
    : FieldsReturn

// type ppt1 = ParseTransformedExtensionFields<
//   ['h0', 'hybrid']
// >
// type ppt2 = ParseTransformedExtensionFields<
//   ['h0']
// >

// deno-fmt-ignore
type ParseTransformedExtensionFieldsValue<
  Chunks extends unknown[],
  Value extends unknown[] = [],
  Chunk extends string = Chunks[0] extends string ? Chunks[0] : never,
  ChunkChars extends unknown[] = StringToArray<Chunk>,
  ExitReturn = [Value, Chunks],
> = Length<Chunks> extends 0
  ? ExitReturn
  : CheckRange<ChunkChars, [3, 4, 5, 6, 7, 8]> extends true // check `tfield` value length
    ? All<ValidCharacters<ChunkChars, AlphaNumber>, true> extends true // check `tfield` value characters
      ? ParseTransformedExtensionFieldsValue<
        Shift<Chunks>,
        [...Push<Value, Chunk>]
      >
      : ExitReturn
    : ExitReturn

/**
 * parse private use extensions
 * https://unicode.org/reports/tr35/#pu_extensions
 *
 * 	= sep [xX] (sep alphanum{1,8})+ ;
 */
// deno-fmt-ignore
export type ParsePuExtension<
  Chunks extends unknown[],
  Sep extends string = '-',
  ResultExts extends [unknown[], unknown[]] = _ParsePuExtension<
    Chunks
  >,
  // NOTE: workaround for `Excessive stack depth comparing types`
  ResultExts0 extends unknown[] = ResultExts[0] extends unknown[] ? ResultExts[0] : never, 
  ResultExts1 extends unknown[] = ResultExts[1] extends unknown[] ? ResultExts[1] : never, 
  Result extends [PuExtension, number, unknown[]] = Length<ResultExts0> extends 0
    ? [never, 12, ResultExts1]
    : [{ type: 'x'; value: Join<ResultExts0, Sep> }, never, ResultExts1],
> = Result

export type _ParsePuExtension<
  Chunks extends unknown[],
  Exts extends unknown[] = [],
  Chunk extends string = Chunks[0] extends string ? Chunks[0] : never,
  ChunkChars extends unknown[] = StringToArray<Chunk>,
  ExitReturn = [Exts, Chunks],
> = Length<Chunks> extends 0 ? ExitReturn
  : CheckRange<ChunkChars, [1, 2, 3, 4, 5, 6, 7, 8]> extends true // check value length
    ? All<ValidCharacters<ChunkChars, AlphaNumber>, true> extends true // check value characters
      ? _ParsePuExtension<
        Shift<Chunks>,
        [...Push<Exts, Chunk>]
      >
    : ExitReturn
  : ExitReturn

/**
 * parse other extension
 * https://unicode.org/reports/tr35/#other_extensions
 *
 *  = sep [alphanum-[tTuUxX]]
 *    (sep alphanum{2,8})+ ;
 */
// deno-fmt-ignore
export type ParseOtherExtension<
  Chunks extends unknown[],
  Sep extends string = '-',
  ResultExts extends [unknown[], unknown[]] = _ParseOtherExtension<
    Chunks
  >,
  Result extends [string, unknown[]] = Length<ResultExts[0]> extends 0
    ? ['', ResultExts[1]]
    : [Join<ResultExts[0], Sep>, ResultExts[1]]
> = Result

// type o1 = ParseOtherExtension<['foo', 'bar', 'co', 'standard']>

type _ParseOtherExtension<
  Chunks extends unknown[],
  Exts extends unknown[] = [],
  Chunk extends string = Chunks[0] extends string ? Chunks[0] : never,
  ChunkChars extends unknown[] = StringToArray<Chunk>,
  ExitReturn = [Exts, Chunks],
> = Length<Chunks> extends 0 ? ExitReturn
  : CheckRange<ChunkChars, [2, 3, 4, 5, 6, 7, 8]> extends true // check value length
    ? All<ValidCharacters<ChunkChars, AlphaNumber>, true> extends true // check value characters
      ? _ParseOtherExtension<
        Shift<Chunks>,
        [...Push<Exts, Chunk>]
      >
    : ExitReturn
  : ExitReturn
