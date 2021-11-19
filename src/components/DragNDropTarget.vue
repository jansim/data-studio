<template>
  <div v-if="currentlyDragging" class="on-drag-highlight">
    Drop file to load
  </div>
</template>

<script>
import { fromCSV } from 'arquero'

import dataStore from '../data/dataStore'

const TEMP_FIXED_DATASETKEY = 'test'

export default {
  name: 'DragNDropTarget',
  props: {

  },
  data () {
    return {
      currentlyDragging: false
    }
  },
  created () {
    document.addEventListener('dragover', this.onDragOver)
    document.addEventListener('drop', this.onDrop)
  },
  unmounted () {
    document.removeEventListener('dragover', this.onDragOver)
    document.removeEventListener('drop', this.onDrop)
  },
  methods: {
    onDragOver (event) {
      event.preventDefault();

      this.currentlyDragging = true;
    },
    onDrop (event) {
      console.log(event)
      event.preventDefault();
      console.log(event.dataTransfer.files)

      this.loadDatasets(event.dataTransfer.files)

      this.currentlyDragging = false;
    },

    async loadDatasets (fileList) {
      // TODO: Handle URLs here
      const dataset = await this.loadFile(fileList)

      // TODO: Use arquero for dataframes
      dataStore.set(TEMP_FIXED_DATASETKEY, dataset.objects())
    },

    // TODO: Outsource this into a separate fucntion
    async loadFile (fileList) {
      // TODO: handle multiple files; possibly support streaming loading of data
      const file = fileList[0]

      const data = fromCSV(await file.text())
      console.log(data)

      return data
    }
  }
}
</script>

<style lang="css" scoped>
.on-drag-highlight {
  position: absolute;
  top: 1rem;
  right: 1rem;
  bottom: 1rem;
  left: 1rem;

  border: 2px dashed #5292f7;
  background-color: rgba(255,255,255, .75);
  border-radius: 2rem;

  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
