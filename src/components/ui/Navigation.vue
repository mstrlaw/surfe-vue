<script>
import { mapActions } from 'vuex'
import UIButton from '@/components/ui/Button.vue'

export default {
  name: 'UINav',
  components: {
    UIButton,
  },
  methods: {
    ...mapActions(['addNewNote']),
  },
}
</script>

<template>
  <nav class="c-Nav">
    <UIButton user-label="New Note" @on-click="addNewNote" />
  </nav>
</template>

<style lang="scss" scoped>
.c-Nav {
  align-items: flex-end;
  background-color: var(--color-background-soft);
  border-bottom: 0.05em solid var(--color-background-mute);
  display: flex;
  flex-direction: column;
  padding: var(--base-gap);
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: 100;
}
</style>
