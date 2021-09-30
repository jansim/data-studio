class DataPlugin {
  datastore = {}
  listeners = {}

  checkListener (name) {
    // Init new array for listeners
    if (!(name in this.listeners)) {
      this.listeners[name] = []
    }
  }

  set (name, data) {
    const isNewData = !(name in this.datastore)
    this.datastore[name] = data

    if (isNewData) { this.notifyNameListeners() }

    this.checkListener(name)

    this.notifyListeners(name)
  }
  get (name) {
    if (name in this.datastore) {
      return this.datastore[name]
    } else {
      return undefined
    }
  }
  delete(name) {
    delete this.datastore[name]
    delete this.listeners[name]

    this.notifyNameListeners()
  }

  watch (name, callback, immediate = true) {
    this.checkListener(name)
    this.listeners[name].push(callback)

    if (immediate) {
      callback(this.get(name))
    }
  }
  notifyListeners (name) {
    const data = this.get(name)
    this.listeners[name].forEach(callback => callback(data))
  }

  getNames () {
    return Object.keys(this.datastore)
  }
  nameListeners = []
  watchNames (callback, immediate = true) {
    this.nameListeners.push(callback)

    if (immediate) {
      callback(this.getNames())
    }
  }
  notifyNameListeners () {
    this.nameListeners.forEach(callback => callback(this.getNames()))
  }
}

const $data = new DataPlugin()
export default $data
