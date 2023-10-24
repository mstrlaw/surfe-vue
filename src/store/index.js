import Vue from 'vue'
import Vuex from 'vuex'
import notes from '@/store/modules/notes.js'
import toast from '@/store/modules/notification.js'

// Single session for now. We could have multiple, like "Notebooks".
const SESSION_KEY = 'surfe_session'

/**
 * Gets an existing UUID session value
 * or generates a new one.
 * @returns {String}
 */
const getOrSetSession = () => {
  let session = localStorage.getItem(SESSION_KEY)
  if (!session) {
    session = crypto.randomUUID()
    localStorage.setItem(SESSION_KEY, session)
  }
  return session
}

/**
 * Instantiate local Vuex data store
 */
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    notes,
    toast,
  },
  state: {
    isAppLoading: true,
    session: getOrSetSession(),
  },
  mutations: {
    setAppLoaded(state) {
      state.isAppLoading = false
    },
  },
})
