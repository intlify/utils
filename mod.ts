import { isLocale } from 'https://deno.land/x/intlify_utils'

console.log('isLocale', isLocale(new Intl.Locale('en-US')))
