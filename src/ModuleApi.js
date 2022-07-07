import dataStore from './data/dataStore'
import { loadDataset, loadDatasets, loadDatasetFromText } from './data/dataLoader'

// The interface supplied with which modules can interact
// with the rest of the application
class ModuleApi {
  // Is this module loaded via an iframe?
  iframe = false
  // Reference to the module obejct
  _moduleObject = null
  // Reference to the vueComponentInstance, for interaction with Vue
  _vueComponentInstance = null

  constructor (moduleObject, vueComponentInstance, iframe = false) {
    this._moduleObject = moduleObject
    this._vueComponentInstance = vueComponentInstance

    // Is the Module loaded in an iframe?
    this.iframe = iframe
  }

  /**
   * Retrieve active dataset
   * @returns Currently active dataset
   */
  getData (options) {
    const defaultOptions = {}
    if (this._moduleObject.datasetFormat) {
      defaultOptions.datasetFormat = this._moduleObject.datasetFormat
    }
    if (this._moduleObject.dataFormat) {
      defaultOptions.dataFormat = this._moduleObject.dataFormat
    }
    return dataStore.get({...defaultOptions, ...options})
  }

  /**
   * Set the dataset
   * @param {Object with keys data and info} newDataset The new dataset
   * @param {string} id The id of the new dataset
   *  Defaults to newDataset.info.id or the currently active id.
   */
  setData (newDataset, id = newDataset.info?.id || dataStore.getActiveId()) {
    dataStore.set(id, newDataset)
  }

  /**
   * Load a new dataset
   * @param {*} source The source to load
   * @returns The loaded dataset
   */
  async loadDataset (source) {
    return await loadDataset(source)
  }
  /**
   * Load multiple datasets at once
   * @param {Array<*>} sources Array of Sources
   * @returns Array of Datasets
   */
  async loadDatasets (sources) {
    return await loadDatasets(sources)
  }
  /**
   * Load a new dataset from raw text
   * @param {*} options An object with more information about the data (e.g. title, description)
   * @param {String} options.textData The raw text data to parse
   * @returns The loaded dataset
   */
   loadDatasetFromText (options) {
    return loadDatasetFromText(options)
  }

  /**
   * Change the view to activate and show a different module
   * @param {*} newViewId Module Id to show
   */
  setActiveModule (newViewId) {
    this._vueComponentInstance.$emit('setActiveModule', newViewId)
  }
}

export default ModuleApi
