export default [
  {
    id: 'viewer',
    name: 'Viewer',
    load: () => import('./DataViewer.js')
  },
  {
    id: 'wrangler',
    name: 'Wrangler',
    load: () => import('./data-wrangler/DataWrangler.js')
  }
]