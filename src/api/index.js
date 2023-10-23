import axios from 'axios'

// Axios instance
const service = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT,
})

export const REQUESTS = {
  CREATE_NOTE: 'CREATE_NOTE',
  GET_NOTES: 'GET_NOTES',
  SAVE_NOTE: 'SAVE_NOTE',
}

/**
 * Our API service, used via Store actions.
 */
export const API = {
  [REQUESTS.CREATE_NOTE]: (sessionId, noteData) => {
    return service.post(`/${sessionId}/notes`, {
      body: JSON.stringify(noteData),
    })
  },
  [REQUESTS.GET_NOTES]: (sessionId) => {
    return service.get(`/${sessionId}/notes`)
  },
  [REQUESTS.SAVE_NOTE]: (sessionId, noteId, noteData) => {
    return service.put(`/${sessionId}/notes/${noteId}`, {
      body: JSON.stringify(noteData),
    })
  },
  // Not using this one for now
  // GET_NOTE: () => {
  //   return new Promise((resolve) => {
  //     resolve()
  //   })
  // },
}
