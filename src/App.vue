<template>
  <Tabs default="viewer">
    <TabGroup :name="group.group_name" :key="group.group_name" v-for="group in moduleGroups">
      <Tab :id="module.id" :isActive="module.id === activeModule.id" :key="`tab-${module.id}`" :title="module.name" v-for="module in group.modules" @select="setActiveModuleId(module.id)" />
    </TabGroup>
  </Tabs>

  <module-viewer v-if="!activeModule.iframe" :key="activeModule.id" :module="activeModule" @setActiveModule="setActiveModuleId"/>
  <module-frame v-else :key="activeModule.id" :module="activeModule" @setActiveModule="setActiveModuleId"/>

  <DragNDropTarget/>
</template>

<script>
import "./global.css"

import Tab from './components/Tab.vue'
import Tabs from './components/Tabs.vue'
import TabGroup from './components/TabGroup.vue'

import ModuleViewer from './components/ModuleViewer.vue'
import ModuleFrame from './components/ModuleFrame.vue'
import DragNDropTarget from './components/DragNDropTarget.vue'

import { moduleGroups, modules } from '../modules'

import dataStore from './data/dataStore'

export default {
  name: 'App',
  components: {
    Tab,
    Tabs,
    TabGroup,
    ModuleViewer,
    ModuleFrame,
    DragNDropTarget
  },
  data () {
    return {
      modules,
      moduleGroups,
      activeModuleIndex: 0
    }
  },
  computed: {
    activeModule () {
      return this.modules[this.activeModuleIndex]
    }
  },
  mounted () {
    dataStore.set('test', [{row: 3, name: 'C'},{row: 4, name: 'D'}])
  },
  methods: {
    setActiveModuleId (newModuleId) {
      let targetIndex
      for (let index = 0; index < this.modules.length; index++) {
        if (this.modules[index].id === newModuleId) {
          targetIndex = index
          break
        }
      }
      this.activeModuleIndex = targetIndex
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

  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: stretch;
}
</style>
