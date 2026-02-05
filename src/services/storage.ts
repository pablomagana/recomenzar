import { Preferences } from '@capacitor/preferences'

const KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user'
} as const

export const storage = {
  async setAccessToken(token: string): Promise<void> {
    await Preferences.set({ key: KEYS.ACCESS_TOKEN, value: token })
  },

  async getAccessToken(): Promise<string | null> {
    const { value } = await Preferences.get({ key: KEYS.ACCESS_TOKEN })
    return value
  },

  async setRefreshToken(token: string): Promise<void> {
    await Preferences.set({ key: KEYS.REFRESH_TOKEN, value: token })
  },

  async getRefreshToken(): Promise<string | null> {
    const { value } = await Preferences.get({ key: KEYS.REFRESH_TOKEN })
    return value
  },

  async setUser(user: object): Promise<void> {
    await Preferences.set({ key: KEYS.USER, value: JSON.stringify(user) })
  },

  async getUser<T>(): Promise<T | null> {
    const { value } = await Preferences.get({ key: KEYS.USER })
    return value ? JSON.parse(value) : null
  },

  async clearAuth(): Promise<void> {
    await Promise.all([
      Preferences.remove({ key: KEYS.ACCESS_TOKEN }),
      Preferences.remove({ key: KEYS.REFRESH_TOKEN }),
      Preferences.remove({ key: KEYS.USER })
    ])
  },

  async set(key: string, value: string): Promise<void> {
    await Preferences.set({ key, value })
  },

  async get(key: string): Promise<string | null> {
    const { value } = await Preferences.get({ key })
    return value
  },

  async remove(key: string): Promise<void> {
    await Preferences.remove({ key })
  }
}
