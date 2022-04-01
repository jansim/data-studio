import { fromCSV, fromArrow, from } from 'arquero'

import dataStore from '../data/dataStore'

const DEFAULT_DATASET_ID = 'Default Dataset'

const textFileTypes = [
  'CSV',
  'TSV',
  'JSON'
]

async function loadDatasets (sources) {
  // Convenience function to load multiple datasets
  if (Array.isArray(sources)) {
    const promises = sources.map(src => loadDataset(src))

    await Promise.all(promises)

    return true
  } else {
    throw "Type mismatch: loadDatasets expects an array of sources. No array was provided."
  }
}

async function loadDataset ({ url, id = DEFAULT_DATASET_ID, title, description, info = {}}) {
  const dataset = await getDataset(url)

  // Extra information about the dataset
  const datasetInfo = {
    ...info,
    title,
    description
  }

  // Add dataset to store
  dataStore.set(id, dataset.objects(), datasetInfo)
  dataStore.setActiveDataset(id)

  return true
}

async function getDataset (source) {
  const type = detectFileType(source)

  if (textFileTypes.includes(type)) {
    const contents = await downloadTextFile(source)
    const data = parseTextFile(type, contents)
    return data
  } else if (type === "ARROW") {
    const bytes = await downloadBinaryFile(source)
    const data = fromArrow(bytes)
    return data
  } else if (type === "EXCEL") {
    // TODO: implement excel parsing
    throw "Parsing of excel files not yet supported."
  } else {
    throw `Unsupported file type: "${type}"`
  }
}

async function downloadTextFile (source) {
  if (source instanceof File) {
    // Local File
    return await source.text()
  } else if (typeof source === "string") {
    const response = await fetch(source)
    return await response.text()
  }
}

async function downloadBinaryFile (source) {
  if (source instanceof File) {
    // Local File
    return await source.arrayBuffer()
  } else if (typeof source === "string") {
    const response = await fetch(source)
    return await response.arrayBuffer()
  }
}

async function loadDatasetFromText ({ textData, id = DEFAULT_DATASET_ID, title, description, info = {}}) {
  let dataset
  try {
    dataset = getDatasetFromText(textData)
  } catch (error) {
    return {
      error,
      success: false
    }
  }

  // Extra information about the dataset
  const datasetInfo = {
    ...info,
    title,
    description
  }

  // Add dataset to store
  dataStore.set(id, dataset.objects(), datasetInfo)
  dataStore.setActiveDataset(id)

  return {
    success: true
  }
}

function getDatasetFromText (textData, options) {
  const type = guessFileTypeFromText(textData)
  const data = parseTextFile(type, textData)
  return data
}

function guessFileTypeFromText(textData, numberOfRowsToCheck = 3) {
  const lineDelimiter = '\n'
  const rows = textData.split(lineDelimiter).slice(0, numberOfRowsToCheck)
  const counters = [
    {
      count: 0,
      character: ',',
      type: 'CSV',
      multiplier: 1
    },
    {
      count: 0,
      character: '\t',
      type: 'TSV',
      multiplier: 2
    },
    {
      count: 0,
      character: '{',
      type: 'JSON',
      multiplier: 4
    },
  ]
  rows.forEach(row => {
    counters.forEach(counter => {
      counter.count += (row.match(new RegExp(counter.character, "g")) || []).length * counter.multiplier
    })
  })
  const maxCounter = counters.reduce(function(prev, current) {
      return (prev.count > current.count) ? prev : current
  })
  return maxCounter.type
}

function parseTextFile (type, contents) {
  switch (type) {
    case "CSV":
      return fromCSV(contents)
      break;
    case "TSV":
      return fromCSV(contents, { delimiter: '\t' })
      break;
    case "JSON":
      // Working around the weird choice in fromJSON here, that it can only
      // handle column-wise tables. This way row-wise specified JSON data also works.
      return from(JSON.parse(contents))
      break;
    default:
      throw `Trying to parse unsupported text file type: "${type}"`
      break;
  }
}

function detectFileType (source) {
  // Should return either CSV, JSON, TSV or EXCEL
  let filename
  if (source instanceof File) {
    // Source is local file
    filename = source.name
  } else if (typeof source === "string") {
    // URL
    filename = source
  } else {
    console.warn("Unable to extract filename for source", source)
  }

  const extension = filename.split(".").pop()

  if (extension.length < 3) {
    console.warn(`Suspiciously short file extension: "${extension}". Filename: "${filename}".`)
  }

  if (extension === "xlsx" || extension === "xls") {
    return "EXCEL"
  } else {
    return extension.toUpperCase()
  }
}

export {
  loadDataset,
  loadDatasetFromText,
  loadDatasets
}
