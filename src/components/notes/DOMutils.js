export const STYLE_TYPES = {
  BOLD: 'BOLD',
  ITALIC: 'ITALIC',
}

const STYLES = {
  [STYLE_TYPES.BOLD]: {
    TAG_NAME: 'STRONG',
    ELEMENT: 'strong',
  },
  [STYLE_TYPES.ITALIC]: {
    TAG_NAME: 'EM',
    ELEMENT: 'em',
  },
}
/**
 * Applies or removes a given HTML tag around a selection range.
 * Returns a modified range to be applied to the initial selection.
 * @param {Object} selection - A selection object
 * @param {String} STYLE  - The "style" object to apply to our selection
 */
export const toggleWrappingTag = (selection, STYLE) => {
  if (selection.rangeCount) {
    const STYLE_OBJ = STYLES[STYLE]
    const range = selection.getRangeAt(0).cloneRange()
    /**
     * Removes the wrapping tag when parent's tagName
     * is equal to the style we're attempting to apply.
     */
    if (
      range.startContainer.parentElement &&
      range.startContainer.parentElement.tagName === STYLE_OBJ.TAG_NAME
    ) {
      const wrappingElement = range.startContainer.parentElement
      // Remove empty wrapping tag
      wrappingElement.parentNode.removeChild(wrappingElement)
      // Move the content out of the tag
      while (wrappingElement.firstChild) {
        range.insertNode(wrappingElement.firstChild)
      }
    } else {
      const wrappingElement = document.createElement(STYLE_OBJ.ELEMENT)
      range.surroundContents(wrappingElement)
    }

    // Return modified range
    return range
  }
}
/**
 * Returns a Note's body content with wrapped mentions for styling them
 *
 * @param {String} localBody - original body content
 * @returns {String} - body content with wrapped mentions elements
 */
export const highlightMentions = (localBody) => {
  // Regex match from https://stackoverflow.com/questions/56687661/find-all-valid-user-mentions-in-text-with-regex
  const highlightedBody = localBody.replace(
    /(?<!<span class="u-Mention">)(\B@(?!(?:[a-z0-9.]*_){2})(?!(?:[a-z0-9_]*\.){2})[._a-z0-9]{3,24}\b)(?![^>]*<span>)/gim,
    `<span class="u-Mention">$1</span><span>&nbsp;</span>`
  )
  return highlightedBody
}
/**
 * Gets approximate x,y coordinates of where our caret is presently at.
 * We use this to later position the user mention menu
 *
 * @returns {Object} - Object containig x, y values
 */
export const getCaretCoordinates = () => {
  let x = 0
  let y = 0
  if (typeof window.getSelection !== 'undefined') {
    const selection = window.getSelection()
    // Check if there is a selection (i.e. cursor in place)
    if (selection.rangeCount !== 0) {
      const range = selection.getRangeAt(0).cloneRange()
      // Collapse the range to the start, so there are not multiple chars selected
      range.collapse(true)
      const rect = range.getClientRects()[0]
      if (rect) {
        x = rect.left
        y = rect.top
      }
    }
  }
  return { x, y }
}
/**
 * Returns the textual character preceeding the carret's position.
 * Used to keep track of what the user might be deleting.
 *
 * @param {Object} element - A DOM element
 * @returns {String} - The cooresponding character value
 */
export const getCaretPrecedingChar = (element) => {
  let precedingChar = ''
  let range
  if (typeof window.getSelection !== 'undefined') {
    const selection = window.getSelection()
    if (selection.rangeCount !== 0) {
      range = selection.getRangeAt(0).cloneRange()
      range.collapse(true)
      range.setStart(element, 0)
      precedingChar = range.toString().slice(-1)
    }
  }
  return precedingChar
}
/**
 * Moves the caret at the end of the provided DOM element
 * and focuses said element.
 *
 * @param {Object} element - A DOM element
 * @returns {String} - The cooresponding character value
 */
export const placeCaretAtEnd = (element) => {
  const range = document.createRange()

  // Set the range to the end of the contenteditable element
  range.selectNodeContents(element)
  range.collapse(false) // Set to the end (true would set it to the start)

  // Create a Selection object
  const selection = window.getSelection()

  // Remove existing selections
  selection.removeAllRanges()

  // Add the new range to the selection
  selection.addRange(range)

  // Focus the contenteditable element (optional)
  element.focus()
}
/**
 * Determines if caret is within bounds of parent node containing className
 * and returns whether or no is within said parent.
 *
 * @param {String} className - Class name to match
 * @returns {Boolean} - If caret is within parent
 */
export const getRangeFromMention = (className) => {
  let caretIsWithinBounds = false
  if (typeof window.getSelection !== 'undefined') {
    const selection = window.getSelection()
    // Check if there is a selection (i.e. cursor in place)
    if (selection.rangeCount !== 0) {
      const range = selection.getRangeAt(0)
      const startContainer = range.startContainer

      if (startContainer.parentElement?.classList.contains(className)) {
        const parentElement = startContainer.parentElement
        const textNode = parentElement.firstChild

        // Create a new range for the text content
        const newRange = document.createRange()
        newRange.selectNodeContents(textNode)

        // Remove any existing selections
        selection.removeAllRanges()

        // Add the new range to the selection
        selection.addRange(newRange)
        caretIsWithinBounds = true
      }
    }
  }
  return caretIsWithinBounds
}
