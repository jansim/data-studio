<template>
  <div v-if="currentlyDragging" class="on-drag-highlight">
    Drop file to load
  </div>
</template>

<script>
import { loadDatasets } from '../data/dataLoader'

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
      event.preventDefault();

      loadDatasets(Array.from(event.dataTransfer.files))

      this.currentlyDragging = false;
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
