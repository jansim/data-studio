<template>
  <div>
    Datasets: {{ datasets }}

    Data: {{ data }}
  </div>

  <div ref="table"> </div>
</template>

<script>
import "frappe-datatable/dist/frappe-datatable.min.css";

import DataTable from "frappe-datatable";

import $data from '../$data'

// TODO: better handling of tableInstance?
let tableInstance

export default {
  name: 'DataViewer',
  data () {
    return {
      datasets: [],
      data: undefined
    }
  },
  watch: {
    data (newData) {
      tableInstance.refresh(newData, this.getColumns(this.data))
    }
  },
  mounted () {
    // Register data listeners
    $data.watch('test', (data) => {
      this.data = data
    })
    $data.watchNames((datasetNames) => {
      this.datasets = datasetNames
    })

    // Load Table (manually for now)
    tableInstance = new DataTable(this.$refs.table, {
      columns: this.getColumns(this.data),
      data: this.data || []
    });
  },
  unmounted () {
    // TODO: unregister watcher
    tableInstance = undefined
  },
  methods: {
    // ToDo: properly handle column information (maybe via arquero DF?)
    getColumns (data) {
      if (!data || data.length === 0) {
        return []
      }
      return Object.keys(data[1])
    }
  }
}
</script>

<style lang="css" scoped>
</style>
