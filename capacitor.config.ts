import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.recomenzar.app',
  appName: 'reComenzar',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#2E7D32',
      sound: 'notification.wav'
    },
    Camera: {
      presentationStyle: 'fullScreen'
    }
  }
}

export default config
