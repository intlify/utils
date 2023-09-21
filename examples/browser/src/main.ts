import './style.css'
import intlifyLogo from '/intlify.svg'
import { setupCounter } from './counter.ts'
import { isLocale } from 'https://esm.sh/@intlify/utils'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://gihtub.com/intlify/utils" target="_blank">
      <img src="${intlifyLogo}" class="logo" alt="Intlify logo" />
    </a>
    <h1>Browser example</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Intlify logo to learn more
    </p>
    <p>isLocale('en-US'): ${isLocale(new Intl.Locale('en-US'))}</p>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
