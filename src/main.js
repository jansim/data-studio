import { createApp } from 'vue'
import App from './App.vue'

// import dataPlugin from './plugins/data.js'

const instance = createApp(App)

// instance.use(dataPlugin)

instance.mount('#app')
