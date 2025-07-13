// Tipos para el sistema de cine

export interface Pelicula {
  id: string
  titulo: string
  descripcion: string
  genero: string
  duracion: number
  clasificacion: string
  poster_url: string
  trailer_url?: string
  fecha_estreno: string
  director: string
  actores: string[]
  rating: number
}

export interface Funcion {
  id: string
  pelicula_id: string
  sala_id: string
  fecha: string
  hora: string
  precio: number
  asientos_disponibles: number
  asientos_totales: number
  estado: 'disponible' | 'agotada' | 'cancelada'
}

export interface Asiento {
  id: string
  numero: string
  fila: string
  estado: 'disponible' | 'ocupado' | 'reservado'
  precio: number
}

export interface Sala {
  id: string
  nombre: string
  capacidad: number
  tipo: '2D' | '3D' | 'IMAX'
}

export interface Cliente {
  id: string
  nombre: string
  email: string
  telefono?: string
}

export interface Entrada {
  id: string
  cliente_id: string
  pelicula_id: string
  funcion_id: string
  asientos: string[]
  precio_total: number
  metodo_pago: string
  fecha_compra: string
  estado: 'confirmada' | 'pendiente' | 'cancelada'
}

export interface BusquedaPeliculas {
  texto?: string
  genero?: string
  fecha?: string
  limite?: number
}

export interface RankingPelicula {
  pelicula_id: string
  titulo: string
  ventas_totales: number
  ingresos_totales: number
  rating_promedio: number
}

export interface OcupacionSala {
  funcion_id: string
  sala_id: string
  asientos_ocupados: number
  asientos_totales: number
  porcentaje_ocupacion: number
  asientos_disponibles: Asiento[]
}

export interface HealthCheck {
  status: 'healthy' | 'unhealthy'
  timestamp: string
  services: {
    api: boolean
    redis: boolean
    mongodb: boolean
  }
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  limite: number
  offset: number
  total_pages: number
  pagina_actual: number
} 