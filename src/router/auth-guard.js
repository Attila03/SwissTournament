import { store } from '../store'

export default {
  needUser (to, from, next) {
    if (store.getters.user) {
      next()
    } else {
      next('/login?redirected=true')
    }
  }
}
