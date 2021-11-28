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
          <span v-if="entry.description" class="description"> {{ entry.description }} </span>
          <a v-if="entry.info_url" class="info_url" :href="entry.info_url">more</a>

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
        name: 'mtcars: Motor Trend Car Road Tests',
        author: 'Motor Trend US magazine (1974)',
        description: 'The data was extracted from the 1974 Motor Trend US magazine, and comprises fuel consumption and 10 aspects of automobile design and performance for 32 automobiles (1973-74 models).',
        info_url: 'https://stat.ethz.ch/R-manual/R-devel/library/datasets/html/mtcars.html',
        url: '/data/example/mtcars.csv'
      },
      {
        name: 'Palmer Penguins',
        author: 'Dr. Kristen Gorman and the Palmer Station, Antarctica LTER, a member of the Long Term Ecological Research Network.',
        description: 'The goal of palmerpenguins is to provide a great dataset for data exploration & visualization, as an alternative to iris.',
        info_url: 'https://allisonhorst.github.io/palmerpenguins/articles/intro.html',
        url: '/data/example/penguins.json'
      },
      {
        name: 'quakes: Locations of Earthquakes off Fiji',
        author:  'Dr. John Woodhouse',
        description: 'The data set give the locations of 1000 seismic events of MB > 4.0. The events occurred in a cube near Fiji since 1964.',
        info_url: 'https://stat.ethz.ch/R-manual/R-devel/library/datasets/html/quakes.html',
        url: '/data/example/quakes.arrow'
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
.entry .author,
.entry .description {
  display: block;
}
.entry .author,
.entry .description,
.entry .info_url {
  padding-right: 0.5em;
}
</style>
