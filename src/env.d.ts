/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_HORA_LIMITE_REPORTE: string
  readonly VITE_HORA_LIMITE_HORARIO: string
  readonly VITE_HORA_REINICIO_RETOS: string
  readonly VITE_NOTIF_HORAS: string
  readonly VITE_NOTIF_MENSAJE_MANANA: string
  readonly VITE_NOTIF_MENSAJE_TARDE: string
  readonly VITE_NOTIF_MENSAJE_NOCHE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
