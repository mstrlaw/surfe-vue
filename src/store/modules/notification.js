import ACTIONS from '@/store/ACTIONS.js'

const DEFAULT_TOAST_DATA = {
  message: '',
  hasDismiss: false,
  hasAccept: false,
  dismissButtonLabel: 'Cancel',
  acceptButtonLabel: 'Accept',
  displayTimer: 5000,
  dismiss: () => {},
  accept: () => {},
}

/**
 * Module handling the display of a Notification.
 * Can only handle one notification at any given moment.
 */
export default {
  state: {
    hasActiveNotification: false,
    notificationData: {
      ...DEFAULT_TOAST_DATA,
    },
  },
  actions: {
    [ACTIONS.SHOW_NOTIFICATION]({ state }, notificationData) {
      state.hasActiveNotification = true
      state.notificationData = {
        ...notificationData,
      }
    },
    [ACTIONS.HIDE_NOTIFICATION]({ state }) {
      state.hasActiveNotification = false
      state.notificationData = {
        ...DEFAULT_TOAST_DATA,
      }
    },
  },
}
