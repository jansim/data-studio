// TODO: Use arquero dataframes for the dataStore and add column information in the info object
import { from } from 'arquero'

class DataStore {
  store = {}
  listeners = {}

  /**
   * Checks and ensures that the listener array for a dataset id exists
   * @param {string} id Dataset id
   */
  checkListener (id) {
    // Init new array for listeners
    if (!(id in this.listeners)) {
      this.listeners[id] = []
    }
  }

  /**
   * Set / add a new dataset to the store
   * @param {string} id Dataset id
   * @param {Dataset} data The dataset to be added / set
   * @param {object} info Optional info object (will be merged w/ dataset)
   */
  set (id, data, info = { }) {
    const isNewData = !(id in this.store)

    // Data can be either an array of values or a prepared dataset object
    const dataset = Array.isArray(data) ? {
      data,
      info
    } : data
    // Ensure id is always set in datasets
    if (!('id' in dataset.info)) {
      dataset.info.id = id
    }
    this.store[id] = dataset

    if (isNewData) { this.notifyNameListeners() }

    this.checkListener(id)

    this.notifyListeners(id)
  }
  /**
   * Retrieve a dataset from the store. Defaults to the active dataset.
   * @param {string} id Dataset id (optional, defaults to active Id)
   * @param {string} datasetFormat The format in which the dataset should be returned.
   *   Possible Values:
   *    - 'data-only': Only the dataset itself (default)
   *    - 'data-with-info': Returns an object with the data itself (data) and meta information (info)
   * @param {string} dataFormat The format in which the data within dataset is expected.
   *   Possible Values:
   *    - 'array-of-objects': An array of JS objects corresponding to rows (default)
   *    - 'object-with-arrays': A JS object with columns for arrays
   * @returns Dataset
   *  A dataset is always a JS object with a
   */
  get ({id = null, datasetFormat = 'data-only', dataFormat = 'array-of-objects'} = {}) {
    if (id === null) {
      id = this.getActiveId()
    }

    if (id in this.store) {
      const dataset = this.store[id]
      const unconvertedData = dataset.data

      // Convert data if necessary
      var data
      switch (dataFormat) {
        case 'array-of-objects':
          data = unconvertedData;
          break;
        case 'object-with-arrays':
          data = Object.fromEntries(
            Object.entries(
              from(unconvertedData).columns()
            ).map(([colname, values]) => [colname, values.data])
          )
          break;
        default:
          console.error('Unsupported dataFormat.')
          break;
      }

      if (datasetFormat === 'data-only') {
        return data
      } else if (datasetFormat === 'data-with-info') {
        return {
          ...dataset,
          data
        }
      } else {
        throw `Unsupported datasetFormat option ${datasetFormat}`
      }
    } else {
      return undefined
    }
  }
  /**
   * Delete a dataset from the store
   * @param {string} id Dataset id
   */
  delete(id) {
    delete this.store[id]
    delete this.listeners[id]

    this.notifyNameListeners()
  }

  watch (id, callback, immediate = true) {
    this.checkListener(id)
    this.listeners[id].push(callback)

    if (immediate) { this.call(id, callback) }
  }
  unwatch (id, callback) {
    this.listeners[id].splice(this.listeners[id].indexOf(callback), 1)
  }
  notifyListeners (id) {
    this.listeners[id].forEach(callback => this.call(id, callback))

    if (id === this.getActiveId()) {
      // Dataset is currently active, so notify all active dataset listeners
      this.notifyActiveDatasetListeners()
    }
  }
  call (id, callback) {
    const dataset = this.get(id)
    callback(dataset)
  }

  // Note: using an array for activeDatasetIds here, to possibly support
  // multiple simultaneously active datasets in the future
  activeDatasetIds = []
  setActiveDataset(id, index = 0) {
    if (0 in this.activeDatasetIds && this.activeDatasetIds[0] === id) {
      // Don't do anything if it's the same dataset!
      return
    }

    this.activeDatasetIds[0] = id
    this.notifyActiveDatasetIdsListeners()
    this.notifyActiveDatasetListeners()
  }
  activeDatasetListeners = []
  watchActiveDataset (callback, immediate = true) {
    this.activeDatasetListeners.push(callback)

    if (immediate) { this.call(id, callback) }
  }
  unwatchActiveDataset (callback) {
    this.activeDatasetListeners.splice(this.activeDatasetListeners.indexOf(callback), 1)
  }
  notifyActiveDatasetListeners () {
    this.activeDatasetListeners.forEach(callback => this.callActiveDataset(callback))
  }
  callActiveDataset (callback) { this.call(this.getActiveId(), callback) }
  getActiveId () {
    // Return currently active dataset by default
    if (0 in this.activeDatasetIds) {
      return this.activeDatasetIds[0]
    } else {
      // Else default to using last id
      const ids = this.getNames()
      if (ids.length > 0) {
        return ids[ids.length - 1]
      }
    }
    return null
  }

  activeDatasetIdsListeners = []
  watchActiveDatasetIds (callback, immediate = true) {
    this.activeDatasetIdsListeners.push(callback)

    if (immediate) {
      callback(this.activeDatasetIds)
    }
  }
  unwatchActiveDatasetIds (callback) {
    this.activeDatasetIdsListeners.splice(this.activeDatasetIdsListeners.indexOf(callback), 1)
  }
  notifyActiveDatasetIdsListeners () {
    this.activeDatasetIdsListeners.forEach(callback => callback(this.activeDatasetIds))
  }

  getNames () {
    return Object.keys(this.store)
  }
  nameListeners = []
  watchNames (callback, immediate = true) {
    this.nameListeners.push(callback)

    if (immediate) {
      callback(this.getNames())
    }
  }
  unwatchNames (callback) {
    this.nameListeners.splice(this.nameListeners.indexOf(callback), 1)
  }
  notifyNameListeners () {
    this.nameListeners.forEach(callback => callback(this.getNames()))
  }
}

const dataStore = new DataStore()
export default dataStore
