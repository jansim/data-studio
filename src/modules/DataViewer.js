import "frappe-datatable/dist/frappe-datatable.min.css"

import DataTable from "frappe-datatable"

let tableInstance

function getColumns (data) {
  if (!data || data.length === 0) {
    return []
  }
  return Object.keys(data[1])
}

export default {
  mount (element, moduleApi) {
    const data = moduleApi.getData()

    tableInstance = new DataTable(element, {
      columns: getColumns(data),
      data: data
    })
  },

  unmount (element) {
    tableInstance = undefined
  },

  onDataChange (newData) {
    tableInstance.refresh(newData, getColumns(newData))
  }
}