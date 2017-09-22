<template>
  <div>
    <v-navigation-drawer v-model="sideNav" temporary>
      <v-toolbar>
        <v-list>
          <v-list-tile to="/register-tournament">
            <v-list-tile-action>
              <v-icon>home</v-icon>
            </v-list-tile-action>
            <v-list-tile-content >Swiss Tourney</v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-list>
        <v-list-tile v-for="item in menuItems" :key="item.title" :to="item.link">
          <v-list-tile-action>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{item.title}}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="userLoggedIn" @click="logout">
          <v-list-tile-action>
            <v-icon>power_settings_new</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Logout</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar dark class="brown darken-3">
      <v-toolbar-side-icon @click.stop="sideNav = !sideNav" class="hidden-sm-and-up"></v-toolbar-side-icon>
      
        <v-toolbar-title><router-link to="/register-tournament" tag="span" exact>Swiss Tourney</router-link></v-toolbar-title>
      
      
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat v-for="(item, i) in menuItems" :to="item.link" exact :key="i">
          <v-icon left>{{item.icon}}</v-icon>
          {{item.title}}
        </v-btn>
        <v-btn flat v-if="userLoggedIn" @click="logout">
          <v-icon left>power_settings_new</v-icon>
          Logout
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<script>

export default {
  data () {
    return {
      sideNav: false
    }
  },
  methods: {
    logout () {
      this.$store.commit('resetState')
      this.$router.push('/')
    }
  },
  computed: {
    userLoggedIn () {
      return !(this.$store.getters.user === null)
    },
    menuItems () {
      if (this.userLoggedIn) {
        return [
          // {icon: 'group_add', title: 'Register Players', link: '/register-players'},
          {icon: 'info', title: 'Tourney Info', link: '/tournament-info'},
          {icon: 'event_note', title: 'Tournaments', link: '/tournaments'}
        ]
      } else {
        return [
          {icon: 'person_add', title: 'Sign Up', link: '/signup'},
          {icon: 'perm_identity', title: 'Log In', link: '/login'}
        ]
      }
    }
  }
}
</script>

<style scoped>

.toolbar__title > span {
  cursor: pointer;
}


</style>
