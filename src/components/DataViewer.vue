<template>
  <div>
    Datasets: {{ datasets }}

    Data: {{ data }}
  </div>
</template>

<script>
import $data from '../$data'

export default {
  name: 'DataViewer',
  data () {
    return {
      datasets: [],
      data: undefined
    }
  },
  mounted () {
    $data.watch('test', (data) => {
      this.data = data
    })
    $data.watchNames((datasetNames) => {
      this.datasets = datasetNames
    })
  }
}
</script>

<style lang="css" scoped>
</style>
