<template>
  <div :id="`module-${module.id}`" class="module-view">
    <div ref="module"/>
  </div>
</template>

<script>
import dataStore from '../data/dataStore'
import { loadDatasets } from '../data/dataLoader'

const TEMP_FIXED_DATASETKEY = 'test'
// The interface supplied with which modules can interact
// with the rest of the application
const moduleApi = {
  _moduleViewerInstance: null,

  getData () {
    return dataStore.get(TEMP_FIXED_DATASETKEY)
  },
  setData (newData) {
    dataStore.set(TEMP_FIXED_DATASETKEY, newData)
  },
  loadDatasets (sources) {
    loadDatasets(sources)
  },
  setActiveModule (newViewId) {
    this._moduleViewerInstance.$emit('setActiveModule', newViewId)
  }
}

export default {
  name: 'ModuleViewer',
  props: {
    module: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      loadedModule: undefined
    }
  },
  mounted () {
    moduleApi._moduleViewerInstance = this

    this.module.load().then((loadedModule) => {
      this.loadedModule = loadedModule.default

      this.loadedModule.mount(this.$refs.module, moduleApi)
    })

    // TODO: unregister this listener!
    dataStore.watch(TEMP_FIXED_DATASETKEY, (newData) => {
      if (this.loadedModule) {
        this.loadedModule.onDataChange(newData)
      }
    }, false)
  },
  unmounted () {
    if (this.loadedModule) {
      this.loadedModule.unmount()

      this.loadedModule = undefined
    }
  }
}
</script>

<style lang="css" scoped>
.module-view {
  flex-grow: 1;

  padding: 10px;
}
</style>
