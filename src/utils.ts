/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

function warn(msg: string, err?: Error): void {
  if (typeof console !== 'undefined') {
    console.warn(`[intlify/utils] ` + msg)
    /* istanbul ignore if */
    if (err) {
      console.warn(err.stack)
    }
  }
}

const hasWarned: Record<string, boolean> = {}

/**
 * Warns a message only once.
 *
 * @param msg - The warning message
 */
export function warnOnce(msg: string): void {
  if (!hasWarned[msg]) {
    hasWarned[msg] = true
    warn(msg)
  }
}
