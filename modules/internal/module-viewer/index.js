import { createApp } from 'vue'

import DatasetViewer from './DatasetViewer.vue'

let app
let vm

export default {
  mount (element, moduleApi) {
    app = createApp(DatasetViewer)

    app.provide('moduleApi', moduleApi)

    vm = app.mount(element)

    console.log(app)
  },

  unmount (element) {
    app.unmount()
  },

  onDataChange () {
    vm.updateData();
  }
}