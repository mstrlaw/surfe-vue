import Vue from 'vue'
import Vuex from 'vuex'
import toast from '@/store/notification.js'
import ACTIONS from '@/store/ACTIONS.js'
import { debounce } from '@/utilities.js'

Vue.use(Vuex)

const BLANK_NOTE_DATA = {
  body: '',
  updateDate: new Date(),
}

export default new Vuex.Store({
  modules: {
    toast,
  },
  state: {
    // Notes data
    activeNoteId: null,
    notes: [
      {
        id: '1',
        title: 'A cool title goes here',
        body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius molestias id obcaecati fugit at.',
        updateDate: new Date(),
      },
    ],
  },
  actions: {
    [ACTIONS.ADD_NOTE]({ state, commit }) {
      const newNote = {
        id: crypto.randomUUID(),
        title: `Note #${state.notes.length + 1}`,
        ...BLANK_NOTE_DATA,
      }
      commit('setNewNote', newNote)
    },
    [ACTIONS.SAVE_ACTIVE_NOTE]({ commit }, noteId) {
      commit('setActiveNoteId', noteId)
    },
    [ACTIONS.SAVE_NOTE]: debounce(({ commit }, noteData) => {
      commit('setNoteData', noteData)
    }),
    [ACTIONS.DELETE_NOTE]({ commit }, noteId) {
      commit('removeNote', noteId)
    },
  },
  mutations: {
    setNewNote(state, note) {
      state.notes.unshift(note)
    },
    setActiveNoteId(state, noteId) {
      state.activeNoteId = noteId
    },
    setNoteData(state, noteData) {
      const matchedIndex = state.notes.findIndex(
        (note) => note.id === noteData.id
      )
      const updateData = {
        ...noteData,
        updateDate: new Date(),
      }
      state.notes.splice(matchedIndex, 1, updateData)
    },
    removeNote(state, noteId) {
      const matchedIndex = state.notes.findIndex((note) => note.id === noteId)
      state.notes.splice(matchedIndex, 1)
    },
  },
})
