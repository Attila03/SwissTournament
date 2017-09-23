<template>
  <v-container fluid id="login">

    <v-layout row v-if="error" id="login-error">
      <v-flex xs10 offset-xs1 sm6 offset-sm3>
        <app-errors :error="error" @clearError="clearError"></app-errors>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs10 offset-xs1 sm6 offset-sm3>
        <v-card id="login-card">
          <v-card-text>
            <form @submit.prevent="onLogin">
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field name="username" label="Username" id="username" v-model="username"></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field name="password" label="Password" id="password" v-model="password" type="password"></v-text-field>
                </v-flex>
                <v-flex xs12 class="text-xs-center">
                  <v-btn type="submit" class="green"  >Submit</v-btn>
                </v-flex>
              </v-layout>
            </form>
            <v-layout>
              <v-flex xs12 class="text-xs-center">
                <router-link to="/signup" id="register-link">Haven't signed up? Click to register</router-link>
              </v-flex>
            </v-layout>
            
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout> 
    <v-layout row id="dummy-user">
      <v-flex xs12 class="text-xs-center">
        <v-btn @click="showDummy = !showDummy">Dummy User</v-btn>
        <div v-if="showDummy">
          <p>Username: Attila</p>
          <p>Password: password</p>
        </div>
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
      password: '',
      error: '',
      showDummy: false
    }
  },
  methods: {
    clearError () {
      this.error = ''
    },
    onLogin () {
      this.$store.commit('setLoading', true)
      axios({
        method: 'POST',
        url: 'http://127.0.0.1:8000/accounts/login/',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        },
        data: querystring.stringify({
          'username': this.username,
          'password': this.password
        })
      }).then(response => {
        if (response.data.error) {
          this.error = response.data.error
        } else {
          this.error = ''
          this.$store.commit('setUser', {
            'id': response.data.id,
            'username': response.data.username,
            'token': response.data.auth_token.key
          })
          this.$router.push('/register-tournament')
        }
      })
    }
  }
}

</script>

<style scoped>
  
 #login {
  background-image: url("https://swisstournament.herokuapp.com/static/images/Home.png");
  background-size: 100% 100vh;
  padding-top: 25px;
  min-height: 100vh;
}

#login-card {
  background-color: rgba(255,255,255,0.7);
}

#login-error {
  opacity: 0.9;
}

#register-link {
  display: inline-block;
  margin: 10px auto;
  text-decoration: none;
  color: darkblue;
}

#dummy-user {
  margin: 20px;
}

p {
  color: white;
}



</style>