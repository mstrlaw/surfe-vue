<script>
import UIButton from '@/components/ui/Button.vue'
import ACTIONS from '@/store/ACTIONS.js'

export default {
  name: 'UINav',
  components: {
    UIButton,
  },
  data: () => ({
    ACTIONS,
  }),
}
</script>

<template>
  <nav class="c-Nav">
    <span class="c-Nav__brand">🏄 <em>Surfe Notes</em></span>
    <UIButton
      user-label="New Note"
      @on-click="$store.dispatch(ACTIONS.ADD_NOTE)"
    />
  </nav>
</template>

<style lang="scss" scoped>
.c-Nav {
  align-items: center;
  justify-content: space-between;
  background-color: var(--color-background-soft);
  border-bottom: 0.05em solid var(--color-background-mute);
  display: flex;
  padding: var(--base-gap);
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: 100;

  &__brand {
    font-weight: bold;
    font-size: 1.2rem;
    text-transform: uppercase;
  }
}
</style>
