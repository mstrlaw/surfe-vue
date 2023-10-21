<script>
import { mapState } from 'vuex'
import SurfeNote from '@/components/notes/Note.vue'
import UIButton from '@/components/ui/Button.vue'
import UINav from '@/components/ui/Navigation.vue'
import UINotification from '@/components/ui/Notification.vue'
import ACTIONS from '@/store/ACTIONS.js'

export default {
  components: {
    SurfeNote,
    UIButton,
    UINav,
    UINotification,
  },
  data: () => ({
    ACTIONS,
  }),
  computed: {
    ...mapState(['notes']),
    ...mapState({
      hasActiveNotification: (state) => state.toast.hasActiveNotification,
      notificationData: (state) => state.toast.notificationData,
    }),
    hasNotes() {
      return this.notes.length > 0
    },
    containerClass() {
      return this.hasNotes ? 'u-Container' : 'u-Container u-Container--isEmpty'
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
        <UIButton
          user-label="New Note"
          @on-click="$store.dispatch(ACTIONS.ADD_NOTE)"
        />
      </div>
    </main>
    <!-- Notification Toast -->
    <UINotification
      v-if="hasActiveNotification"
      :message="notificationData.message"
      :has-dismiss="notificationData.hasDismiss"
      :dismiss-button-label="notificationData.dismissButtonLabel"
      :on-dismiss="notificationData.dismiss"
      :has-accept="notificationData.hasAccept"
      :accept-button-label="notificationData.acceptButtonLabel"
      :on-accept="notificationData.accept"
      :delay-timer="notificationData.displayTimer"
    />
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
