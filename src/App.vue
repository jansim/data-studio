<template>
  <Tabs default="viewer">
    <Tab :id="module.id" :key="module.id" :title="module.name" v-for="module in modules">
      <module-viewer :module="module"/>
    </Tab>
  </Tabs>
</template>

<script>
import Tab from './components/Tab.vue'
import Tabs from './components/Tabs.vue'

import ModuleViewer from './components/ModuleViewer.vue'

import modules from './modules'

import $data from './$data'

export default {
  name: 'App',
  components: {
    Tab,
    Tabs,
    ModuleViewer
  },
  data () {
    return {
      modules: modules
    }
  },
  mounted () {
    $data.set('test', [{row: 3, name: 'C'},{row: 4, name: 'D'}])
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
