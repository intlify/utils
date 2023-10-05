export interface UnicodeLocaleId {
  lang: UnicodeLanguageId
  extensions: Array<
    UnicodeExtension | TransformedExtension | PuExtension | OtherExtension
  >
}

export interface UnicodeLanguageId {
  lang: string
  script?: string
  region?: string
  variants: string[]
}

// -----

type IsNever<T> = [T] extends [never] ? true : false
type Split<S extends string, SEP extends string> = string extends S ? string[]
  : S extends `${infer A}${SEP}${infer B}`
    ? [A, ...(B extends '' ? [] : Split<B, SEP>)]
  : SEP extends '' ? []
  : [S]
type Shift<T extends unknown[]> = T extends [unknown, ...infer U] ? U : never
type First<T extends unknown[]> = T extends [infer A, ...infer rest] ? A : never
type Last<T extends unknown[]> = [unknown, ...T][T['length']]
type Length<T extends readonly unknown[]> = T['length']
type IsEqual<X, Y> = (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false
type All<T extends unknown[], U> = IsEqual<T[number], U> extends true ? true
  : false
type Push<T extends unknown[], U> = [...T, U]
type Includes<Value extends unknown[], Item> = IsEqual<Value[0], Item> extends
  true ? true
  : Value extends [Value[0], ...infer rest] ? Includes<rest, Item>
  : false
type UnionToIntersection<U> = (
  U extends unknown ? (arg: U) => 0 : never
) extends (arg: infer I) => 0 ? I
  : never
type LastInUnion<U> = UnionToIntersection<
  U extends unknown ? (x: U) => 0 : never
> extends (x: infer L) => 0 ? L
  : never
type UnionToTuple<U, Last = LastInUnion<U>> = [U] extends [never] ? []
  : [...UnionToTuple<Exclude<U, Last>>, Last]
type StrintToUnion<T extends string> = T extends `${infer Letter}${infer Rest}`
  ? Letter | StrintToUnion<Rest>
  : never

export type StringToArray<T extends string> = T extends
  `${infer Letter}${infer Rest}` ? [Letter, ...StringToArray<Rest>] : []

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

type ParseUnicodeLanguageId<
  T extends string,
  S extends unknown[] = Split<T, '-'>,
  Lang extends unknown[] = ParseLangSubtag<First<S>>,
  Rest1 extends unknown[] = Shift<S>,
  Script extends unknown[] = ParseScriptSubtag<First<Rest1>>,
  Rest2 extends unknown[] = Shift<Rest1>,
  Region extends unknown[] = ParseRegionSubtag<First<Rest2>>,
  Rest3 extends unknown[] = Shift<Rest2>,
  Variants extends { variants: string[]; error?: string } = ParseVariantsSubtag<
    Rest3
  >,
> = [
  {
    lang: First<Lang>
    script: First<Script>
    region: First<Region>
    variants: Variants['variants']
  },
  Last<Lang>,
]

export const localeErrors = /* @__PURE__ */ {
  1: 'missing unicode language subtag',
  2: 'malformed unicode language subtag',
  3: 'requires 2-3 or 5-8 alphabet lower characters',
  4: 'malformed unicode script subtag',
  5: 'unicode script subtag requires 4 alphabet lower characters',
  6: 'malformed unicode region subtag',
  7: 'unicode region subtag requires 2 alphabet lower characters or 3 digits',
  1024: 'Unexpected error',
} as const

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
  ? Includes<ValidCharacters<Chars, Alphabets>, false> extends true // check if all chars are alphabets
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
> =R

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
  ? Includes<ValidCharacters<Chars, Alphabets>, false> extends true // check if all chars are alphabets
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

type val = StringToArray<'12'>
type t1 = All<ValidCharacters<val, Alphabets>, true>
type t2 = All<ValidCharacters<val, Digits>, true>
type t3 = All<ValidCharacters<val, Alphabets | Digits>, true>

/**
 * parse unicode region subtag (= (alpha{2} | digit{3}) ;)
 * https://unicode.org/reports/tr35/#unicode_region_subtag
 */
// TODO: Check if the region subtag is in CLDR
// deno-fmt-ignore
export type ParseUnicodeRegionSubtag<
  T extends string,
  Chars extends unknown[] = StringToArray<T>,
  HasAlphabetsOnly = All<ValidCharacters<Chars, Alphabets>, true>,
  HasDigitsOnly = All<ValidCharacters<Chars, Digits>, true>,
  HasBoth = All<ValidCharacters<Chars, Alphabets | Digits>, true>,
> = CheckRange<Chars, [2, 3]> extends true 
  ? Length<Chars> extends 2
    ? HasAlphabetsOnly extends true
      ? [T, never]
      : HasDigitsOnly extends true
        ? [never, 7]
        : [never, 6] // malformed
    : Length<Chars> extends 3
      ? Includes<ValidCharacters<Chars, Digits>, false> extends true
        ? [never, 6] // malformed
        : [T, never]
      : Includes<ValidCharacters<Chars, Alphabets>, false> extends true
        ? [never, 7] // malformed
        : [T, never]
  : [never, 7] // require characters length

export type _ParseUnicodeRegionSubtag<
  T extends string,
  Chars extends unknown[] = StringToArray<T>,
> = CheckRange<Chars, [2]> extends true
  ? Includes<ValidCharacters<Chars, Alphabets>, false> extends true // check if all chars are alphabets
    ? [never, 6] // malformed
  : [T, never]
  : CheckRange<Chars, [3]> extends true
    ? Includes<ValidCharacters<Chars, Digits>, false> extends true // check if all chars are digits
      ? [never, 6] // malformed
    : [T, never]
  : [never, 7]

type ParseVariantsSubtag<
  T extends unknown[],
  S extends { variants: string[]; error?: string } = _ParseVariantsSubtag<T>,
> = S

type _ParseVariantsSubtag<
  T extends unknown[] = [],
  Accumrator extends { variants: string[]; error?: string } = { variants: [] },
  HasVariants = Length<T> extends 0 ? false : true,
  Target = First<T>,
  HasVariantSubTag = HasVariants extends true ? IsUnicodeVariantSubtag<Target>
    : false,
  Rest extends unknown[] = Shift<T>,
  Variant = HasVariants extends true
    ? HasVariantSubTag extends true ? Target : never
    : never,
  Duplicate = IsNever<Variant> extends false
    ? Includes<Accumrator['variants'], Variant> extends true ? true
    : false
    : false,
  VariantStr extends string = Variant extends string ? Variant : never,
> = Accumrator['error'] extends string ? {
    variants: [...Accumrator['variants']]
    error: Accumrator['error']
  }
  : Duplicate extends true ? {
      variants: [...Accumrator['variants']]
      error: `Duplicate variant "${VariantStr}"`
    }
  : IsNever<VariantStr> extends true ? { variants: [...Accumrator['variants']] }
  : _ParseVariantsSubtag<
    Rest,
    { variants: Push<Accumrator['variants'], VariantStr> }
  >

type IsUnicodeVariantSubtag<T> = true
type _S = _ParseVariantsSubtag<['a', 'b', 'b', 'c']>

type UnicodeLangId = ParseUnicodeLanguageId<'ja-Kana-jp-t-it-latn-it'>
type id2 = ParseUnicodeLanguageId<''>

// -----

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
