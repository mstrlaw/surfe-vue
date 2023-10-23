import Vue from 'vue'
import Vuex from 'vuex'
import notes from '@/store/modules/notes.js'
import toast from '@/store/modules/notification.js'
// import ACTIONS from '@/store/ACTIONS.js'

Vue.use(Vuex)

const localSession = localStorage.getItem('surfe_session')
console.log(localSession)

export default new Vuex.Store({
  modules: {
    notes,
    toast,
  },
})
