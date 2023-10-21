<script>
import UIButton from '@/components/ui/Button.vue'

export default {
  components: {
    UIButton,
  },
  data: () => ({
    notes: [],
  }),
  computed: {
    hasNotes() {
      return this.notes.length > 0
    },
    containerClass() {
      return this.hasNotes ? 'u-Container' : 'u-Container u-Container--isEmpty'
    },
  },
  methods: {
    addBlankNote() {
      // I add a new blank note
      console.info('addBlankNote')
    },
  },
}
</script>

<template>
  <main :class="containerClass">
    <div v-if="hasNotes">
      <div>Your notes</div>
    </div>
    <div v-else class="c-Empty">
      <h1>You have no notes</h1>
      <UIButton user-label="New Note" @on-click="addBlankNote" />
    </div>
  </main>
</template>

<style lang="scss" scoped>
.u-Container {
  --container-gap: 0 calc(var(--base-gap) / 2);
  --container-max-width: 100%;
  --items-alignment: flex-start;
  $self: &;

  align-items: var(--items-alignment);
  display: flex;
  height: 100vh;
  margin: 0 auto;
  max-width: var(--container-max-width);
  padding: var(--container-gap);
  width: 100%;

  &--isEmpty {
    --items-alignment: center;
    justify-content: center;
  }

  @include tablet {
    --container-gap: calc(var(--base-gap) / 2) 0;
    --container-max-width: 80vw;
  }

  @include desktop {
    --container-max-width: 50vw;
  }
}

.c-Empty {
  text-align: center;
}
</style>
