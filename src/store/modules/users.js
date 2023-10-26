import { API, REQUESTS as REQ } from '@/api/index'
import ACTIONS from '@/store/ACTIONS.js'
import { debounce } from '@/utilities.js'

/**
 * Module handling the fetch and matching
 * of users
 */
export default {
  state: {
    hasFetchedUsers: false,
    users: [],
  },
  actions: {
    [ACTIONS.GET_USERS]: debounce(({ commit, dispatch }) => {
      API[REQ.GET_USERS]()
        .then(({ data }) => {
          commit('setUsers', data)
        })
        .catch((error) => {
          console.log(error)
          dispatch(ACTIONS.SHOW_NOTIFICATION, {
            message: 'There was an issue retrieving users.',
          })
        })
    }, 500),
  },
  mutations: {
    setUsers(state, users) {
      state.users = users
      state.hasFetchedUsers = true
    },
  },
}
