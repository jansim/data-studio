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
    load: () => import('./sand-dance/sand-dance.js')
  }
]
