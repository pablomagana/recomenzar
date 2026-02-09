import { Preferences } from '@capacitor/preferences'

const STORAGE_KEY = 'admin_alerts_read'

function todayKey(userId: string): string {
  const today = new Date().toISOString().slice(0, 10)
  return `${userId}:${today}`
}

async function getRawData(): Promise<Record<string, boolean>> {
  const { value } = await Preferences.get({ key: STORAGE_KEY })
  if (!value) return {}
  try {
    return JSON.parse(value)
  } catch {
    return {}
  }
}

function pruneOldEntries(data: Record<string, boolean>): Record<string, boolean> {
  const today = new Date().toISOString().slice(0, 10)
  const pruned: Record<string, boolean> = {}
  for (const key of Object.keys(data)) {
    const datePart = key.split(':').pop()
    if (datePart === today) {
      pruned[key] = data[key]
    }
  }
  return pruned
}

async function save(data: Record<string, boolean>): Promise<void> {
  await Preferences.set({ key: STORAGE_KEY, value: JSON.stringify(data) })
}

export const alertStorage = {
  async getReadAlerts(): Promise<Record<string, boolean>> {
    const raw = await getRawData()
    const pruned = pruneOldEntries(raw)
    if (Object.keys(pruned).length !== Object.keys(raw).length) {
      await save(pruned)
    }
    return pruned
  },

  async markAlertRead(userId: string): Promise<void> {
    const data = await getRawData()
    const pruned = pruneOldEntries(data)
    pruned[todayKey(userId)] = true
    await save(pruned)
  },

  async markAlertUnread(userId: string): Promise<void> {
    const data = await getRawData()
    const pruned = pruneOldEntries(data)
    delete pruned[todayKey(userId)]
    await save(pruned)
  }
}
