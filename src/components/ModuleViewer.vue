<template>
  <div class="module-view">
    <div ref="module"/>
  </div>
</template>

<script>
import $data from '../$data'

const TEMP_FIXED_DATASETKEY = 'test'
const moduleApi = {
  getData () {
    return $data.get(TEMP_FIXED_DATASETKEY)
  },
  setData (newData) {
    $data.set(TEMP_FIXED_DATASETKEY, newData)
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
    $data.watch(TEMP_FIXED_DATASETKEY, (newData) => {
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
</style>
