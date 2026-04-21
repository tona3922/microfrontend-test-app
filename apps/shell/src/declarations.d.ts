declare module 'reactApp/ReactWidget' {
  import { ComponentType } from 'react'
  const ReactWidget: ComponentType
  export default ReactWidget
}

declare module 'vueApp/VueWidget' {
  import { DefineComponent } from 'vue'
  const VueWidget: DefineComponent<{}, {}, any>
  export default VueWidget
}
