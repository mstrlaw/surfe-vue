<!-- A basic Toast style notification component -->
<script>
import ACTIONS from '@/store/ACTIONS.js'
import UIButton from '@/components/ui/Button.vue'

/**
 * A Notification element for displaying info to the user
 * and/or await for user action.
 * @displayName Notification Toast
 */
export default {
  name: 'UINotification',
  components: {
    UIButton,
  },
  data: () => ({
    removeTimer: null,
    notificationClass: '',
  }),
  props: {
    /**
     * Text to display
     */
    message: {
      type: String,
      required: true,
    },
    /**
     * Whether or not to display a dismiss Button
     */
    hasDismiss: {
      type: Boolean,
      default: false,
    },
    /**
     * Dismiss Button text label
     */
    dismissButtonLabel: {
      type: String,
      default: 'Cancel',
    },
    /**
     * Callback function when dismissing the notification
     */
    onDismiss: {
      type: Function,
      default: () => {},
    },
    /**
     * Whether or not to display an accept Button.
     * Used for when the user must confirm some action.
     */
    hasAccept: {
      type: Boolean,
      default: false,
    },
    /**
     * Accept Button text label
     */
    acceptButtonLabel: {
      type: String,
      default: 'Accept',
    },
    /**
     * Callback function when accepting the notification
     */
    onAccept: {
      type: Function,
      default: () => {},
    },
    /**
     * How long to display the notification (milliseconds).
     * Only relevant if no actions are displayed.
     */
    displayTimer: {
      type: Number,
      default: 5000,
    },
  },
  computed: {
    hasActions() {
      return this.hasDismiss || this.hasAccept
    },
  },
  mounted() {
    /**
     * Await for component to exist
     * in DOM before animating it.
     */
    setTimeout(() => {
      this.revealNotification()
    }, 50)

    /**
     * We only set a remove timer if there
     * are no actions for the user to interact with.
     */
    if (!this.hasActions) {
      this.removeTimer = setTimeout(() => {
        this.removeNotification()
      }, this.displayTimer)
    }
  },
  beforeDestroy() {
    clearTimeout(this.removeTimer)
  },
  methods: {
    dismissNotification() {
      this.onDismiss()
      this.removeNotification()
    },
    acceptNotification() {
      this.onAccept()
      this.removeNotification()
    },
    revealNotification() {
      this.notificationClass = 'c-Notification--isVisible'
    },
    removeNotification() {
      const animateElement = new Promise((resolve) => {
        this.notificationClass = ''
        setTimeout(() => resolve(), 100)
      })
      // Await for animation to happen before removing notification
      animateElement.then(() => {
        this.$store.dispatch(ACTIONS.HIDE_NOTIFICATION)
      })
    },
  },
}
</script>

<template>
  <div :class="['c-Notification', notificationClass]" role="alert">
    <div class="c-Notification__body">
      <p>{{ message }}</p>
    </div>
    <div v-if="hasActions" class="c-Notification__actions">
      <UIButton
        v-if="hasDismiss"
        :user-label="dismissButtonLabel"
        class="m-r"
        title="Dismiss notification"
        @on-click="dismissNotification"
      />
      <UIButton
        v-if="hasAccept"
        :user-label="acceptButtonLabel"
        variation="primary"
        @on-click="acceptNotification"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.c-Notification {
  background-color: var(--color-background-mute);
  border-radius: var(--base-radius);
  border: 0.05em solid var(--c-black-mute);
  bottom: var(--base-gap);
  opacity: 0;
  padding: var(--base-gap);
  position: fixed;
  right: var(--base-gap);
  transform: translateY(50px);
  transition: opacity 0.25s, transform 0.25s;

  &--isVisible {
    opacity: 1;
    transform: translateY(0px);
    transition: opacity 0.25s, transform 0.25s;
  }

  &__actions {
    margin-top: calc(var(--base-gap) / 2);
    display: flex;
    justify-content: flex-end;
  }
}
</style>
