export default [
  {
    id: 'loader',
    name: 'Loader',
    load: () => import('./internal/module-loader/index.js')
  },
  {
    id: 'viewer',
    name: 'Viewer',
    load: () => import('./internal/module-viewer/index.js')
  },
  {
    id: 'wrangler',
    name: 'Wrangler',
    load: () => import('./internal/module-wrangler/index.js')
  },
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
  }
]
