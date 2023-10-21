import Vue from 'vue'
import App from './App.vue'
import store from '@/store/index'

import '@/assets/main.scss'

new Vue({
  render: (h) => h(App),
  store,
}).$mount('#app')
