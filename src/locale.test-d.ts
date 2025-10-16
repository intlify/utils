/**
 * NOTE:
 *  This test is work in pregoress ...
 *  We might remove this test file in the future,
 *  when we will find out that cannot support locale validation
 */

import { expectTypeOf, test } from 'vitest'

import type {
  CheckRange,
  ParseKeyword,
  ParseLangSubtag,
  ParseOtherExtension,
  ParsePuExtension,
  ParseRegionSubtag,
  ParseScriptSubtag,
  ParseTransformedExtension,
  ParseUnicodeExtension,
  ParseUnicodeLanguageId,
  ParseVariantsSubtag,
} from './locale.ts'

test('CheckRange', () => {
  type Indexes = [2, 3, 5, 6, 7, 8]
  // 0
  expectTypeOf<CheckRange<[], Indexes>>().toMatchTypeOf<false>()
  // 2
  expectTypeOf<CheckRange<['e', 'n'], Indexes>>().toMatchTypeOf<true>()
  // 3
  expectTypeOf<CheckRange<['e', 'n', 'g'], Indexes>>().toMatchTypeOf<true>()
  // 4
  expectTypeOf<CheckRange<['e', 'n', 'g', 'l'], Indexes>>().toMatchTypeOf<
    false
  >()
  // 5
  expectTypeOf<CheckRange<['j', 'a', 'p', 'a', 'n'], Indexes>>().toMatchTypeOf<
    true
  >()
  // 8
  expectTypeOf<CheckRange<['c', 'h', 'i', 'l', 'a', 'n', 'd', '1'], Indexes>>()
    .toMatchTypeOf<
      true
    >()
  // 9
  expectTypeOf<
    CheckRange<['c', 'h', 'i', 'l', 'a', 'n', 'd', 'a', 'b'], Indexes>
  >()
    .toMatchTypeOf<
      false
    >()

  expectTypeOf<
    CheckRange<['1', '2', '3', '4'], [4]>
  >()
    .toMatchTypeOf<
      true
    >()
  expectTypeOf<
    CheckRange<['1', '2', '3'], [4]>
  >()
    .toMatchTypeOf<
      false
    >()
})

test('ParseLangSubtag', () => {
  /**
   * Success cases
   */

  // 2 chars
  expectTypeOf<ParseLangSubtag<'ja'>>().toMatchTypeOf<
    ['ja', never, []]
  >()
  // 3 chars
  expectTypeOf<ParseLangSubtag<'jpn', ['jpn']>>().toMatchTypeOf<
    ['jpn', never, []]
  >()
  // 7 chars
  expectTypeOf<ParseLangSubtag<'english', ['english', 'US']>>().toMatchTypeOf<
    ['english', never, ['US']]
  >()
  // 'root' is special (4 chars)
  expectTypeOf<ParseLangSubtag<'root'>>().toMatchTypeOf<['root', never, []]>()
  // upper case
  expectTypeOf<ParseLangSubtag<'JA'>>().toMatchTypeOf<
    ['JA', never, []]
  >()
  // mixied case
  expectTypeOf<ParseLangSubtag<'Ja'>>().toMatchTypeOf<
    ['Ja', never, []]
  >()

  /**
   * Failed cases
   */

  // empty
  expectTypeOf<ParseLangSubtag<''>>().toMatchTypeOf<
    [never, 1, []]
  >()
  // no-alphabet
  expectTypeOf<ParseLangSubtag<'11'>>().toMatchTypeOf<
    [never, 2, []]
  >()
  // never
  expectTypeOf<ParseLangSubtag<never>>().toMatchTypeOf<
    [never, 1, []]
  >()
  // range
  expectTypeOf<ParseLangSubtag<'abcd'>>().toMatchTypeOf<
    [never, 3, []]
  >()
  expectTypeOf<ParseLangSubtag<'abcdefghj'>>().toMatchTypeOf<
    [never, 3, []]
  >()
  // not string
  expectTypeOf<ParseLangSubtag<1>>().toMatchTypeOf<never>()
})

test('ParseScriptSubtag', () => {
  /**
   * Success cases
   */

  // 4 chars
  expectTypeOf<ParseScriptSubtag<'kana'>>().toMatchTypeOf<
    ['kana', never, []]
  >()

  // empty
  expectTypeOf<ParseScriptSubtag<''>>().toMatchTypeOf<
    [never, never, []]
  >()

  // upper case
  expectTypeOf<ParseScriptSubtag<'Kana'>>().toMatchTypeOf<
    ['Kana', never, []]
  >()

  /**
   * Failed cases
   */

  // no-alphabet
  expectTypeOf<ParseScriptSubtag<'1111'>>().toMatchTypeOf<
    [never, 4, []]
  >()
  // range
  expectTypeOf<ParseScriptSubtag<'lat'>>().toMatchTypeOf<
    [never, 5, []]
  >()
  expectTypeOf<ParseScriptSubtag<'arabi'>>().toMatchTypeOf<
    [never, 5, []]
  >()
  // not string
  expectTypeOf<ParseScriptSubtag<1>>().toMatchTypeOf<
    never
  >()

  /**
   * through case
   */
  expectTypeOf<ParseScriptSubtag<'US', ['US']>>().toMatchTypeOf<
    [never, never, ['US']]
  >()
})

