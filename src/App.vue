<script>
import SurfeNote from '@/components/notes/Note.vue'
import UIButton from '@/components/ui/Button.vue'
import UINav from '@/components/ui/Navigation.vue'

export default {
  components: {
    SurfeNote,
    UIButton,
    UINav,
  },
  data: () => ({
    notes: [
      {
        id: '1',
        title: 'Some cool title',
        body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius molestias id obcaecati fugit at.',
        updateDate: new Date(),
      },
      {
        id: '2',
        title: 'Another pretty cool title goes gere',
        body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius molestias id obcaecati fugit at, tempore voluptatem voluptates ad eveniet atque deserunt molestiae necessitatibus nihil iusto suscipit quos laborum maxime similique!',
        updateDate: new Date(),
      },
    ],
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
      console.info('addBlankNote')
    },
  },
}
</script>

<template>
  <div>
    <UINav v-if="hasNotes" />
    <main :class="containerClass">
      <template v-if="hasNotes">
        <SurfeNote
          v-for="note in notes"
          :key="note.id"
          :id="note.id"
          :title="note.title"
          :body="note.body"
          :update-date="note.updateDate"
        />
      </template>
      <div v-else class="c-Empty">
        <h1>You have no notes 🌊</h1>
        <UIButton user-label="New Note" @on-click="addBlankNote" />
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.u-Container {
  --container-gap: 0 calc(var(--base-gap) / 2);
  --container-max-width: 100%;
  --container-height: auto;
  --items-alignment: flex-start;

  align-items: var(--items-alignment);
  display: flex;
  flex-direction: column;
  height: var(--container-height);
  margin: calc(var(--base-gap) * 5) auto; // Compensate fixed top nav
  max-width: var(--container-max-width);
  padding: var(--container-gap);
  width: 100%;

  &--isEmpty {
    --items-alignment: center;
    --container-height: 100vh;
    justify-content: center;
    margin: 0 auto;
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
