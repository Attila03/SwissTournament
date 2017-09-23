<template>
  <v-container fluid id="tournaments">

    <v-layout row wrap>
      <v-flex xs8 offset-xs2 md4 offset-md1 
        v-for="tournament in tournaments" 
        :key="tournament.id" 
        class="text-xs-center tournament">
        <v-card >
          <v-card-media 
            :src="randomImageURL()"
            height="150px">
            </v-card-media>
          <v-card-title aligncenter class="white--text orange">
            <h6>{{tournament.name}}</h6>
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat @click="loadTournament(tournament.id)" class="orange--text">Load Tourney</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>

import axios from 'axios'

export default {
  data () {
    return {
      tournaments: [],
      cardImagesURL: [
        this.$store.getters.baseURL + 'static/images/card_1.jpg',
        this.$store.getters.baseURL + 'static/images/card_2.jpg',
        this.$store.getters.baseURL + 'static/images/card_3.jpg',
        this.$store.getters.baseURL + 'static/images/card_4.jpg',
        this.$store.getters.baseURL + 'static/images/card_5.jpg'
      ]
    }
  },
  methods: {
    loadTournament (tournamentId) {
      let tournamentToLoad = this.tournaments.filter((tournament) => {
        return tournament.id === tournamentId
      })[0]
      this.$store.commit('setTournament', tournamentToLoad)
      this.$router.push('/tournament-info')
    },
    randomImageURL () {
      let randomNum = Math.floor(Math.random() * this.cardImagesURL.length)
      return this.cardImagesURL[randomNum]
    }
  },
  mounted () {
    let userToken = this.$store.getters.user.token
    axios({
      method: 'GET',
      url: 'http://127.0.0.1:8000/api/tournaments/user/' + this.$store.getters.user.id,
      headers: {
        Authorization: 'Token ' + userToken
      }
    }).then((response) => {
      this.tournaments = response.data
    }).catch((error) => {
      console.log(error)
    })
  }
}

</script>

<style scoped>

.tournament {
  margin-bottom: 20px;
}

#tournaments {
  background-color: rgba(225,165,125,0.7);
}

.card__title {
  padding-bottom: 0;
  padding-top: 10px;
}

.card__actions {
  padding-top: 0;
  padding-bottom: 0;
}

</style>