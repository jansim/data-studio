<template>
  <div :id="`module-${module.id}`" class="module-view">
    <div ref="module"/>
  </div>
</template>

<script>
import dataStore from '../data/dataStore'

const TEMP_FIXED_DATASETKEY = 'test'
const moduleApi = {
  getData () {
    return dataStore.get(TEMP_FIXED_DATASETKEY)
  },
  setData (newData) {
    dataStore.set(TEMP_FIXED_DATASETKEY, newData)
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
