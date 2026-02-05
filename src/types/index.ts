// Authentication Types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  nombre: string
  apellidos: string
  fechaNacimiento: string
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface TokenPayload {
  userId: string
  exp: number
}

// User Types
export interface User {
  id: string
  email: string
  nombre: string
  apellidos: string
  fechaNacimiento: string
  avatarUrl?: string
  createdAt: string
  updatedAt: string
}

// Challenge Types
export interface Challenge {
  id: string
  userId: string
  nombre: string
  createdAt: string
  weekStartDate: string
}

// Report Types
export interface DailyReport {
  id: string
  userId: string
  fecha: string
  estadoAnimo: 1 | 2 | 3 | 4 | 5
  horarioCumplido: boolean
  llamadasRealizadas: boolean
  retosCumplidos: Record<string, boolean>
  reporteEscrito: string
  presentado: boolean
  createdAt: string
  updatedAt: string
}

export interface ReportFilters {
  fechaDesde?: string
  fechaHasta?: string
  estadoAnimo?: number[]
  horarioCumplido?: boolean
  llamadasRealizadas?: boolean
  retosCumplidos?: boolean
  presentado?: boolean
}

export interface PaginatedReports {
  data: DailyReport[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface CreateReportRequest {
  estadoAnimo: 1 | 2 | 3 | 4 | 5
  horarioCumplido: boolean
  llamadasRealizadas: boolean
  retosCumplidos: Record<string, boolean>
  reporteEscrito: string
}

// Schedule Types
export interface ScheduleEntry {
  id: string
  hora: string
  accion: string
  horaCorreccion?: string
  accionCorreccion?: string
}

export interface DailySchedule {
  id: string
  userId: string
  fecha: string
  registradoPara: string
  entries: ScheduleEntry[]
  registrado: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateScheduleRequest {
  fecha: string
  entries: Omit<ScheduleEntry, 'id' | 'horaCorreccion' | 'accionCorreccion'>[]
}

export interface ScheduleCorrection {
  entryId: string
  horaCorreccion?: string | null
  accionCorreccion?: string | null
}

// API Response Types
export interface ApiError {
  message: string
  code?: string
  status: number
}

// Mood Types
export type MoodLevel = 1 | 2 | 3 | 4 | 5

export interface MoodOption {
  level: MoodLevel
  label: string
  color: string
}
