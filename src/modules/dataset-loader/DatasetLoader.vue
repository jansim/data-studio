<template>
  <div>
    There are multiple ways here to load data. You can...

    <ol>
      <li>Drag and Drop a CSV, TSV or JSON file to load it anytime.</li>
      <li>Enter a URL <input v-bind="url" type="text" name="url-to-load" id="url-to-load"> and click <button @click="loadURL">here</button> to load it. <br> Supported file types are CSV, TSV and JSON. Excel file support is planned in the future.</li>
      <!-- <li>Select a dataset from the data library below.</li> -->
    </ol>
  </div>
</template>

<script>
export default {
  name: 'DatasetLoader',
  inject: ['moduleApi'],
  data () {
    return {
      url: ''
    }
  },
  methods: {
    loadURL () {
      this.moduleApi.loadDatasets(this.url)

      this.goToViewer()
    },
    goToViewer () {
      this.moduleApi.setActiveModule('viewer')
    }
  }
}
</script>

<style lang="css" scoped>
</style>
