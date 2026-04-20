import { createApp } from 'vue'
import VueWidget from './VueWidget.vue'

createApp({
  components: { VueWidget },
  template: `
    <div style="padding: 24px; font-family: sans-serif;">
      <h1 style="color: #fff;">Vue App (standalone)</h1>
      <VueWidget />
    </div>
  `,
}).mount('#app')
