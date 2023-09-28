console.log('main navigator.language', navigator.language)
console.log('main navigator.languages', navigator.languages)

new Worker(new URL('./worker.ts', import.meta.url).href, { type: 'module' })
