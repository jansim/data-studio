export default [
  {
    id: 'loader',
    name: 'Loader',
    load: () => import('./dataset-loader/DatasetLoader.js')
  },
  {
    id: 'viewer',
    name: 'Viewer',
    load: () => import('./DataViewer.js')
  },
  {
    id: 'wrangler',
    name: 'Wrangler',
    load: () => import('./data-wrangler/DataWrangler.js')
  },
  {
    id: 'sanddance',
    name: 'SandDance',
    iframe: true,
    url: '/iframe-modules/sanddance/'
  },
  {
    id: 'voyager2',
    name: 'Voyager',
    iframe: true,
    url: '/prebuilt-iframe-modules/voyager2/index.html'
  }
]
