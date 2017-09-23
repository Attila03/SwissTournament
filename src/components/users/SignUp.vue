<template>
  <v-container fluid id="signup">
    <v-layout row v-if="error">
      <v-flex xs10 offset-xs1 sm6 offset-sm3>
        <app-errors :error="error" @clearError="clearError"></app-errors>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs10 offset-xs-1 sm6 offset-sm3>
        <v-card id="signup-card">
          <v-card-text>
            <form @submit.prevent="onSignUp">
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field name="username" label="Username" id="username" v-model="username"></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field name="email" label="Email" id="email" v-model="email"></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field name="password" label="Password" id="password" v-model="password" type="password"></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field 
                    name="confirmPassword" 
                    label="Confirm Password" 
                    id="confirmPassword" 
                    v-model="confirmPassword" 
                    type="password"
                    :rules="[comparePasswords]"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 class="text-xs-center">
                  <v-btn class="text-xs-center green" type="submit">Submit</v-btn>
                </v-flex>
              </v-layout>
            </form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout> 
  </v-container>
</template>

<script>
import querystring from 'querystring'
import axios from 'axios'

export default {
  data () {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      error: ''
    }
  },
  methods: {
    clearError () {
      this.error = ''
    },
    onSignUp () {
      axios({
        method: 'POST',
        url: this.$store.getters.baseURL + 'accounts/registration/',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        },
        data: querystring.stringify({
          'username': this.username,
          'password': this.password,
          'email': this.email
        })
      }).then((response) => {
        if (response.data.error) {
          this.error = response.data.error
        } else {
          this.error = ''
          this.$store.commit('setUser', {
            'id': response.data.id,
            'username': response.data.username,
            'token': response.data.auth_token.key
          })
          this.$router.push('/')
        }
      })
    }
  },
  computed: {
    comparePasswords () {
      return this.password !== this.confirmPassword ? 'Passwords do not match' : true
    }
  }
}

</script>


<style scoped>

#signup{
  background-image: url("https://swisstournament.herokuapp.com/static/images/Home.png");
  background-size: 100% 100vh;
  padding-top: 25px;
  min-height: 100vh;
}

#signup-card {
  background-color: rgba(255,255,255,0.7)
}

</style>