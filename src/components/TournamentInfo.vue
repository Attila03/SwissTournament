<template>
  <v-container fluid id="tournament-info">
    <v-layout row v-if="!tournamentName">
      <v-flex xs8 offset-xs2 class="text-xs-center">
        <h5>
          You need to 
          <router-link to="/register-tournament">create</router-link> 
          a Tournament or 
          <router-link to="/tournaments">load</router-link>
          one of your existing tournaments.</h5>
      </v-flex>
    </v-layout>

    <v-layout row wrap v-if="tournamentName">
      <v-flex xs12 class="text-xs-center">
        <h4 id="tournament-name">{{ tournamentName }}</h4>
      </v-flex>

      <v-flex xs10 offset-xs1 md6 offset-md0 class="text-xs-center" id="rounds">
        <h5 class="text-xs-center white--text">Rounds</h5>
        <p>
          <span class="total_rounds white--text">Total: {{ totalRounds }} </span> 
          <span class="complete_rounds white--text">Completed: {{ roundsCompleted }}</span> 
        </p>
        <v-layout row wrap>
          <v-flex xs8 offset-xs2 md8 offset-md2 v-for="round in totalRounds" :key="round">
            <v-btn 
              class="round-btn text-xs-center" 
              :class="{green: round<=roundsCompleted, blue:round===roundsCompleted+1}"
              :disabled="round>roundsCompleted+1"
              :to="'tournament/rounds/' + round ">
              Round {{round}}
              </v-btn>
          </v-flex>
        </v-layout>
      </v-flex>

      <v-flex xs10 offset-xs1 md6 offset-md0 id="standings">
        <h5 class="text-xs-center white--text" id='standings-heading'>Standings</h5>
        <v-list id='standings-list'>
          <v-list-tile>
            <v-layout row id="column-headers">
              <v-flex xs3 class="text-xs-center">Standing</v-flex>
              <v-flex xs9 class="text-xs-center">Name</v-flex>
              <v-flex xs3 class="text-xs-center">Score</v-flex>
            </v-layout>
          </v-list-tile>
          <v-list-tile v-for="(player, i) in playerStandings" :key="player.id">
            <v-layout row>
              <v-flex xs3 class="text-xs-center">{{ i+1 }}.</v-flex>
              <v-flex xs9 class="text-xs-center">{{ player.name }}</v-flex>
              <v-flex xs3 class="text-xs-center">{{ player.score }}</v-flex>
            </v-layout>
          </v-list-tile>
        </v-list>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
import axios from 'axios'

export default {
  data: function () {
    return {
      playerStandings: []
    }
  },
  computed: {
    tournamentName () {
      return this.$store.getters.currentTournament.name
    },
    totalRounds () {
      return this.$store.getters.currentTournament.total_rounds
    },
    roundsCompleted () {
      return this.$store.getters.currentTournament.last_concluded_round
    }
  },
  mounted () {
    let tournamentId = this.$store.getters.currentTournament.id
    let userToken = this.$store.getters.user.token
    axios({
      method: 'GET',
      url: this.$store.getters.baseURL + 'api/tournaments/' + tournamentId + '/get-standings',
      headers: {
        Authorization: 'Token ' + userToken
      }
    }).then(response => {
      this.playerStandings = response.data
    })
  }
}
</script>

<style scoped>

.container {
  padding: 20px;
  background-color: rgba(225,165,125,0.7);
  background-size: 100% 100%;
  min-height: 100vh;
}

#tournament-info {
  padding-top: 50px;
}

a {
  text-decoration: none;
  color: darkblue;
}


#tournament-name {
  margin-bottom: 0;
  color: white;
}

#rounds {
  margin-top: 20px;
}

#standings {
  margin-top: 20px;
  padding: 0 20px 20px;
}

#standings-list {
  background: rgb(200, 90, 10);
  /* border: 1px solid green; */
  border-radius: 20px;
}

.round-btn {
  width: 90%;
}

.total_rounds {
  padding-right: 25px;
}

.complete_rounds {
  padding-left: 25px;
}

</style>