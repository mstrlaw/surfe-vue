import { REQUESTS as REQ } from '@/api/index'

/**
 * Possible store Acions.
 * For convenience we're making the API related actions value equal to our service's requests.
 */
export default {
  // Notification module
  SHOW_NOTIFICATION: 'showNotification',
  HIDE_NOTIFICATION: 'hideNotification',
  // Notes module
  SAVE_ACTIVE_NOTE: 'saveActiveNote',
  AUTO_SAVE_NOTE: 'saveNote',
  ADD_NOTE: 'addNewNote',
  DELETE_NOTE: 'deleteNote',
  [REQ.CREATE_NOTE]: REQ.CREATE_NOTE,
  [REQ.GET_NOTES]: REQ.GET_NOTES,
  [REQ.SAVE_NOTE]: REQ.SAVE_NOTE,
  [REQ.GET_USERS]: REQ.GET_USERS,
}
