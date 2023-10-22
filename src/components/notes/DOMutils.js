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
