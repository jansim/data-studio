import { createApp } from 'vue'

import DatasetLoader from './DatasetLoader.vue'

let instance

export default {
  mount (element, moduleApi) {
    instance = createApp(DatasetLoader)

    instance.provide('moduleApi', moduleApi)

    instance.mount(element)
  },

  unmount (element) {
    instance.unmount()
  },

  onDataChange (newData) {
    // Do nothing...
  }
}