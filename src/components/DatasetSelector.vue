<template>
  <div class="dataset-selector" v-if="this.labels.length > 1">
    Select Active Dataset:

    <select v-model="activeId">
      <option :key="entry.id" v-for="entry in labels" :value="entry.id"> {{ entry.label }} </option>
    </select>
  </div>
</template>

<script>
import dataStore from '../data/dataStore'

const MAX_NAME_LENGTH = 16 // incl one character at the end when trunkating!

export default {
  name: 'DatasetSelector',
  data () {
    return {
      activeId: undefined,
      labels: []
    }
  },
  watch: {
    activeId (newActiveId) {
      if (newActiveId !== undefined) {
        dataStore.setActiveDataset(newActiveId)
      }
    }
  },
  created () {
    dataStore.watchActiveDatasetIds(this.updateActiveId, true)
    dataStore.watchNames(this.updateLabels, true)
  },
  beforeUnmount () {
    dataStore.unwatchActiveDatasetIds(this.updateActiveId)
    dataStore.unwatchNames(this.updateLabels)
  },
  methods: {
    updateActiveId (newActiveIds) {
      if (0 in newActiveIds && newActiveIds[0] !== this.activeId) {
        this.activeId = newActiveIds[0]
      }
    },
    updateLabels (rawLabels) {
      this.labels = [...rawLabels].map(id => {
        let label = id
        if (label.length > MAX_NAME_LENGTH) {
          label = label.substring(0, MAX_NAME_LENGTH - 1) + '…'
        }

        return {
          label,
          id
        }
      })

      // Select first label if currently active label is invalid
      this.checkLabels()
    },
    checkLabels () {
      if ((this.labels.length > 0) && (this.activeId === undefined)) {
        this.activeId = this.labels[0].id
      }
    }
  }
}
</script>

<style lang="css" scoped>
.dataset-selector {
  align-self: center;
  margin-left: auto;
  margin-right: 1rem;
}
</style>
