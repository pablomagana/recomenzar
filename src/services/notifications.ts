import { LocalNotifications, type LocalNotificationSchema } from '@capacitor/local-notifications'
import { Capacitor } from '@capacitor/core'
import type { DailySchedule } from '@/types'
import router from '@/router'

const NOTIFICATION_CATEGORIES = {
  REMINDER: 'reminder',
  SCHEDULE: 'schedule',
  ALERT: 'alert'
} as const

function hashStringToNumber(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash) % 1000
}

function generateNotificationId(category: string, identifier: string | number): number {
  switch (category) {
    case NOTIFICATION_CATEGORIES.REMINDER:
      return 1000 + (typeof identifier === 'number' ? identifier : 0)
    case NOTIFICATION_CATEGORIES.SCHEDULE:
      return 2000 + hashStringToNumber(identifier.toString())
    case NOTIFICATION_CATEGORIES.ALERT:
      return 3000 + (typeof identifier === 'number' ? identifier : 0)
    default:
      return Math.floor(Math.random() * 1000)
  }
}

export async function requestNotificationPermissions(): Promise<boolean> {
  const permission = await LocalNotifications.checkPermissions()

  if (permission.display === 'granted') {
    return true
  }

  if (permission.display === 'prompt') {
    const request = await LocalNotifications.requestPermissions()
    return request.display === 'granted'
  }

  return false
}

export async function setupAndroidChannel(): Promise<void> {
  if (Capacitor.getPlatform() === 'android') {
    await LocalNotifications.createChannel({
      id: 'recomenzar-default',
      name: 'reComenzar',
      description: 'Recordatorios y actividades',
      importance: 4,
      visibility: 1,
      vibration: true
    })
  }
}

export function setupNotificationListeners(): void {
  LocalNotifications.addListener(
    'localNotificationActionPerformed',
    async (notification) => {
      const extra = notification.notification.extra as { targetScreen?: string } | undefined

      if (extra?.targetScreen) {
        await router.push(extra.targetScreen)
      }
    }
  )
}

export async function cancelNotificationsByCategory(category: string): Promise<void> {
  const pending = await LocalNotifications.getPending()
  const toCancel = pending.notifications.filter(n => {
    const extra = n.extra as { type?: string } | undefined
    return extra?.type === category
  })

  if (toCancel.length > 0) {
    await LocalNotifications.cancel({
      notifications: toCancel.map(n => ({ id: n.id }))
    })
  }
}

export async function scheduleReminderNotifications(): Promise<void> {
  const hoursEnv = import.meta.env.VITE_NOTIF_HORAS
  if (!hoursEnv) return

  const hours = hoursEnv.split(',')
  const messages = [
    import.meta.env.VITE_NOTIF_MENSAJE_MANANA || '¡Buenos días! Recuerda registrar tu estado de ánimo.',
    import.meta.env.VITE_NOTIF_MENSAJE_TARDE || '¿Cómo va tu día? No olvides tu reporte.',
    import.meta.env.VITE_NOTIF_MENSAJE_NOCHE || 'Se acerca el límite. ¿Ya registraste tu reporte?'
  ]

  await cancelNotificationsByCategory(NOTIFICATION_CATEGORIES.REMINDER)

  const notifications: LocalNotificationSchema[] = []

  for (let i = 0; i < hours.length; i++) {
    const [hour, minute] = hours[i].split(':').map(Number)

    notifications.push({
      id: generateNotificationId(NOTIFICATION_CATEGORIES.REMINDER, i),
      title: 'reComenzar',
      body: messages[i] || messages[0],
      schedule: {
        on: {
          hour,
          minute
        },
        repeats: true,
        allowWhileIdle: true
      },
      extra: {
        type: NOTIFICATION_CATEGORIES.REMINDER,
        targetScreen: '/tabs/reports'
      }
    })
  }

  await LocalNotifications.schedule({ notifications })
}

export async function scheduleActivityNotifications(schedule: DailySchedule): Promise<void> {
  await cancelNotificationsByCategory(NOTIFICATION_CATEGORIES.SCHEDULE)

  const targetDate = new Date(schedule.fecha)
  const notifications: LocalNotificationSchema[] = []

  for (const entry of schedule.entries) {
    const [hour, minute] = entry.hora.split(':').map(Number)

    const notifDate = new Date(targetDate)
    notifDate.setHours(hour, minute, 0, 0)

    if (notifDate > new Date()) {
      notifications.push({
        id: generateNotificationId(NOTIFICATION_CATEGORIES.SCHEDULE, entry.id),
        title: `⏰ Es hora de: ${entry.accion}`,
        body: `Actividad programada para las ${entry.hora}`,
        schedule: {
          at: notifDate,
          allowWhileIdle: true
        },
        extra: {
          type: NOTIFICATION_CATEGORIES.SCHEDULE,
          entryId: entry.id,
          targetScreen: '/tabs/schedule'
        }
      })
    }
  }

  if (notifications.length > 0) {
    await LocalNotifications.schedule({ notifications })
  }
}

export async function cancelTodayReminders(): Promise<void> {
  await cancelNotificationsByCategory(NOTIFICATION_CATEGORIES.REMINDER)
}

export async function initializeNotifications(): Promise<void> {
  const granted = await requestNotificationPermissions()

  if (granted) {
    await setupAndroidChannel()
    setupNotificationListeners()
    await scheduleReminderNotifications()
  }
}
