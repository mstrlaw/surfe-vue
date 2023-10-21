<script>
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
    toggleBold() {
      console.info('toggleBold')
    },
    toggleItalics() {
      console.info('toggleItalics')
    },
    deleteNote() {
      console.info('deleteNote')
    },
  },
}
</script>

<template>
  <article class="c-Note">
    <h1 contenteditable class="c-Note__title">{{ title }}</h1>
    <div class="c-Note__meta">
      <p>
        <time :datetime="updateDate"> {{ updateDate.toISOString() }}</time>
      </p>
    </div>
    <div contenteditable class="c-Note__body">
      {{ body }}
    </div>
    <div class="c-Note__actions">
      <div class="c-Note__actionsLeft">
        <UIButton user-label="B" @on-click="toggleBold" />
        <UIButton user-label="I" @on-click="toggleItalics" />
      </div>
      <UIButton user-label="Delete" @on-click="deleteNote" />
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
}
</style>
