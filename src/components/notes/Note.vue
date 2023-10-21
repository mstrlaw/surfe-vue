<script>
import ACTIONS from '@/store/ACTIONS.js'
import UIButton from '@/components/ui/Button.vue'

export default {
  name: 'SurfeNote',
  components: {
    UIButton,
  },
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
  methods: {
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
    toggleBold() {
      console.info('toggleBold')
    },
    toggleItalics() {
      console.info('toggleItalics')
    },
  },
}
</script>

<template>
  <article class="c-Note">
    <h1 contenteditable class="c-Note__title" data-placeholder="Note title">
      {{ title }}
    </h1>
    <div class="c-Note__meta">
      <p>
        <time :datetime="updateDate"> {{ updateDate.toISOString() }}</time>
      </p>
    </div>
    <div
      contenteditable
      class="c-Note__body"
      data-placeholder="Add details to this note"
    >
      {{ body }}
    </div>
    <div class="c-Note__actions">
      <div class="c-Note__actionsLeft">
        <UIButton user-label="B" @on-click="toggleBold" />
        <UIButton user-label="I" @on-click="toggleItalics" />
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
