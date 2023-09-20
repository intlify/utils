import { describe, expect, test } from 'vitest'
import { getAcceptLanguages } from './web.ts'

describe('getAcceptLanguages', () => {
  test('basic', () => {
    const mockRequest = new Request('https://example.com')
    mockRequest.headers.set('accept-language', 'en-US,en;q=0.9,ja;q=0.8')
    expect(getAcceptLanguages(mockRequest)).toEqual(['en-US', 'en', 'ja'])
  })

  test('any language', () => {
    const mockRequest = new Request('https://example.com')
    mockRequest.headers.set('accept-language', '*')
    expect(getAcceptLanguages(mockRequest)).toEqual([])
  })

  test('empty', () => {
    const mockRequest = new Request('https://example.com')
    expect(getAcceptLanguages(mockRequest)).toEqual([])
  })
})
