const libvoyager = require('datavoyager')

var voyagerInstance

export default {
  async mount(element, moduleApi) {
    var config = {
      showDataSourceSelector: false,
      hideHeader: true,
      hideFooter: true
    }
    voyagerInstance = libvoyager.CreateVoyager(element, config, undefined)

    const data = await moduleApi.getData()
    this.onDataChange(data)
  },

  unmount(element, moduleApi) {
    voyagerInstance = undefined
  },

  onDataChange(newData) {
    voyagerInstance.updateData({values: newData})
  }
}
