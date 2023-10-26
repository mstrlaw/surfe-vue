<script>
import { mapState } from 'vuex'
import { format, formatDistanceToNow } from 'date-fns'
import ACTIONS from '@/store/ACTIONS.js'
import UIButton from '@/components/ui/Button.vue'

import {
  STYLE_TYPES,
  toggleWrappingTag,
  highlightMentions,
  getCaretCoordinates,
  getCaretPrecedingChar,
  placeCaretAtEnd,
  getRangeFromMention,
} from '@/components/notes/DOMutils.js'

const KEY = {
  BACKSPACE: 8,
  TAB: 9,
  ENTER: 13,
  ESCAPE: 27,
  SPACE: 32,
  ARROW_LEFT: 37,
  ARROW_UP: 38,
  ARROW_RIGHT: 39,
  ARROW_DOWN: 40,
  AT: '@',
}

export default {
  name: 'SurfeNote',
  components: {
    UIButton,
  },
  data: () => ({
    STYLE_TYPES,
    localTitle: '',
    localBody: '',
    // User mention
    userSearchCriteria: '',
    matchedUsers: [],
    isMentioningUser: false,
    isFocusingMenu: false,
    currentMenuIndex: 0,
    caretIsWithinMention: false,
    caretPrecedingCharacter: '',
    mentionMenuPosX: 0,
    mentionMenuPosY: 0,
  }),
  props: {
    id: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    updateDate: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapState({
      activeNoteId: (state) => state.notes.activeNoteId,
      hasFetchedUsers: (state) => state.users.hasFetchedUsers,
      users: (state) => state.users.users,
    }),
    isActiveNote() {
      return this.id === this.activeNoteId
    },
    lastEditMessage() {
      return `Edited ${formatDistanceToNow(new Date(this.updateDate))} ago`
    },
    readableDate() {
      return format(new Date(this.updateDate), 'p, MMM do yyyy')
    },
  },
  watch: {
    userSearchCriteria(value) {
      if (value.length > 0) {
        this.matchedUsers = this.users.filter((user) => {
          const { first_name, last_name, username } = user

          // Check if any of the fields contain the partial match
          return (
            first_name.toLowerCase().includes(value) ||
            last_name.toLowerCase().includes(value) ||
            username.toLowerCase().includes(value)
          )
        })
      }
    },
  },
  mounted() {
    /**
     * When we mount the compoent, we work with a local instance of
     * the Note's body and title.
     * This way we avoid re-rendering the component when saving the Note
     * and all types of infernal caret re-positioning issues.
     */
    this.localTitle = this.title
    this.localBody = highlightMentions(this.body) // Apply mention highlights
    this.updateCaretCoordinates()
  },
  methods: {
    setActiveNote() {
      this.$store.dispatch(ACTIONS.SAVE_ACTIVE_NOTE, this.id)
    },
    /**
     * Applies the given font style to the actively selected range
     */
    applyTextStyle(STYLE) {
      const selection = window.getSelection()
      const hasSelectedBody =
        selection.anchorNode.parentNode.closest('.c-Note__body')
      // This way we ensure we aren't applying any styles outside of a Note's body
      if (this.isActiveNote && hasSelectedBody) {
        try {
          const modifiedRange = toggleWrappingTag(selection, STYLE)

          // Applies range
          selection.removeAllRanges()
          selection.addRange(modifiedRange)

          selection.removeAllRanges() // Unselects text

          // Manually trigger body update
          this.saveNote()
        } catch (error) {
          /**
           * This seems to happen mainly because of the selection
           * overlapping with non-text, such as a tag start/end.
           * It requires the user to precisely select the text within
           * boundaries to toggle styles.
           * For now, keeping this issue..
           */
          this.$store.dispatch(ACTIONS.SHOW_NOTIFICATION, {
            message: `Couldn't apply style to selected text.`,
          })
        }
      }
    },
    // When pasting content we only allow plain text to be added.
    handlePastedContent(event) {
      event.preventDefault()
      const plainText = (event.originalEvent || event).clipboardData.getData('text/plain')
      window.document.execCommand('insertText', false, plainText)
    },
    saveNote() {
      this.$store.dispatch(ACTIONS.AUTO_SAVE_NOTE, {
        noteData: {
          id: this.id,
          title: this.$refs.noteTitle.innerText,
          body: this.$refs.noteBody.innerHTML,
          updateDate: new Date().toISOString(),
        },
      })
    },
    toggleDeletionWarning() {
      this.$store.dispatch(ACTIONS.SHOW_NOTIFICATION, {
        message: `Delete note "${this.title.substring(0, 15).trim()}" ?`,
        hasDismiss: true,
        hasAccept: true,
        acceptButtonLabel: 'Delete',
        accept: () => {
          this.$store.dispatch(ACTIONS.DELETE_NOTE, this.id)
        },
      })
    },
    /**
     * Mention mechanics
     * TODO: move to dedicated part of the codebase
     */
    /**
     * Handles keydown event when working on the Note's body contenteditable element
     */
    onBodyKeydown(event) {
      const { keyCode } = event
      this.caretPrecedingCharacter = getCaretPrecedingChar(this.$refs.noteBody)

      // Focus user menu selection on tab press
      if (keyCode === KEY.TAB && this.isMentioningUser) {
        // Focus first child result, if any
        if (this.$refs.userList.children.length > 0) {
          event.preventDefault()
          this.isFocusingMenu = true
          this.currentMenuIndex = 0
          this.$refs.userList.children[0].focus()
        }
      }
      // Blur users menu on esc press (re-focus Notes body)
      else if (keyCode === KEY.ESCAPE && this.isFocusingMenu) {
        this.resetMentionFlow()
        this.$refs.noteBody.focus()
      }
      // Blur user menu on tab press (re-focus Notes body)
      else if (keyCode === KEY.TAB && this.isFocusingMenu) {
        event.preventDefault()
        this.resetMentionFlow()
        this.$refs.noteBody.focus()
      }
    },
    onBodyKeyup(event) {
      // In case we'd want to trigger other things
      this.checkForMentionTrigger(event)
    },
    checkForMentionTrigger(event) {
      const { key, keyCode } = event
      /**
       * When user types in the @ symbol, we initiate the mention UI/UX
       */
      if (key === KEY.AT) {
        if (!this.isMentioningUser) {
          // Get coordinates to place menu
          this.updateCaretCoordinates()
          this.isMentioningUser = true
        } else {
          this.resetMentionFlow()
        }
      }
      // When user uses arrow down to access user menu
      else if (keyCode === KEY.ARROW_DOWN && this.isMentioningUser) {
        event.preventDefault()
        this.focusNextResult()
      }
      // When user uses arrow, trigger Mention highlight method
      // Right + !this.caretIsWithinMention prevents the caret to remain "trapped" inside the span element
      else if (
        keyCode === KEY.ARROW_LEFT ||
        keyCode === KEY.ARROW_UP ||
        (keyCode === KEY.ARROW_RIGHT && !this.caretIsWithinMention) ||
        keyCode === KEY.ARROW_DOWN
      ) {
        this.selectMention()
      }
      // If user presses backspace, isMentioningUserm and
      //  caretPrecedingCharacter (i.e. recently deleted char) is the @ symbol
      // then stop the mention UI/UX
      else if (
        keyCode === KEY.BACKSPACE &&
        this.isMentioningUser
      ) {
        this.userSearchCriteria = this.userSearchCriteria.slice(0, -1)
        if (this.caretPrecedingCharacter === KEY.AT) {
          this.resetMentionFlow()
        }
      }
      // If user presses enter or space AND isMentioningUser we stop the highlighting UI/UX
      else if (
        (keyCode === KEY.ENTER || keyCode === KEY.SPACE) &&
        this.isMentioningUser
      ) {
        this.resetMentionFlow()
      }

      /**
       * Everytime the user types an alphanumerical char while isMentioningUser
       * store the value in userSearchCriteria to later match the HTML to replace
       * with selected mention uppon applyMention.
       *
       * Also, we perform the user query to the database (once)
       * and filter the stored results.
       */
      if (this.isMentioningUser && /^[a-zA-Z]$/.test(key) && keyCode !== KEY.BACKSPACE) {
        this.userSearchCriteria += key

        if (!this.hasFetchedUsers) {
          this.$store.dispatch(ACTIONS.GET_USERS)
        }
      }
    },
    /**
     * Handles keydown on selected user result options.
     * Note that ENTER key is handled by keypress.enter event handler
     */
    onMentionOptionKeydown(event) {
      const { keyCode } = event
      if (keyCode === KEY.ARROW_UP) {
        this.focusPreviousResult()
      } else if (keyCode === KEY.ARROW_DOWN) {
        event.preventDefault()
        this.focusNextResult()
      } else if (keyCode === KEY.TAB) {
        event.preventDefault()
        // Go down
        this.focusNextResult()
      } else if (keyCode === KEY.ESCAPE) {
        this.resetMentionFlow()
        this.$refs.noteBody.focus()
      }
    },
    focusPreviousResult() {
      if (this.currentMenuIndex - 1 >= 0) {
        this.currentMenuIndex -= 1
        this.$refs.userList.children[this.currentMenuIndex].focus()
      } else {
        this.currentMenuIndex = this.$refs.userList.children.length - 1
        this.$refs.userList.children[this.currentMenuIndex].focus()
      }
    },
    focusNextResult() {
      if (this.currentMenuIndex + 1 < this.$refs.userList.children.length) {
        this.currentMenuIndex += 1
        this.$refs.userList.children[this.currentMenuIndex].focus()
      } else {
        this.currentMenuIndex = 0
        this.$refs.userList.children[this.currentMenuIndex].focus()
      }
    },
    /**
     * Adds mention to contenteditable. Bit hacky, not great.
     * 1. We match noteBody's HTML with our userSearchCriteria, such as @mstr
     * 2. Then replace it with the full string to be used, such as @mstrlaw
     * 3. We re-run the content through highlightMentions to wrap the newly added mention.
     *    This causes the issue where the cursor gets reset to 0 because of updating its content.
     * 4. Save
     * 5. Reset mention flow
     * 6. Moves caret to end.
     *    This is fine is user is adding a mention at end of the content but if placing a mention
     *    somewhere in the middle, the caret will jump back at the end of the doc which isn't good..
     */
    applyMention(value) {
      const originalBody = this.$refs.noteBody.innerHTML
      const mentionMatchRe = new RegExp(`(?:(?<=\\s)|(?<=^)|(?<=<\\/div>))(?<!<\\/span>)(@${this.userSearchCriteria})(?![^>]*<span>)`, 'gim')
      const modified = originalBody.replace(mentionMatchRe, ` @${value}`)

      this.$refs.noteBody.innerHTML = highlightMentions(modified) // Apply mention highlights
      this.saveNote()
      this.resetMentionFlow()

      placeCaretAtEnd(this.$refs.noteBody)
    },
    /**
     * Hides mention menu and resets data.
     */
    resetMentionFlow() {
      setTimeout(() => {
        this.isFocusingMenu = false
        this.isMentioningUser = false
        this.userSearchCriteria = ''
        this.currentMenuIndex = 0
        this.matchedUsers = []
        this.mentionMenuPosX = 0
        this.mentionMenuPosY = 0
      }, 50)
    },
    updateCaretCoordinates() {
      const { x, y } = getCaretCoordinates()
      this.mentionMenuPosX = x
      this.mentionMenuPosY = y
    },
    selectMention() {
      this.caretIsWithinMention = getRangeFromMention('u-Mention')
    },
  },
}
</script>

