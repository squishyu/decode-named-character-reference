/// <reference lib="dom" />

/* eslint-env browser */

// Start with a null element (so the module doesn't throw if document is undefined)
let element =
  typeof document === 'undefined' ? null : document.createElement('i')

/**
 * @param {string} value
 * @returns {string|false}
 */
export function decodeNamedCharacterReference(value) {
  if (!element) {
    // Let the code throw an error here if being run on a server
    element = document.createElement('i')
  }

  const characterReference = '&' + value + ';'
  element.innerHTML = characterReference
  const char = element.textContent

  // Some named character references do not require the closing semicolon
  // (`&not`, for instance), which leads to situations where parsing the assumed
  // named reference of `&notit;` will result in the string `¬it;`.
  // When we encounter a trailing semicolon after parsing, and the character
  // reference to decode was not a semicolon (`&semi;`), we can assume that the
  // matching was not complete.
  // @ts-expect-error: TypeScript is wrong that `textContent` on elements can
  // yield `null`.
  if (char.charCodeAt(char.length - 1) === 59 /* `;` */ && value !== 'semi') {
    return false
  }

  // If the decoded string is equal to the input, the character reference was
  // not valid.
  // @ts-expect-error: TypeScript is wrong that `textContent` on elements can
  // yield `null`.
  return char === characterReference ? false : char
}
