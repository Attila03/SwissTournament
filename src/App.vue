<template>
  <v-app>
    <navigation></navigation>
    <router-view></router-view>
  </v-app>
</template>

<script>
import Navigation from './components/Navigation.vue'

export default {
  name: 'app',
  components: {
    'navigation': Navigation
  }
}
</script>

<style lang="stylus">
  @import './stylus/main'
</style>