import { from } from 'arquero'

function createSheetConfiguration (newData) {
  const table = from(newData)

  const columns = table.columns()
  const column_names = Object.keys(columns)
  let n_columns = column_names.length

  let data = table.objects({columns: column_names}).map(rowObject => Object.values(rowObject))

  // Add colnames as first row
  data.unshift(column_names)

  return {
    name: 'Data',
    column: n_columns,
    row: data.length,
    data
  }
}

export default {
  async mount(element, moduleApi) {
    luckysheet.create({
      container: 'module',
      showinfobar: false,
      lang: 'en',
      data: [createSheetConfiguration( await moduleApi.getData() )]
      // data: [createSheetConfiguration( [{'a': 1, b: 5}, {'a': 2, b: 3}] )]
    })

    const useDataButton = document.createElement('button')
    useDataButton.appendChild(document.createTextNode("Use updated data"))
    useDataButton.classList.add('use-data-button')
    useDataButton.addEventListener('click', () => {
      // Extract data from spreadsheet format
      const rawSheetData = luckysheet.getSheetData()
      const sheetValues = rawSheetData.map(row => row.map(cell => cell ? cell.v : undefined))

      const columnNames = sheetValues.shift()
      const updatedData = sheetValues.map(rowArray => {
        const rowObject = {}
        columnNames.forEach((col, i) => rowObject[col] = rowArray[i])
        return rowObject
      })

      console.log(updatedData)

      // Use the new (and updated data)
      moduleApi.setData(updatedData)
      moduleApi.setActiveModule('viewer')
    })
    element.appendChild(useDataButton)

  },

  onDataChange(newData) {
    luckysheet.setSheetAdd({
      sheetObject: createSheetConfiguration(newData),
      order: 0
    })

    // delete previous sheet
    luckysheet.setSheetDelete({order: 1})
  }
}
