import Vue from 'vue'
import Vuex from 'vuex'
import toast from '@/store/notification.js'
import ACTIONS from '@/store/ACTIONS.js'

Vue.use(Vuex)

const BLANK_NOTE_DATA = {
  body: `My note's content`,
  updateDate: new Date(),
}

export default new Vuex.Store({
  modules: {
    toast,
  },
  state: {
    // Notes data
    notes: [],
  },
  actions: {
    // For Notes
    [ACTIONS.ADD_NOTE]({ state, commit }) {
      const newNote = {
        id: crypto.randomUUID(),
        title: `Note #${state.notes.length + 1}`,
        ...BLANK_NOTE_DATA,
      }
      commit('setNewNote', newNote)
    },
    [ACTIONS.DELETE_NOTE]({ commit }, noteId) {
      commit('removeNote', noteId)
    },
  },
  mutations: {
    setNewNote(state, note) {
      state.notes.unshift(note)
    },
    removeNote(state, noteId) {
      const matchedIndex = state.notes.findIndex((note) => note.id === noteId)
      state.notes.splice(matchedIndex, 1)
    },
  },
})
