<template>
  <div class="dataset-viewer">
    <div class="top-bar">
      <span class="dataset-id"> {{info.id}} </span>

      <button @click="showInfo = !showInfo">
        <span v-if="!showInfo">Show</span>
        <span v-else>Hide</span>
        more info
      </button>

      <div class="info" v-show="showInfo">
        <h2 v-if="info.title"> Name: {{info.title}} </h2>
        <p v-if="info.description"> Description: {{info.description}} </p>
      </div>
    </div>

    <div class="table-container">
      <Tabulator :key="info.id" v-if="data" :data="data" />
    </div>
  </div>
</template>

<script>
import Tabulator from './Tabulator.vue'

export default {
  name: 'DatasetViewer',

  inject: ['moduleApi'],

  components: {
    Tabulator
  },

  data () {
    return {
      showInfo: false,
      data: undefined
    }
  },

  created () {
    this.updateData();
  },

  methods: {
    updateData () {
      const { data, info } = this.moduleApi.getData()

      this.info = info;
      this.data = data;
    }
  }
}
</script>

<style lang="css" scoped>
.dataset-viewer {
  box-sizing: border-box;
  display: flex;
  padding: 1rem;
  flex-direction: column;
  height: 100%;
}

.top-bar {
  padding-bottom: 1rem;
}

.table-container {
  flex: 1 1 100%;
  overflow: hidden;
}

.dataset-id {
  font-weight: bold;
  margin-right: 1rem;
}
</style>
