<template>
  <Tabs default="viewer">
    <Tab id="viewer" title="Viewer">
      <DataViewer/>
    </Tab>
    <Tab id="wrangler" title="Wrangler">
      <Wrangler :data="[{row: 3, name: 'C'},{row: 4, name: 'D'}]" @newData="onNewData"/>
    </Tab>
  </Tabs>
</template>

<script>
import Tab from './components/Tab.vue'
import Tabs from './components/Tabs.vue'

import Wrangler from './components/data-wrangler/Wrangler.vue'
import DataViewer from './components/DataViewer.vue'

import $data from './$data'

export default {
  name: 'App',
  components: {
    Tab,
    Tabs,
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
