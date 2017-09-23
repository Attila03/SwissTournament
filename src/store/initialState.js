export default {
  getInitialState () {
    return {
      loading: false,
      user: null,
      playersRegistered: false,
      currentTournament: {
        'id': '',
        'name': '',
        'players': [],
        'last_round_num': 0,
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
      baseURL: process.env.BASE_URL
    }
  },
  getInitialRoundState () {
    return {
      id: '',
      tournament: '',
      round_num: '',
      matches: [],
      concluded: false
    }
  }
}
