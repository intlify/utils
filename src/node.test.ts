import { describe, expect, test } from 'vitest'
import { getAcceptLanguages } from './node.ts'
import { IncomingMessage } from 'node:http'

describe('getAcceptLanguages', () => {
  test('basic', () => {
    const mockRequest = {
      headers: {
        'accept-language': 'en-US,en;q=0.9,ja;q=0.8',
      },
    } as IncomingMessage
    expect(getAcceptLanguages(mockRequest)).toEqual(['en-US', 'en', 'ja'])
  })

  test('any language', () => {
    const mockRequest = {
      headers: {
        'accept-language': '*',
      },
    } as IncomingMessage
    expect(getAcceptLanguages(mockRequest)).toEqual([])
  })

  test('empty', () => {
    const mockRequest = {
      headers: {},
    } as IncomingMessage
    expect(getAcceptLanguages(mockRequest)).toEqual([])
  })
})
