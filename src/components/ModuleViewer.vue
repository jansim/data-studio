<template>
  <div :id="`module-${module.id}`" class="module-view" ref="module" />
</template>

<script>
import dataStore from '../data/dataStore'
import ModuleApi from '../ModuleApi'

const TEMP_FIXED_DATASETKEY = 'test'

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
    const moduleApi = new ModuleApi(this)

    this.module.load().then((loadedModule) => {
      this.loadedModule = loadedModule.default

      this.loadedModule.mount(this.$refs.module, moduleApi)
    })

    dataStore.watch(TEMP_FIXED_DATASETKEY, this.onDataChange, false)
  },
  beforeUnmount () {
    if (this.loadedModule) {
      this.loadedModule.unmount(this.$refs.module)

      this.loadedModule = undefined
    }

    dataStore.unwatch(TEMP_FIXED_DATASETKEY, this.onDataChange)
  },
  methods: {
    onDataChange (newData) {
      if (this.loadedModule) {
        this.loadedModule.onDataChange(newData)
      }
    }
  }
}
</script>

<style lang="css" scoped>
.module-view {
  /* MH0 is used here, to make sure the module-view doesn't overflow */
  min-height: 0;
  flex-grow: 1;
}
</style>
