<template>
  <Wrangler :data="[{row: 3, name: 'C'},{row: 4, name: 'D'}]" @newData="onNewData"/>
</template>

<script>
import Wrangler from './components/data-wrangler/Wrangler.vue'

export default {
  name: 'App',
  components: {
    Wrangler
  },
  methods: {
    onNewData (newData) {
      console.log('New Data:', newData)
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
