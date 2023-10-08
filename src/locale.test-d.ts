import { expectTypeOf, test } from 'vitest'

import type {
  CheckRange,
  ParseKeyword,
  ParseLangSubtag,
  ParseRegionSubtag,
  ParseScriptSubtag,
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
    ['ja', never]
  >()
  // 3 chars
  expectTypeOf<ParseLangSubtag<'jpn'>>().toMatchTypeOf<
    ['jpn', never]
  >()
  // 7 chars
  expectTypeOf<ParseLangSubtag<'english'>>().toMatchTypeOf<['english', never]>()
  // 'root' is special (4 chars)
  expectTypeOf<ParseLangSubtag<'root'>>().toMatchTypeOf<['root', never]>()
  // upper case
  expectTypeOf<ParseLangSubtag<'JA'>>().toMatchTypeOf<
    ['JA', never]
  >()
  // mixied case
  expectTypeOf<ParseLangSubtag<'Ja'>>().toMatchTypeOf<
    ['Ja', never]
  >()

  /**
   * Failed cases
   */

  // empty
  expectTypeOf<ParseLangSubtag<''>>().toMatchTypeOf<
    [never, 1]
  >()
  // no-alphabet
  expectTypeOf<ParseLangSubtag<'11'>>().toMatchTypeOf<
    [never, 2]
  >()
  // never
  expectTypeOf<ParseLangSubtag<never>>().toMatchTypeOf<
    [never, 1]
  >()
  // range
  expectTypeOf<ParseLangSubtag<'abcd'>>().toMatchTypeOf<
    [never, 3]
  >()
  expectTypeOf<ParseLangSubtag<'abcdefghj'>>().toMatchTypeOf<
    [never, 3]
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
    ['kana', never]
  >()

  // empty
  expectTypeOf<ParseScriptSubtag<''>>().toMatchTypeOf<
    [never, never]
  >()

  // upper case
  expectTypeOf<ParseScriptSubtag<'Kana'>>().toMatchTypeOf<
    ['Kana', never]
  >()

  /**
   * Failed cases
   */

  // no-alphabet
  expectTypeOf<ParseScriptSubtag<'1111'>>().toMatchTypeOf<
    [never, 4]
  >()
  // range
  expectTypeOf<ParseScriptSubtag<'lat'>>().toMatchTypeOf<
    [never, 5]
  >()
  expectTypeOf<ParseScriptSubtag<'arabi'>>().toMatchTypeOf<
    [never, 5]
  >()
  // not string
  expectTypeOf<ParseScriptSubtag<1>>().toMatchTypeOf<
    never
  >()
})

test('ParseRegionSubtag', () => {
  /**
   * Success cases
   */

  // 2 chars (alpha)
  expectTypeOf<ParseRegionSubtag<'jp'>>().toMatchTypeOf<
    ['jp', never]
  >()
  // 3 chars (digit)
  expectTypeOf<ParseRegionSubtag<'012'>>().toMatchTypeOf<
    ['012', never]
  >()
  // empty
  expectTypeOf<ParseRegionSubtag<''>>().toMatchTypeOf<
    [never, never]
  >()
  // upper case
  expectTypeOf<ParseLangSubtag<'JP'>>().toMatchTypeOf<
    ['JP', never]
  >()

  /**
   * Failed cases
   */

  // no all-alphabet
  expectTypeOf<ParseRegionSubtag<'j1'>>().toMatchTypeOf<
    [never, 6]
  >()
  // no all-digits
  expectTypeOf<ParseRegionSubtag<'12j'>>().toMatchTypeOf<
    [never, 6]
  >()
  // range
  expectTypeOf<ParseRegionSubtag<'j'>>().toMatchTypeOf<
    [never, 7]
  >()
  expectTypeOf<ParseRegionSubtag<'12'>>().toMatchTypeOf<
    [never, 7]
  >()
  expectTypeOf<ParseRegionSubtag<'jpn'>>().toMatchTypeOf<
    [never, 7]
  >()
  expectTypeOf<ParseRegionSubtag<'9a23'>>().toMatchTypeOf<
    [never, 7]
  >()
  // not string
  expectTypeOf<ParseRegionSubtag<1>>().toMatchTypeOf<
    never
  >()
})

