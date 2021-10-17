import { createApp } from 'vue'
import App from './App.vue'

// import dataPlugin from './plugins/data.js'

const instance = createApp(App)
instance.config.unwrapInjectedRef = true

// instance.use(dataPlugin)

instance.mount('#app')
