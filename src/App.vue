<template>
  <Tabs default="viewer">
    <Tab :id="module.id" :isActive="index === activeModuleIndex" :key="`tab-${module.id}`" :title="module.name" v-for="(module, index) in modules" @select="activeModuleIndex = index" />
  </Tabs>

  <module-viewer :key="activeModule.id" :module="activeModule"/>

  <DragNDropTarget/>
</template>

<script>
import "./global.css"

import Tab from './components/Tab.vue'
import Tabs from './components/Tabs.vue'

import ModuleViewer from './components/ModuleViewer.vue'
import DragNDropTarget from './components/DragNDropTarget.vue'

import modules from './modules'

import $data from './$data'

export default {
  name: 'App',
  components: {
    Tab,
    Tabs,
    ModuleViewer,
    DragNDropTarget
  },
  data () {
    return {
      modules: modules,
      activeModuleIndex: 0
    }
  },
  computed: {
    activeModule () {
      return this.modules[this.activeModuleIndex]
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

  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: stretch;
}
</style>
