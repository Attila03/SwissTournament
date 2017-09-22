<template>
  <v-alert error dismissible :value="true" @input="onClose">
    {{ error }}
  </v-alert>
</template>

<script>
export default {
  props: ['error'],
  methods: {
    onClose () {
      this.$emit('clearError')
    }
  }
}
</script>