test('ParseVariantsSubtag', () => {
  /**
   * Success cases
   */

  // 3 chars, all digits
  expectTypeOf<ParseVariantsSubtag<['123']>>().toMatchTypeOf<
    [['123'], never]
  >()
  // 3 chars, first digit and alphabets
  expectTypeOf<ParseVariantsSubtag<['1ab']>>().toMatchTypeOf<
    [['1ab'], never]
  >()
  // 5 chars, all alphabets
  expectTypeOf<ParseVariantsSubtag<['abcde']>>().toMatchTypeOf<
    [['abcde'], never]
  >()
  // 7 chars, alphabets and digits
  expectTypeOf<ParseVariantsSubtag<['ab12cde', 'abcde123']>>().toMatchTypeOf<
    [['ab12cde', 'abcde123'], never]
  >()

  /**
   * Failed cases
   */

  // range 1
  expectTypeOf<ParseVariantsSubtag<['1']>>().toMatchTypeOf<
    [[], never]
  >()
  // range 2
  expectTypeOf<ParseVariantsSubtag<['12']>>().toMatchTypeOf<
    [[], never]
  >()
  // range 4
  expectTypeOf<ParseVariantsSubtag<['1234']>>().toMatchTypeOf<
    [[], never]
  >()
  // range 9
  expectTypeOf<ParseVariantsSubtag<['123456789']>>().toMatchTypeOf<
    [[], never]
  >()

  // 3 chars, first alphabet and digits
  expectTypeOf<ParseVariantsSubtag<['a12']>>().toMatchTypeOf<
    [[], never]
  >()
  // 3 chars, all alphabets
  expectTypeOf<ParseVariantsSubtag<['abc']>>().toMatchTypeOf<
    [[], never]
  >()

  // not string
  expectTypeOf<ParseVariantsSubtag<[1]>>().toMatchTypeOf<
    [[], never]
  >()
})

test('ParseUnicodeLangugageId', () => {
  /**
   * Success cases
   */
  expectTypeOf<ParseUnicodeLanguageId<'ja-Kana-jp-jauer'>>().toMatchTypeOf<
    [{ lang: 'ja'; script: 'Kana'; region: 'jp'; variants: ['jauer'] }, never]
  >()

  /** Erros */
  expectTypeOf<ParseUnicodeLanguageId<'a-ana-p-jauer-jauer'>>().toMatchTypeOf<
    [
      { lang: never; script: never; region: never; variants: ['jauer'] },
      [
        'requires 2-3 or 5-8 alphabet lower characters',
        'unicode script subtag requires 4 alphabet lower characters',
        'unicode region subtag requires 2 alphabet lower characters or 3 digits',
        'duplicate unicode variant subtag',
      ],
    ]
  >()
})

test('ParseKeyword', () => {
  /**
   * Success cases
   */

  expectTypeOf<ParseKeyword<['co', 'standard', 'phonetic']>>().toMatchTypeOf<
    ['co', 'standard-phonetic']
  >()
  expectTypeOf<ParseKeyword<['co', 'standard']>>().toMatchTypeOf<
    ['co', 'standard']
  >()
  expectTypeOf<ParseKeyword<['co']>>().toMatchTypeOf<
    ['co', '']
  >()

  /** Fail cases */
  expectTypeOf<ParseKeyword<['c']>>().toMatchTypeOf<
    never
  >()
})

test('ParseUnicodeExtension', () => {
  /**
   * Success cases
   */
  expectTypeOf<ParseUnicodeExtension<['co', 'standard']>>()
    .toMatchTypeOf<
      [{ type: 'u'; keywords: ['co', 'standard']; attributes: [] }, never]
    >()
  expectTypeOf<ParseUnicodeExtension<['foo', 'bar', 'co', 'standard']>>()
    .toMatchTypeOf<
      [
        { type: 'u'; keywords: ['co', 'standard']; attributes: ['foo', 'bar'] },
        never,
      ]
    >()

  /**
   * Fail cases
   */
  expectTypeOf<ParseUnicodeExtension<['c']>>().toMatchTypeOf<
    [never, 8]
  >()
})
