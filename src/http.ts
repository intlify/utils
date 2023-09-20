import { parseAcceptLanguage } from './shared.ts'

export function getAcceptLanguagesFromGetter(
  getter: () => string | null | undefined,
): string[] {
  const acceptLanguage = getter()
  return acceptLanguage ? parseAcceptLanguage(acceptLanguage) : []
}
