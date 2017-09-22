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
        'http://aboutcagayandeoro.com/wp-content/uploads/2016/07/2016-Barangay-Carmen-Fiesta-Chess-Tournament.jpg',
        'http://static.dnaindia.com/sites/default/files/styles/half/public/2016/06/04/467804-chesss.jpg?itok=CHbJ6I6f',
        'http://media4.gradskissnis.rs/2016/04/chess-tournament.jpg',
        'https://i2.wp.com/africachess.net/wp-content/uploads/2017/08/pexels-photo-333889.jpeg?resize=800%2C445&ssl=1'
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