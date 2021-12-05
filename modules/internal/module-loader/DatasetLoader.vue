<template>
  <div class="data-loader">
    <div class="intro">
      There are multiple ways here to load data. You can...

      <ol>
        <li>Drag and Drop a file to load it anytime.</li>
        <li>Enter a URL <input v-model="url" type="text" name="url-to-load" id="url-to-load"> and click <button @click="loadURL(url)">here</button> to load it. <br> Supported file types are CSV, TSV, JSON and <a title="Apache Arrow IPC Stream Format">Arrow</a>. Excel file support is planned in the future.</li>
        <li>Select a dataset from the data library below.</li>
      </ol>
    </div>

    <DataLibrary @load="loadURL($event.url)"/>
  </div>
</template>

<script>
import DataLibrary from './DataLibrary.vue'

export default {
  name: 'DatasetLoader',
  inject: ['moduleApi'],
  components: {
    DataLibrary
  },
  data () {
    return {
      url: ''
    }
  },
  methods: {
    loadURL (url) {
      this.moduleApi.loadDatasets([url])

      this.goToViewer()
    },
    goToViewer () {
      this.moduleApi.setActiveModule('viewer')
    }
  }
}
</script>

<style lang="css" scoped>
.data-loader {
  max-height: 100%;
  overflow: auto;

  padding: 0.75rem;
}
</style>
