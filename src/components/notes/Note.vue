<script>
import { mapState } from 'vuex'
import ACTIONS from '@/store/ACTIONS.js'
import UIButton from '@/components/ui/Button.vue'
import { STYLE_TYPES, toggleWrappingTag } from '@/components/notes/DOMutils.js'

export default {
  name: 'SurfeNote',
  components: {
    UIButton,
  },
  data: () => ({
    STYLE_TYPES,
    localBody: '',
  }),
  props: {
    id: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    body: {
      type: String,
      default: '',
    },
    updateDate: {
      type: Date,
      default: () => new Date(),
    },
  },
  computed: {
    ...mapState({
      activeNoteId: (state) => state.notes.activeNoteId,
    }),
    isActiveNote() {
      return this.id === this.activeNoteId
    },
  },
  mounted() {
    /**
     * When we mount the compoent, we work with a local instance of
     * the Note's body.
     * This way we avoid re-rendering the component when saving the Note
     * and all types of infernal caret re-positioning issues.
     */
    this.localBody = this.body
  },
  methods: {
    setActiveNote() {
      this.$store.dispatch(ACTIONS.SAVE_ACTIVE_NOTE, this.id)
    },
    applyStyle(STYLE) {
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
      this.$store.dispatch(ACTIONS.SAVE_NOTE, {
        id: this.id,
        title: this.$refs.noteTitle.innerText,
        body: this.$refs.noteBody.innerHTML,
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
      @input="saveNote"
      @focus="setActiveNote"
      @paste="handlePastedContent"
    >
      {{ title }}
    </h1>
    <div class="c-Note__meta">
      <p>
        <time :datetime="updateDate"> {{ updateDate.toISOString() }}</time>
      </p>
    </div>
    <div
      ref="noteBody"
      contenteditable
      class="c-Note__body"
      data-placeholder="Add details to this note"
      v-html="localBody"
      @input="saveNote"
      @focus="setActiveNote"
      @paste="handlePastedContent"
    />
    <div class="c-Note__actions">
      <div class="c-Note__actionsLeft">
        <UIButton user-label="B" @on-click="applyStyle(STYLE_TYPES.BOLD)" />
        <UIButton user-label="I" @on-click="applyStyle(STYLE_TYPES.ITALIC)" />
      </div>
      <UIButton user-label="Delete" @on-click="toggleDeletionWarning" />
    </div>
  </article>
</template>

<style lang="scss" scoped>
.c-Note {
  @include transition(background-color);
  background-color: var(--color-background-soft);
  border-radius: var(--base-radius);
  border: 0.05em solid var(--color-background-mute);
  margin-bottom: var(--base-gap);
  padding: var(--base-gap);
  width: 100%;

  &:first-of-type() {
    margin-top: var(--base-gap);
  }

  > * {
    padding: 0 calc(var(--base-gap) / 4); // Avoids having text too close to focus outline when editing
  }

  &__title {
    min-height: 1.6em; // For when element is empty
  }
  &__body {
    margin: var(--base-gap) 0;
    min-height: calc(var(--base-gap) * 4);
  }

  &__actions {
    display: flex;
    align-content: center;
    justify-content: space-between;
    margin-top: calc(var(--base-gap) / 2);
  }
}
[contenteditable] {
  &:hover {
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
}
</style>
