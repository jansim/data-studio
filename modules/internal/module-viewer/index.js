import "frappe-datatable/dist/frappe-datatable.min.css"

import DataTable from "frappe-datatable"

import "./viewer.css"

import {
  getTextWidthInElement
} from './textWidth.js'

let tableInstance

function getColumns (data) {
  if (!data || data.length === 0) {
    return []
  }

  // TODO: Make these methods more robust

  // Take the column labels from the first row
  const columnNames = Object.keys(data[0])

  // Get the first couple of entries and use the longest strings there
  const longestValues = Object.fromEntries(columnNames.map((value) => [value, value]))
  for (let index = 0; (index < data.length || index < 11); index++) {
    const row = data[index]
    for (let [key, value] of Object.entries(row)) {
      const val = String(value)
      if (val && (!longestValues[key] || val.length > longestValues[key].length)) {
        longestValues[key] = val
      }
    }
  }

  // Frappe-datatable provides very narrow columns out of the box,
  // so adding some logic here to compensate for the fact
  const dummyElement = document.createElement('span')
  dummyElement.classList.add('.dt-cell--header')
  const nestedDummyElement = document.createElement('span')
  nestedDummyElement.classList.add('.dt-cell__content')
  nestedDummyElement.appendChild(dummyElement)

  // Construct column objects from names
  return columnNames.map(name => {
    return {
      name,
      width: getTextWidthInElement(longestValues[name], nestedDummyElement) * 1.4 + 30
    }
  })
}

// Info Rendering
const infoTitle = document.createElement('h1')
const infoDescription = document.createElement('p')
const infoElement = document.createElement('div')
infoElement.classList.add('dataset-info')
infoElement.appendChild(infoTitle)
infoElement.appendChild(infoDescription)

function renderInfo (info) {
  infoTitle.innerText = info.title
  infoDescription.innerText = info.description
}

export default {
  mount (element, moduleApi) {
    const { data, info } = moduleApi.getData({format: 'data-with-info'})

    element.appendChild(infoElement)
    renderInfo(info)

    const tableElement = document.createElement('div')
    element.appendChild(tableElement)

    tableInstance = new DataTable(tableElement, {
      columns: getColumns(data),
      data: data,
      serialNoColumn: false
    })
  },

  unmount (element) {
    tableInstance = undefined

    // Remove all contents
    element.innerHTML = ''
  },

  // TODO: FIX THIS!
  onDataChange ({ data, info}) {
    tableInstance.refresh(data, getColumns(data))

    renderInfo(info)
  }
}