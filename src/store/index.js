import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import createPersistedState from 'vuex-persistedstate'
import initialState from './initialState'

Vue.use(Vuex)

export const store = new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    stateObject: {
      loading: false,
      user: null,
      currentTournament: {
        'id': '',
        'name': '',
        'players': [],
        'last_concluded_round': 0,
        'total_rounds': 0,
        'organizer': ''
      },
      currentRound: {
        'id': '',
        'tournament': '',
        'round_num': '',
        'matches': [],
        'concluded': false
      },
      baseURL: 'https://swisstournament.herokuapp.com/'
    }
  },
  getters: {
    loading (state) {
      return state.stateObject.loading
    },
    user (state) {
      return state.stateObject.user
    },
    currentTournament (state) {
      return state.stateObject.currentTournament
    },
    currentRound (state) {
      return state.stateObject.currentRound
    },
    baseURL (state) {
      return state.stateObject.baseURL
    }
  },

  mutations: {
    resetState (state) {
      Vue.set(state, 'stateObject', initialState.getInitialState())
    },
    setUser (state, payload) {
      state.stateObject.user = payload
    },
    setTournament (state, payload) {
      // payload = tournament in initial state format
      Vue.set(state.stateObject, 'currentTournament', payload)
      Vue.set(state.stateObject, 'currentRound', initialState.getInitialRoundState())
    },
    registerPlayers (state, payload) {
      Vue.set(state.stateObject.currentTournament, 'players', payload)
    },
    loadRound (state, roundData) {
      Vue.set(state.stateObject, 'currentRound', roundData)
    },
    matchRegister (state, data) {
      let match = state.stateObject.currentRound.matches.find(match => {
        return match.id === data.match_id
      })
      Vue.set(match, 'result', data.result)
    },
    roundConcluded (state, payload) {
      state.stateObject.currentTournament.last_concluded_round += (payload ? 1 : -1)
      Vue.set(state.stateObject.currentRound, 'concluded', payload)
    },
    setLoading (state, payload) {
      state.stateObject.loading = payload
    }
  },
  actions: {
    createTournament (context, payload) {
      // payload = {tournamentName: 'xyz', tempPlayerList: ['name1', 'name2'], router:router_instance}
      let players = payload.tempPlayerList.map(player => { return {'name': player} })
      let userToken = context.getters.user.token
      axios({
        method: 'POST',
        url: 'http://127.0.0.1:8000/api/tournaments/',
        headers: {
          Authorization: 'Token ' + userToken
        },
        data: { 'name': payload.tournamentName, 'players': players }
      }).then(response => {
        context.commit('setTournament', response.data)
        context.commit('registerPlayers', response.data.players)
        payload.router.push('/tournament-info')
      }).catch(error => {
        console.log(error)
      })
    },
    createRound (context, roundInfo) {
      // round_info = {"tournament": tournament_id, "round_num": tournament_round_number}
      let tournamentId = context.state.stateObject.currentTournament.id
      let roundNum = context.state.stateObject.currentTournament.last_concluded_round + 1
      let userToken = context.getters.user.token

      let getPairingsRequest = axios({
        method: 'GET',
        url: 'http://127.0.0.1:8000/api/tournaments/' + tournamentId + '/' + 'get-pairings',
        headers: {
          Authorization: 'Token ' + userToken
        }
      })

      getPairingsRequest.then(response => {
        let matches = []
        for (let matchIndex in response.data) {
          let matchObj = {
            'white_player': {'id': response.data[matchIndex][0]},
            'black_player': {'id': response.data[matchIndex][1]}
          }
          matches.push(matchObj)
        }
        axios({
          method: 'POST',
          url: 'http://127.0.0.1:8000/api/rounds/',
          headers: {
            Authorization: 'Token ' + userToken
          },
          data: {
            'tournament': tournamentId,
            'round_num': roundNum,
            'matches': matches
          }
        }).then(response => {
          context.commit('loadRound', response.data)
        })
      })
    },
    postRoundResults (context) {
      context.commit('roundConcluded', true)
      let roundId = context.state.stateObject.currentRound.id
      let userToken = context.getters.user.token
      axios({
        method: 'PUT',
        url: 'http://127.0.0.1:8000/api/rounds/' + roundId + '/',
        headers: {
          Authorization: 'Token ' + userToken
        },
        data: context.state.stateObject.currentRound
      }).then(response => {
        this.$router.push('/tournament-info')
      }).catch(error => {
        // context.commit('roundConcluded', false)
        console.log(error)
      })
    }
  }
})
