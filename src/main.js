import Vue from 'vue'
import App from './App'
import { store } from './store'
import Vuetify from 'vuetify'
import Errors from './components/users/Errors'
import router from './router'

Vue.component('app-errors', Errors)

Vue.use(Vuetify)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  store: store,
  el: '#app',
  router: router,
  template: '<App/>',
  components: { App }
})
