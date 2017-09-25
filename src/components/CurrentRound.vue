<template>
  <div id="current-round">
    <h4 class="text-xs-center">{{ tournamentName }}: Round {{ round_num }}</h4>

    <v-container fluid>
      <v-layout row>
        <v-flex xs12 class="text-xs-center">
          <v-progress-circular 
            indeterminate 
            class="red--text" 
            v-if="loading"
            :width="10"
            size="80"></v-progress-circular>
        </v-flex>
      </v-layout>
    </v-container>
    

    <v-container fluid v-if="!roundConcluded && !loading">
      <v-layout row wrap justify-space-evenly>
        <v-flex xs10 offset-xs1 sm6 offset-sm0 md4 offset-md0 v-for="(match, i) in matches" :key="i">
          <v-card>
            <v-card-text>
              <v-layout row class="player" 
                :class="playerClass(match, 'white')" 
                @click="matchRegister(match, 'white')"> 
                <v-flex class="app-padding" xs9>
                  {{ match.white_player.name}}
                </v-flex>
                <v-flex xs3 class="text-xs-center app-padding score">{{getPlayerScore(match, 'white')}}</v-flex>
              </v-layout>
              <v-layout row class="draw-container" @click="matchRegister(match, 'draw')">
                <v-flex xs12 class="text-xs-center">DRAW</v-flex>
              </v-layout>
              <v-layout row class="player"
                :class="playerClass(match, 'black')"
                @click="matchRegister(match, 'black')">
                <v-flex xs9 class="app-padding">
                  {{match.black_player.name}}
                </v-flex>
                <v-flex xs3 class="text-xs-center app-padding score">{{getPlayerScore(match, 'black')}}</v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout row id="submit-result" v-if="!confirm">
        <v-flex xs8 offset-xs2 sm6 offset-sm3 md4 offset-md4 class="text-xs-center">
          <v-btn :disabled="allResultsObtained" class="error" @click="confirm=true">Submit Results</v-btn>
        </v-flex> 
      </v-layout>

      <v-layout row id="confirm-submit-result" v-if="confirm">
        <v-flex xs8 offset-xs2 sm6 offset-sm3 md4 offset-md4 class="text-xs-center">
          <v-btn :disabled="allResultsObtained" class="error" @click="postRoundResults">Confirm!</v-btn>
        </v-flex> 
      </v-layout>

    </v-container>

    <v-container fluid v-if="roundConcluded && !loading">
      <v-layout row wrap justify-space-evenly>
        <v-flex xs10 offset-xs1 sm6 offset-sm0 md4 offset-md0 v-for="(match, i) in matches" :key="i">
          <v-card>
            <v-card-text>
              <v-layout row class="player" 
                :class="playerClass(match, 'white')"> 
                <v-flex class="app-padding" xs9>
                  {{ match.white_player.name}}
                </v-flex>
                <v-flex xs3 class="text-xs-center app-padding score">{{getPlayerScore(match, 'white')}}</v-flex>
              </v-layout>
              <v-layout row class="draw-container">
                <v-flex xs12 class="text-xs-center">DRAW</v-flex>
              </v-layout>
              <v-layout row class="player"
                :class="playerClass(match, 'black')">
                <v-flex xs9 class="app-padding">
                  {{match.black_player.name}}
                </v-flex>
                <v-flex xs3 class="text-xs-center app-padding score">{{getPlayerScore(match, 'black')}}</v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs8 offset-xs2 sm6 offset-sm3>
          <p class="text-xs-center green--text" id="success-msg">Results have been submitted successfully</p>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs12 class="text-xs-center">
          <router-link to="/tournament-info" id="tournament-info">Go to Standings and Rounds</router-link>
        </v-flex>
      </v-layout>
    </v-container>
      
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: ['round_num'],
  data: function () {
    return {
      confirm: false,
      resultSubmitted: false,
      loading: true
    }
  },
  methods: {
    matchRegister (match, result) {
      this.$store.commit('matchRegister', {'match_id': match.id, 'result': result})
    },

    playerClass (match, playerColor) {
      if (match.result === 'undetermined') {
        return 'undetermined'
      } else if (match.result === 'draw') {
        return 'draw'
      } else {
        return (match.result === playerColor) ? 'winner' : 'loser'
      }
    },
    getPlayerScore (match, playerColor) {
      if (match.result === 'undetermined') {
        return 0
      } else if (match.result === 'draw') {
        return 0.5
      } else {
        return (match.result === playerColor) ? 1 : 0
      }
    },
    postRoundResults () {
      this.resultSubmitted = true
      this.$store.dispatch('postRoundResults')
    }
  },
  computed: {
    matches () {
      return this.$store.getters.currentRound.matches
    },
    tournamentName () {
      return this.$store.getters.currentTournament.name
    },
    roundNum () {
      return this.$store.getters.currentRound.round_num
    },
    allResultsObtained () {
      return this.matches.some((match) => { return match.result === 'undetermined' })
    },
    roundConcluded () {
      return this.$store.getters.currentRound.concluded
    }
  },
  beforeMount: function () {
    this.loading = true
    let tournamentId = this.$store.getters.currentTournament.id
    let roundNum = this.$route.params.round_num
    let url = this.$store.getters.baseURL + 'api/tournaments/' + tournamentId + '/round/' + roundNum
    let userToken = this.$store.getters.user.token
    axios({
      method: 'GET',
      url: url,
      headers: {
        Authorization: 'Token ' + userToken
      }
    }).then(response => {
      if (response.data.exists) {
        this.$store.commit('loadRound', response.data)
        this.loading = false
      } else {
        this.$store.dispatch('createRound')
        this.loading = false
      }
    })
  }
}
</script>

<style scoped>
#current-round {
  background-color: rgba(225,165,125,0.7);
  padding-top: 25px;
  min-height: 100vh;
}

.card__text{
  padding: 0;
}

.card {
  margin: 20px;
}


.app-padding{
  padding: 15px 25px 15px 25px;
}

.undetermined {
  background: white;
}

.draw-container {
  background: orange;
}

.winner {
  /* background: rgb(100, 221, 23); */
  background: rgb(0, 230, 118);
  /* background: rgb(118, 255, 3); */
}

.loser {
  background: rgb(130, 157, 220);
}

.draw {
/*  background: rgb(161, 136, 127);*/
  background: rgb(188, 170, 164);
  /* background: rgb(215, 204, 200); */
 } 

.score {
  font-size: 18px;
  font-weight: bolder;
}

#submit-result {
  margin: 30px;
}

#confirm-submit-result {
  margin: 30px;
}

#success-msg {
  font-size: 24px;
}

#tournament-info {
  text-decoration: none;
  color: darkcyan;
  font-size: 24px;
}

</style>