const TEMP_FIXED_DATASETKEY = 'test'

import dataStore from './data/dataStore'
import { loadDatasets } from './data/dataLoader'

// The interface supplied with which modules can interact
// with the rest of the application
class ModuleApi {
  iframe
  _moduleViewerInstance = null

  constructor (moduleViewerInstance, iframe = false) {
    // Reference to moduleViewerInstance, for interaction with Vue
    this._moduleViewerInstance = moduleViewerInstance

    // Is the Module loaded in an iframe?
    this.iframe = iframe
  }

  getData () {
    return dataStore.get(TEMP_FIXED_DATASETKEY)
  }

  setData (newData) {
    dataStore.set(TEMP_FIXED_DATASETKEY, newData)
  }

  loadDatasets (sources) {
    loadDatasets(sources)
  }

  setActiveModule (newViewId) {
    this._moduleViewerInstance.$emit('setActiveModule', newViewId)
  }
}

export default ModuleApi