<template>
  <article :id="id" class="c-Note">
    <h1
      ref="noteTitle"
      contenteditable
      class="c-Note__title"
      data-placeholder="Note title"
      v-text="localTitle"
      @input="saveNote"
      @focus="setActiveNote"
      @paste="handlePastedContent"
    />
    <div class="c-Note__meta">
      <small :title="readableDate">
        <time :datetime="updateDate"> {{ lastEditMessage }}</time>
      </small>
    </div>
    <div
      ref="noteBody"
      contenteditable
      class="c-Note__body"
      data-placeholder="Add details to this note"
      v-html="localBody"
      @click="selectMention"
      @keydown="onBodyKeydown"
      @keyup="onBodyKeyup"
      @input="saveNote"
      @focus="setActiveNote"
      @paste="handlePastedContent"
    />
    <div class="c-Note__actions">
      <div class="c-Note__actionsLeft">
        <UIButton
          user-label="B"
          class="m-r"
          title="Toggle Bold style"
          @on-click="applyTextStyle(STYLE_TYPES.BOLD)"
        />
        <UIButton
          user-label="I"
          title="Toggle Italic style"
          @on-click="applyTextStyle(STYLE_TYPES.ITALIC)"
        />
      </div>
      <UIButton user-label="Delete" @on-click="toggleDeletionWarning" />
    </div>
    <div
      v-show="isMentioningUser"
      ref="userList"
      class="c-UserList"
      :style="`top:${mentionMenuPosY}px;left:${mentionMenuPosX}px;`"
    >
      <a
        v-for="user in matchedUsers"
        :key="user.username"
        href="#"
        class="c-UserList__result"
        @click="applyMention(user.username)"
        @keypress.enter="applyMention(user.username)"
        @keydown="onMentionOptionKeydown"
      >
        <span>{{ user.first_name }} {{ user.last_name }} ({{ user.username }})</span>
      </a>
    </div>
  </article>
