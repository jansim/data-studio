<template>
  <h1>Data Library</h1>

  <div class="data-library">
    <div class="sources">
      Sources:

      <div :class="{active: activeSourceIndex === index}" :key="source.name + '-src'" class="source" v-for="(source, index) in sources" @click="activeSourceIndex = index"> {{ source.name }} </div>
    </div>
    <div class="entries">
      Datasets:

      <div class="loading" v-if="activeSource._loadingEntries">
        Loading...
      </div>

      <template v-if="activeSource.entries">
        <div :key="activeSource.name + '-' + entry.name" class="entry" v-for="entry in activeSource.entries">
          <span class="name"> {{ entry.name }} </span>
          <span v-if="entry.author" class="author"> {{ entry.author }} </span>

          <button class="load" @click="loadDataset(entry)">Load Dataset</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
const DATA_SOURCES = [
  {
    name: 'Example Datasets',
    entries: [
      {
        name: 'mtcars',
        author: 'Motor Trend US magazine',
        url: '/data/example/mtcars.csv'
      }
    ]
  },
  {
    name: 'Our World in Data',
    async loadEntries () {
      const response = await fetch('https://api.github.com/repos/owid/owid-datasets/contents/datasets')
      const dirs = await response.json()

      return dirs.filter(entry => {
        // Only allow directories
        return entry.type === 'dir'
      }).map((entry) => {
        // Filter out the information we want
        const urlSafeName = encodeURIComponent(entry.name)

        const splitName = entry.name.split('-')
        let name, author
        if (splitName.length === 2) {
          name = splitName[0]
          author = splitName[1]
        } else {
          name = entry.name
        }
        const newEntry = {
          name,
          // Generating url from name alone here
          // TODO: It will be safer to actually follow the API in entry.url here to get actual filenames in the future
          url: `https://raw.githubusercontent.com/owid/owid-datasets/master/datasets/${urlSafeName}/${urlSafeName}.csv`
        }
        if (typeof author !== 'undefined') {
          newEntry.author = author
        }
        return newEntry
      })
    }
  }
]

export default {
  name: 'DataLibrary',
  data () {
    return {
      sources: DATA_SOURCES,
      activeSourceIndex: 0
    }
  },
  computed: {
    activeSource () {
      return this.sources[this.activeSourceIndex]
    }
  },
  watch: {
    activeSourceIndex: {
      async handler (newActiveSourceIndex) {
        const source = this.sources[newActiveSourceIndex]

        // Retrieve source
        if (source.loadEntries && !source.entries && !source._loadingEntries) {
          source._loadingEntries = true

          source.entries = await source.loadEntries()

          source._loadingEntries = false
        }
      }
    }
  },
  methods: {
    loadDataset (entry) {
      this.$emit('load', entry)
    }
  }
}
</script>

<style lang="css" scoped>
.data-library {
  display: flex;
}
.sources {
  padding-right: 1.5rem;
}
.source {
  padding: 0.6rem 1rem;
  margin-bottom: 2px;
  cursor: pointer;
  background-color: lightgrey;
}
.source.active {
  font-weight: bold;
}
.entries {
}
.entry {
  margin-bottom: 0.75rem;
}
.entry .name {
  font-size: 1.5rem;
  display: block;
}
.entry .author {
  font-style: italic;
  margin-right: 0.5rem;
}
</style>
