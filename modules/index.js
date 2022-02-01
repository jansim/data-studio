const moduleGroups = [
  {
    group_name: 'Manipulate Data',
    modules: [
      {
        id: 'loader',
        name: 'Load Data',
        load: () => import('./internal/module-loader/index.js')
      },
      {
        id: 'viewer',
        name: 'View',
        datasetFormat: 'data-with-info',
        load: () => import('./internal/module-viewer/index.js')
      },
      {
        id: 'spreadsheet',
        name: 'Spreadsheet',
        iframe: true,
        url: '/modules-iframe-prebuilt/module-spreadsheet/index.html'
      },
      {
        id: 'wrangler',
        name: 'Wrangle',
        load: () => import('./internal/module-wrangler/index.js')
      },
    ]
  },
  {
    group_name: 'Visualize Data',
    modules: [
      {
        id: 'sanddance',
        name: 'SandDance',
        iframe: true,
        url: '/modules/iframe/module-sanddance/index.html'
      },
      {
        id: 'voyager2',
        name: 'Voyager',
        iframe: true,
        url: '/modules-iframe-prebuilt/module-voyager2/index.html'
      },
      {
        id: 'kepler.gl',
        name: 'Kepler.gl',
        iframe: true,
        url: '/modules-iframe-prebuilt/module-kepler.gl/index.html'
      },
    ]
  }
]

const modules = moduleGroups.reduce((previous, current) => [...previous.modules, ...current.modules])

export {
  moduleGroups,
  modules
}
