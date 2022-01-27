import { createApp } from 'vue'
import App from './App.vue'
import "./index.css"

window.addEventListener("resize",onResize)
onResize()
function onResize(){
    document.body.style.setProperty('--vh',window.innerHeight + 'px')
}
createApp(App).mount('#app')
