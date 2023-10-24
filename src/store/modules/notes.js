import { API, REQUESTS as REQ } from '@/api/index'
import ACTIONS from '@/store/ACTIONS.js'
import { debounce } from '@/utilities.js'

const BLANK_NOTE_DATA = {
  body: '',
  updateDate: new Date().toISOString(),
}

/**
 * Module handling the Notes.
 */
export default {
  state: {
    // Notes data
    activeNoteId: null,
    notes: [],
  },
  actions: {
    /**
     * Loads Notes from a given session ID
     */
    [ACTIONS.GET_NOTES]({ rootState, commit, dispatch }) {
      API[REQ.GET_NOTES](rootState.session)
        .then(({ data }) => {
          const notesData = data.map((note) => {
            return {
              id: note.id,
              ...JSON.parse(note.body),
            }
          })
          commit('setNotes', notesData)
        })
        .catch((error) => {
          // Ideally log error to Sentry or similar
          dispatch(ACTIONS.SHOW_NOTIFICATION, {
            message: 'There was an issue retrieving your notes.',
          })
        })
    },
    /**
     * Effectively creates a new Note
     */
    [ACTIONS.ADD_NOTE]({ rootState, state, commit, dispatch }) {
      const newNote = {
        title: `New Note #${state.notes.length + 1}`,
        ...BLANK_NOTE_DATA,
      }
      // Perform API call
      API[REQ.CREATE_NOTE](rootState.session, newNote)
        .then(({ data }) => {
          // Store newly returned Note to our store
          commit('setNewNote', {
            id: data.id,
            ...JSON.parse(data.body),
          })
        })
        .catch((error) => {
          dispatch(ACTIONS.SHOW_NOTIFICATION, {
            message: 'There was an issue creating your note.',
          })
        })
    },
    /**
     * Stores the currently "active" (i.e. focused) Note
     * @param {Number} noteId - ID of the Note
     */
    [ACTIONS.SAVE_ACTIVE_NOTE]({ commit }, noteId) {
      commit('setActiveNoteId', noteId)
    },
    /**
     * Auto save note with debounce method
     */
    [ACTIONS.AUTO_SAVE_NOTE]: debounce(
      ({ rootState, commit, dispatch }, { noteId, noteData }) => {
        API[REQ.SAVE_NOTE](rootState.session, noteId, noteData)
          .then(({ data }) => {
            commit('setNoteData', {
              id: data.id,
              ...JSON.parse(data.body),
            })
          })
          .catch((error) => {
            console.log(error)
            dispatch(ACTIONS.SHOW_NOTIFICATION, {
              message: 'There was an issue saving your note.',
            })
          })
      }, 1250
    ),
    [ACTIONS.DELETE_NOTE]({ commit }, noteId) {
      commit('removeNote', noteId)
    },
  },
  mutations: {
    setNotes(state, notes) {
      // Sort Notes from newest to oldest
      state.notes = notes.sort((a, b) =>
        a.updateDate < b.updateDate ? 1 : a.updateDate > b.updateDate ? -1 : 0
      )
    },
    setNewNote(state, note) {
      state.notes.unshift(note)
    },
    setActiveNoteId(state, noteId) {
      state.activeNoteId = noteId
    },
    setNoteData(state, noteData) {
      const matchedIndex = state.notes.findIndex((note) => note.id === noteData.id)
      state.notes.splice(matchedIndex, 1, noteData)
    },
    removeNote(state, noteId) {
      const matchedIndex = state.notes.findIndex((note) => note.id === noteId)
      state.notes.splice(matchedIndex, 1)
    },
  },
}
