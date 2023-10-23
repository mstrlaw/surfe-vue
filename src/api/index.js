import axios from 'axios'

export default {
  GET_SESSION: async () => {
    await new Promise((resolve) => {
      console.log('GET_SESSION')
      resolve()
    })
  },
  POST_SESSION: async () => {
    await new Promise((resolve) => {
      console.log('POST_SESSION')
      resolve()
    })
  },
  GET_NOTES: async () => {
    await new Promise((resolve) => {
      console.log('GET_NOTES')
      resolve()
    })
  },
  PUT_NOTE: async () => {
    await new Promise((resolve) => {
      console.log('PUT_NOTE')
      resolve()
    })
  },
}
