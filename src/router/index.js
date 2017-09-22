import Vue from 'vue'
import VueRouter from 'vue-router'
import RegisterTournament from '../components/RegisterTournament.vue'
import CurrentRound from '../components/CurrentRound.vue'
import TournamentInfo from '../components/TournamentInfo.vue'
import Login from '../components/users/Login.vue'
import Signup from '../components/users/Signup.vue'
import Tournaments from '../components/Tournaments.vue'
import AuthGuard from './auth-guard'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/',
      component: RegisterTournament,
      beforeEnter: AuthGuard.needUser
    },
    {path: '/tournament/rounds/:round_num', component: CurrentRound, props: true},
    {path: '/tournament-info', component: TournamentInfo},
    {
      path: '/login',
      component: Login,
      beforeEnter: AuthGuard.redirected
    },
    {path: '/signup', component: Signup},
    {path: '/tournaments', component: Tournaments}
  ],
  mode: 'history'
})
