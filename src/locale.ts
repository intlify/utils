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
type StringToTuple<T extends string> = UnionToTuple<StrintToUnion<T>>

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
  | 'v'
  | 'w'
  | 'y'
  | 'z'

type Numbers = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'

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

type ParseLangSubtag<
  T,
  L = T extends string ? IsUnicodeLanguageSubtag<T> extends true ? [T, never]
    : [never, 'Missing unicode language subtag']
    : T extends 'root' ? ['root', never]
    : [never, 'Malformed unicode language subtag'],
> = L

type IsUnicodeLanguageSubtag<T> = true

/**
 * Range of Unicode language subtag (EBNF: = alpha{2,3} | alpha{5,8};)
 * https://unicode.org/reports/tr35/#unicode_language_subtag
 */
export type LangSubtagRange<
  T extends unknown[],
> = Includes<[2, 3, 5, 6, 7, 8], Length<T>> extends true ? true : false

type _IsUnicodeLanguageSubtag<
  T extends string,
  Chars extends unknown[] = StringToTuple<T>,
> = Length<Chars> extends 2 ? true : false

type ParseScriptSubtag<
  T,
  S = T extends string ? IsUnicodeScriptSubtag<T> extends true ? [T, never]
    : [never, 'error']
    : [never, 'error'],
> = S

type IsUnicodeScriptSubtag<T> = true

type ParseRegionSubtag<
  T,
  S = T extends string ? IsUnicodeRegionSubtag<T> extends true ? [T, never]
    : [never, 'error']
    : [never, 'error'],
> = S

type IsUnicodeRegionSubtag<T> = true

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

type UnicodeLangId = ParseUnicodeLanguageId<'ja-Kana-JP-t-it-latn-it'>
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