test('ParseRegionSubtag', () => {
  /**
   * Success cases
   */

  // 2 chars (alpha)
  expectTypeOf<ParseRegionSubtag<'jp'>>().toMatchTypeOf<
    ['jp', never, []]
  >()
  // 3 chars (digit)
  expectTypeOf<ParseRegionSubtag<'012'>>().toMatchTypeOf<
    ['012', never, []]
  >()
  // empty
  expectTypeOf<ParseRegionSubtag<''>>().toMatchTypeOf<
    [never, never, []]
  >()
  // upper case
  expectTypeOf<ParseLangSubtag<'JP'>>().toMatchTypeOf<
    ['JP', never, []]
  >()

  /**
   * Failed cases
   */

  // no all-alphabet
  expectTypeOf<ParseRegionSubtag<'j1'>>().toMatchTypeOf<
    [never, 6, []]
  >()
  // no all-digits
  expectTypeOf<ParseRegionSubtag<'12j'>>().toMatchTypeOf<
    [never, 6, []]
  >()
  // range
  expectTypeOf<ParseRegionSubtag<'j'>>().toMatchTypeOf<
    [never, 7, []]
  >()
  expectTypeOf<ParseRegionSubtag<'12'>>().toMatchTypeOf<
    [never, 7, []]
  >()
  expectTypeOf<ParseRegionSubtag<'jpn'>>().toMatchTypeOf<
    [never, 7, []]
  >()
  expectTypeOf<ParseRegionSubtag<'9a23'>>().toMatchTypeOf<
    [never, 7, []]
  >()
  // not string
  expectTypeOf<ParseRegionSubtag<1>>().toMatchTypeOf<
    never
  >()

  /**
   * through case
   */
  expectTypeOf<ParseRegionSubtag<'u', ['u']>>().toMatchTypeOf<
    [never, never, ['u']]
  >()
})

test('ParseVariantsSubtag', () => {
  /**
   * Success cases
   */

  // 3 chars, all digits
  expectTypeOf<ParseVariantsSubtag<['123']>>().toMatchTypeOf<
    [['123'], never, []]
  >()
  // 3 chars, first digit and alphabets
  expectTypeOf<ParseVariantsSubtag<['1ab']>>().toMatchTypeOf<
    [['1ab'], never, []]
  >()
  // 5 chars, all alphabets
  expectTypeOf<ParseVariantsSubtag<['abcde']>>().toMatchTypeOf<
    [['abcde'], never, []]
  >()
  // 7 chars, alphabets and digits
  expectTypeOf<ParseVariantsSubtag<['ab12cde', 'abcde123']>>()
    .toMatchTypeOf<
      [['ab12cde', 'abcde123'], never, []]
    >()

  /**
   * Failed cases
   */

  // range 1
  expectTypeOf<ParseVariantsSubtag<['1']>>().toMatchTypeOf<
    [[], never, ['1']]
  >()
  // range 2
  expectTypeOf<ParseVariantsSubtag<['12']>>().toMatchTypeOf<
    [[], never, ['12']]
  >()
  // range 4
  expectTypeOf<ParseVariantsSubtag<['1234']>>().toMatchTypeOf<
    [[], never, ['1234']]
  >()
  // range 9
  expectTypeOf<ParseVariantsSubtag<['123456789']>>().toMatchTypeOf<
    [[], never, ['123456789']]
  >()

  // 3 chars, first alphabet and digits
  expectTypeOf<ParseVariantsSubtag<['a12']>>().toMatchTypeOf<
    [[], never, ['a12']]
  >()
  // 3 chars, all alphabets
  expectTypeOf<ParseVariantsSubtag<['abc']>>().toMatchTypeOf<
    [[], never, ['abc']]
  >()

  // not string
  expectTypeOf<ParseVariantsSubtag<[1]>>().toMatchTypeOf<
    [[], never, [1]]
  >()
})

test('ParseUnicodeLanguageId', () => {
  /**
   * Success cases
   */
  expectTypeOf<ParseUnicodeLanguageId<['ja']>>().toMatchTypeOf<
    [
      { lang: 'ja'; variants: [] },
      never,
      [],
    ]
  >()
  expectTypeOf<ParseUnicodeLanguageId<'ja-JP'>>().toMatchTypeOf<
    [
      { lang: 'ja'; region: 'JP'; variants: [] },
      never,
      [],
    ]
  >()
  expectTypeOf<ParseUnicodeLanguageId<'ja-Kana-jp-jauer'>>().toMatchTypeOf<
    [
      { lang: 'ja'; script: 'Kana'; region: 'jp'; variants: ['jauer'] },
      never,
      [],
    ]
  >()

  /** Errors */
  expectTypeOf<ParseUnicodeLanguageId<'a-ana-p-jauer-jauer'>>().toMatchTypeOf<
    [
      { lang: never; script: never; region: never; variants: [] },
      [
        'requires 2-3 or 5-8 alphabet lower characters',
      ],
      ['a', 'ana', 'p', 'jauer', 'jauer'],
    ]
  >()
})

