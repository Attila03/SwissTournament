<template>
  <div id="register-tournament">
    <v-container fluid>
      <v-layout row>
        <v-flex xs12 offset-xs0 sm6 offset-sm3>
      
          <v-card id="register-tournament-card">
          <v-layout row>
            <v-flex xs10 offset-xs1 sm6 offset-sm3>
              <v-text-field
                single-line
                name="tournament-name"
                label="Enter Tournament Name"
                v-model="tournamentName"
                id="tournament-name"
              ></v-text-field>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs8 offset-xs1 sm6 offset-sm3>
              <v-text-field
                label="Player Name"
                v-model="playerName"
                id="player-name"
              ></v-text-field>  
            </v-flex>
            <v-flex xs2>
              <v-btn class="green add-btn" @click="addPlayer" title="Add Player">
                <v-icon>add</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>

          

          <div id="errors" v-if="errorText">
            <p>{{errorText}}</p>
          </div>
          
          <v-layout row wrap id="temp-player-list" v-if="this.tempPlayerList.length!=0">
            <v-flex xs8 offset-xs2 class="text-xs-center">
              <h4>{{this.tournamentName}}</h4>
            </v-flex>
            <v-flex xs12 md8 offset-md2>
              <v-layout row wrap>
                <v-flex xs6 class="text-xs-center" v-for="player in tempPlayerList" :key="player">
                  {{player}}
                </v-flex>
              </v-layout>
            </v-flex> 
          </v-layout>

          <v-layout row>
            <v-flex xs12 class="text-xs-center">
              <v-btn class="error"
                id="create-tournament"
                @click="createTournament"
                >Create Tournament</v-btn>
            </v-flex>
          </v-layout>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>

</template>

<script>

export default {
  name: 'RegisterTournament',
  data () {
    return {
      tournamentName: '',
      playerName: '',
      tempPlayerList: [],
      errorText: ''
    }
  },
  methods: {
    addPlayer () {
      if (this.tempPlayerList.includes(this.playerName)) {
        this.errorText = 'Two players cannot have same name'
      } else {
        this.tempPlayerList.push(this.playerName)
        this.playerName = ''
        this.errorText = ''
      }
    },
    createTournament () {
      if (this.tempPlayerList.length === 0) {
        this.errorText = 'You need minimum two players for tournament.'
      } else if (this.tempPlayerList.length % 2 === 1) {
        this.errorText = 'Even number players required for tournament.'
      } else {
        this.$store.dispatch('createTournament', {
          tournamentName: this.tournamentName,
          tempPlayerList: this.tempPlayerList,
          router: this.$router
        })
      }
    }
  }
}
</script>

<style scoped>

#register-tournament {
  background-image: url('https://swisstournament.herokuapp.com/static/images/Home.png');
  background-size: 100% 100%;
  padding-top: 25px;
  min-height: 100vh;
}

#register-tournament-card {
  background-color: rgba(255,255,255,0.7);
  padding-top: 20px;
}


#tournament-created{
  margin: 20px;
}

#errors {
  color: red;
  text-align: center;
}

.add-btn {
  margin-top: 10px;
  margin-left: 10px;
  min-width: 0;
}

#create-tournament {
  margin-top: 20px;
  margin-bottom: 20px;
}


</style>
