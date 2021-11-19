import { fromCSV, fromJSON } from 'arquero'

import dataStore from '../data/dataStore'
const TEMP_FIXED_DATASETKEY = 'test'

const textFileTypes = [
  'CSV',
  'TSV',
  'JSON'
]

function loadDatasets (sources) {
  // Convenience function to load multiple datasets
  // TODO: implement support for loading multiple datasets
  loadDataset(sources[0])
}

async function loadDataset (source) {
  const dataset = await getDataset(source)

  // Add dataset to store
  dataStore.set(TEMP_FIXED_DATASETKEY, dataset.objects())
}

async function getDataset (source) {
  const type = detectFileType(source)

  if (textFileTypes.includes(type)) {
    const contents = await downloadTextFile(source)
    const data = parseTextFile(type, contents)
    return data
  } else if (type === "EXCEL") {
    // TODO: implement excel parsing
    throw "Parsing of excel files not yet supported."
  } else {
    throw "Unsupported file type."
  }
}

async function downloadTextFile (source) {
  if (source instanceof File) {
    // Local File
    return await source.text()
  } else if (typeof source === "string") {
    const response = await fetch(source)
    return await source.text()
  }
}

function parseTextFile (type, contents) {
  switch (type) {
    case "CSV":
      return fromCSV(contents)
      break;
    // TODO: check proper option name
    // case "TSV":
    //   // return fromCSV(contents, { separator: '\t' })
    //   break;
    case "JSON":
      return fromJSON(contents)
      break;
    default:
      throw "Trying to parse unsupported text file type."
      break;
  }
}

function detectFileType (source) {
  // Should return either CSV, JSON, TSV or EXCEL
  let filename
  if (source instanceof File) {
    // Source is local file
    filename = source.name
  } else if (source === "string") {
    // URL
    filename = source
  }

  const extension = filename.split(".").pop()

  if (extension === "xlsx" || extension === "xls") {
    return "EXCEL"
  } else {
    return extension.toUpperCase()
  }
}

export {
  loadDatasets
}
