import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css' // <-- ADICIONE ESTA LINHA!

createApp(App)
  .use(router)
  .mount('#app')
