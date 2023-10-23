/**
 * A simple debounce implementation, basically taken from
 * https://davidwalsh.name/javascript-debounce-function
 *
 * @param {Function} fn - The function to execute
 * @param {Number} delay - How long to debounce for (millisecconds)
 * @returns
 */
export const debounce = (fn, wait) => {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    const context = this
    timer = setTimeout(() => {
      fn.apply(context, args)
    }, wait)
  }
}
