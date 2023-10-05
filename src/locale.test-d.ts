import { expectTypeOf, test } from 'vitest'

import type {
  CheckRange,
  ParseLangSubtag,
  ParseRegionSubtag,
  ParseScriptSubtag,
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
  type t2 = ParseRegionSubtag<'12'>
  expectTypeOf<ParseRegionSubtag<'12'>>().toMatchTypeOf<
    [never, 7]
  >()
  type t1 = ParseRegionSubtag<'jpn'>
  expectTypeOf<ParseRegionSubtag<'jpn'>>().toMatchTypeOf<
    [never, 7]
  >()
  expectTypeOf<ParseRegionSubtag<'9123'>>().toMatchTypeOf<
    [never, 7]
  >()
  // not string
  expectTypeOf<ParseRegionSubtag<1>>().toMatchTypeOf<
    never
  >()
})
