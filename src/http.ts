import { parseAcceptLanguage } from './shared.ts'

export function getAcceptLanguagesWithGetter(
  getter: () => string | null | undefined,
): string[] {
  const acceptLanguage = getter()
  return acceptLanguage ? parseAcceptLanguage(acceptLanguage) : []
}

export function getLocaleWithGetter(getter: () => string): Intl.Locale {
  return new Intl.Locale(getter())
}