test('ParseKeyword', () => {
  /**
   * Success cases
   */
  // type t1 = ParseKeyword<['co', 'standard', 'phonetic']>
  expectTypeOf<ParseKeyword<['co', 'standard', 'phonetic']>>().toMatchTypeOf<
    ['co', 'standard-phonetic', []]
  >()
  // type t2 = ParseKeyword<['co', 'standard']>
  expectTypeOf<ParseKeyword<['co', 'standard']>>().toMatchTypeOf<
    ['co', 'standard', []]
  >()
  expectTypeOf<ParseKeyword<['co']>>().toMatchTypeOf<
    ['co', '', []]
  >()

  /** Fail cases */
  // type t3 = ParseKeyword<['c']>
  expectTypeOf<ParseKeyword<['c']>>().toMatchTypeOf<
    [never, ['c']]
  >()
})

test('ParseUnicodeExtension', () => {
  /**
   * Success cases
   */
  // type t1 = ParseUnicodeExtension<['co', 'standard']>
  expectTypeOf<ParseUnicodeExtension<['co', 'standard']>>()
    .toMatchTypeOf<
      [{ type: 'u'; keywords: ['co', 'standard']; attributes: [] }, never, []]
    >()
  // type t2 = ParseUnicodeExtension<['foo', 'bar', 'co', 'standard']>
  expectTypeOf<ParseUnicodeExtension<['foo', 'bar', 'co', 'standard']>>()
    .toMatchTypeOf<
      [
        { type: 'u'; keywords: ['co', 'standard']; attributes: ['foo', 'bar'] },
        never,
        [],
      ]
    >()

  /**
   * Fail cases
   */
  // type t3 = ParseUnicodeExtension<['c']>
  expectTypeOf<ParseUnicodeExtension<['c']>>().toMatchTypeOf<
    [
      { type: 'u'; keywords: []; attributes: [] },
      never,
      ['c'],
    ]
  >()
})

test('ParseTransformedExtension', () => {
  /**
   * Success cases
   */
  // type t1 = ParseTransformedExtension<
  //   ['en', 'Kana', 'US', 'jauer', 'h0', 'hybrid']
  // >
  expectTypeOf<
    ParseTransformedExtension<['en', 'Kana', 'US', 'jauer', 'h0', 'hybrid']>
  >()
    .toMatchTypeOf<
      [
        {
          type: 't'
          lang: {
            lang: 'en'
            script: 'Kana'
            region: 'US'
            variants: ['jauer']
          }
          fields: [['h0', 'hybrid']]
        },
        never,
        [],
      ]
    >()

  /**
   * Fail cases
   */
  // type t2 = ParseTransformedExtension<['en', 'US', 'h0']>
  expectTypeOf<ParseTransformedExtension<['en', 'US', 'h0']>>()
    .toMatchTypeOf<
      [
        {
          type: 't'
          lang: {
            lang: 'en'
            script: never
            region: 'US'
            variants: []
          }
          fields: never
        },
        10,
        ['h0'],
      ]
    >()
  // type t3 = ParseTransformedExtension<['en']>
  expectTypeOf<ParseTransformedExtension<['en']>>().toMatchTypeOf<
    [never, 11, ['en']]
  >()
})

test('ParsePuExtension', () => {
  /**
   * Success cases
   */
  expectTypeOf<
    ParsePuExtension<['1234', 'abcde']>
  >()
    .toMatchTypeOf<
      [
        {
          type: 'x'
          value: '1234-abcde'
        },
        never,
        [],
      ]
    >()

  /**
   * Fail cases
   */
  // empty
  expectTypeOf<
    ParsePuExtension<['']>
  >()
    .toMatchTypeOf<
      [
        never,
        12,
        [''],
      ]
    >()

  // not alphabet or digit
  expectTypeOf<
    ParsePuExtension<['1あ']>
  >()
    .toMatchTypeOf<
      [
        never,
        12,
        ['1あ'],
      ]
    >()
})

test('ParseOtherExtension', () => {
  /**
   * Success cases
   */
  expectTypeOf<
    ParseOtherExtension<['1234', 'abcde']>
  >()
    .toMatchTypeOf<['1234-abcde', []]>()

  /**
   * Fail cases
   */
  // empty
  expectTypeOf<
    ParseOtherExtension<['']>
  >()
    .toMatchTypeOf<['', ['']]>()

  // not alphabet or digit
  expectTypeOf<
    ParseOtherExtension<['1あ']>
  >()
    .toMatchTypeOf<['', ['1あ']]>()
})