</template>

<style lang="scss" scoped>
.c-Note {
  @include transition(background-color);
  background-color: var(--color-background-soft);
  border-radius: var(--base-radius);
  border: 0.05em solid var(--c-blue-light);
  margin-bottom: var(--base-gap);
  padding: var(--base-gap);
  width: 100%;

  &:first-of-type() {
    margin-top: var(--base-gap);
  }

  > * {
    padding: 0 calc(var(--base-gap) / 4); // Avoids having text too close to focus outline when editing
  }

  &__title,
  &__body {
    outline-color: var(--c-horizon-300);
  }

  &__title {
    min-height: 1.6em; // For when element is empty
  }
  &__body {
    margin: var(--base-gap) 0;
    min-height: calc(var(--base-gap) * 4);
  }

  &__actions {
    align-content: center;
    display: flex;
    justify-content: space-between;
    margin-top: calc(var(--base-gap) / 2);
  }
}
[contenteditable] {
  &:hover,
  &:focus {
    @include transition(background-color);
    background-color: var(--color-background-mute);
  }
  /**
   CSS only placeholder doesn't work properly.
   TODO: Fix or remove.
   */
  &:empty:not(:focus):before {
    color: var(--color-placeholder);
    content: attr(data-placeholder);
    display: block;
    pointer-events: none;
  }

  // Vue can't apply styles to inline HTML so we must use v-deep
  ::v-deep .u-Mention {
    position: relative;
    z-index: 1;
    text-shadow: 0px 0px 0px var(--c-black-soft);

    &:before {
      content: '';
      background-color: var(--c-horizon-300);
      border-radius: var(--base-radius);
      display: block;
      height: calc(100% + 2px);
      left: -2px;
      opacity: 0.2;
      padding: 0 0.5em;
      position: absolute;
      top: 0px;
      width: calc(100% + 4px);
      z-index: -1;
    }
  }
}

.c-UserList {
  background-color: var(--c-horizon-200);
  border-radius: var(--base-radius);
  border: 0.05em solid var(--c-blue-light);
  max-height: calc(var(--base-gap) * 16);
  overflow: auto;
  padding: 0;
  position: fixed;
  transform: translate3d(0, 24px, 0);
  z-index: 50;

  &__result {
    @include transition(background-color);
    display: block;
    text-decoration: none;

    span {
      display: block;
      padding: calc(var(--base-gap) / 4) calc(var(--base-gap) / 2);
    }

    &:hover,
    &:focus {
      @include transition(background-color);
      background-color: var(--c-horizon-300);
    }
  }
}
</style>
