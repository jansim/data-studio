<template>
  <DataViewer/>
  <Wrangler :data="[{row: 3, name: 'C'},{row: 4, name: 'D'}]" @newData="onNewData"/>
</template>

<script>
import Wrangler from './components/data-wrangler/Wrangler.vue'
import DataViewer from './components/DataViewer.vue'

import $data from './$data'

export default {
  name: 'App',
  components: {
    Wrangler,
    DataViewer
  },
  methods: {
    onNewData (newData) {
      console.log('New Data:', newData)

      $data.set('test', newData)
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
