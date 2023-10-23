import { isLocale } from 'https://esm.sh/@intlify/utils'

document.querySelector('#app').innerHTML = `
  <p>isLocale('en-US'): ${isLocale(new Intl.Locale('en-US'))}</p>
`
