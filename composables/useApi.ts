// Interfaces para los tipos de datos
interface UserData {
  email: string
  nombre: string
  apellido: string
  telefono: string
  password: string
}

interface LoginCredentials {
  email: string
  password: string
}

interface SeleccionData {
  funcion_id: string
  usuario_id: string
  asiento_id: string
  estado?: string
}

interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  body?: any
  headers?: Record<string, string>
}

interface ApiResponse {
  success: boolean
  data?: any
  error?: string
  status?: number
}

export const useApi = () => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiBaseUrl || 'http://localhost:8000'

  // Función helper para hacer requests
  const apiRequest = async (endpoint: string, options: ApiRequestOptions = {}): Promise<ApiResponse> => {
    try {
      const response = await $fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        }
      })
      return { success: true, data: response }
    } catch (error: any) {
      console.error('API Error:', error)
      return {
        success: false,
        error: error?.data?.detail || error?.message || 'Error de conexión',
        status: error?.status
      }
    }
  }

  // Función helper para requests con autenticación
  const authenticatedRequest = async (endpoint: string, options: ApiRequestOptions = {}): Promise<ApiResponse> => {
    const { getToken } = useAuth()
    const token = getToken()
    
    return apiRequest(endpoint, {
      ...options,
      headers: {
        ...(options.headers || {}),
        'Authorization': token ? `Bearer ${token}` : ''
      }
    })
  }

  // ===== GESTIÓN DE USUARIOS =====
  
  // Registro de usuario
  const registerUser = (userData: UserData) => 
    apiRequest('/api/v1/usuarios/registro', {
      method: 'POST',
      body: {
        email: userData.email,
        nombre: userData.nombre,
        apellido: userData.apellido,
        telefono: userData.telefono,
        password: userData.password
      }
    })

  // Login de usuario
  const loginUser = (credentials: LoginCredentials) => 
    apiRequest('/api/v1/usuarios/login', {
      method: 'POST',
      body: {
        email: credentials.email,
        password: credentials.password
      }
    })

  // Obtener usuario actual (usando JWT)
  const getCurrentUser = () => 
    authenticatedRequest('/api/v1/usuarios/me')

  // Obtener usuario por ID
  const getUserById = (userId: string) => 
    authenticatedRequest(`/api/v1/usuarios/${userId}`)

  // Listar usuarios
  const getUsers = (skip = 0, limit = 100) => 
    authenticatedRequest(`/api/v1/usuarios/?skip=${skip}&limit=${limit}`)

  // Actualizar usuario
  const updateUser = (userId: string, userData: Partial<UserData>) => 
    authenticatedRequest(`/api/v1/usuarios/${userId}`, {
      method: 'PUT',
      body: userData
    })

  // Desactivar usuario
  const deactivateUser = (userId: string) => 
    authenticatedRequest(`/api/v1/usuarios/${userId}`, {
      method: 'DELETE'
    })

  // ===== GESTIÓN DE SELECCIONES DE ASIENTOS =====

  // Crear selección de asiento
  const createSeleccion = (seleccionData: SeleccionData) => 
    authenticatedRequest('/api/v1/selecciones/', {
      method: 'POST',
      body: {
        funcion_id: seleccionData.funcion_id,
        usuario_id: seleccionData.usuario_id,
        asiento_id: seleccionData.asiento_id,
        estado: seleccionData.estado || 'temporal'
      }
    })

  // Obtener selección por ID
  const getSeleccionById = (seleccionId: string) => 
    authenticatedRequest(`/api/v1/selecciones/${seleccionId}`)

  // Obtener selecciones por función
  const getSeleccionesByFuncion = (funcionId: string) => 
    authenticatedRequest(`/api/v1/selecciones/funcion/${funcionId}`)

  // Obtener selecciones por usuario
  const getSeleccionesByUsuario = (usuarioId: string) => 
    authenticatedRequest(`/api/v1/selecciones/usuario/${usuarioId}`)

  // Confirmar selección
  const confirmarSeleccion = (seleccionId: string) => 
    authenticatedRequest(`/api/v1/selecciones/${seleccionId}/confirmar`, {
      method: 'POST'
    })

  // Cancelar selección
  const cancelarSeleccion = (seleccionId: string) => 
    authenticatedRequest(`/api/v1/selecciones/${seleccionId}/cancelar`, {
      method: 'POST'
    })

  // Obtener historial de función
  const getHistorialFuncion = (funcionId: string) => 
    authenticatedRequest(`/api/v1/selecciones/funcion/${funcionId}/historial`)

  // Limpiar selecciones expiradas
  const limpiarSeleccionesExpiradas = () => 
    authenticatedRequest('/api/v1/selecciones/limpiar-expiradas', {
      method: 'POST'
    })

  // ===== ENDPOINTS EXISTENTES =====

  // Endpoints básicos
  const getBienvenida = () => apiRequest('/')
  const getHealthCheck = () => apiRequest('/health')

  // Gestión de películas
  const getPeliculas = (limite = 20, offset = 0) => 
    apiRequest(`/api/v1/peliculas/list?limite=${limite}&offset=${offset}`)

  const getPeliculaConFunciones = (peliculaId: string) => 
    apiRequest(`/api/v1/peliculas/${peliculaId}/funciones`)

  const getFuncionesPelicula = (peliculaId: string) => 
    apiRequest(`/api/v1/peliculas/${peliculaId}/funciones`)

  const buscarPeliculas = (busqueda: any) => 
    apiRequest('/api/v1/peliculas/buscar', {
      method: 'POST',
      body: busqueda
    })

  // Gestión de funciones
  const getAsientosFuncion = (funcionId: string) => 
    apiRequest(`/api/v1/funciones/${funcionId}/asientos`)

  // Compra de entradas
  const comprarEntrada = (datos: any) => 
    apiRequest('/api/v1/comprar-entrada', {
      method: 'POST',
      body: datos
    })

  // Métricas y analytics
  const getRankingPeliculas = (limite = 10) => 
    apiRequest(`/api/v1/metricas/ranking-peliculas?limite=${limite}`)

  const getOcupacionSala = (funcionId: string) => 
    apiRequest(`/api/v1/metricas/ocupacion/${funcionId}`)

  const getOcupacionSalas = () => 
    apiRequest('/api/v1/metricas/ocupacion-salas/todas')

  const getGenerosPopulares = () => 
    apiRequest('/api/v1/metricas/generos-populares')

  const getHorariosPico = () => 
    apiRequest('/api/v1/metricas/horarios-pico')

  // ===== GESTIÓN DE TRANSACCIONES =====
  
  // Comprar entrada
  const comprarEntradaTransaccion = (datosCompra: any) => 
    authenticatedRequest('/api/v1/transacciones/comprar-entrada', {
      method: 'POST',
      body: datosCompra
    })

  // Obtener historial de compras
  const getHistorialCompras = (limite = 20) => 
    authenticatedRequest(`/api/v1/transacciones/historial?limit=${limite}`)

  // Obtener transacciones del usuario actual
  const getTransaccionesUsuario = (limite = 20) => 
    authenticatedRequest(`/api/v1/transacciones/historial?limit=${limite}`)

  // Cancelar transacción
  const cancelarTransaccion = (transaccionId: string) => 
    authenticatedRequest(`/api/v1/transacciones/${transaccionId}/cancelar`, {
      method: 'POST'
    })

  // Obtener detalles de transacción
  const getDetallesTransaccion = (transaccionId: string) => 
    authenticatedRequest(`/api/v1/transacciones/${transaccionId}`)

  // Obtener asientos ocupados de una función
  const getAsientosOcupados = (funcionId: string) => 
    apiRequest(`/api/v1/transacciones/funciones/${funcionId}/asientos-ocupados`)

  // Obtener estadísticas de ventas (solo admin)
  const getEstadisticasVentas = (fechaInicio: string, fechaFin: string) => 
    authenticatedRequest(`/api/v1/transacciones/estadisticas/ventas?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`)

  return {
    // ===== GESTIÓN DE USUARIOS =====
    registerUser,
    loginUser,
    getCurrentUser,
    getUserById,
    getUsers,
    updateUser,
    deactivateUser,

    // ===== GESTIÓN DE SELECCIONES =====
    createSeleccion,
    getSeleccionById,
    getSeleccionesByFuncion,
    getSeleccionesByUsuario,
    confirmarSeleccion,
    cancelarSeleccion,
    getHistorialFuncion,
    limpiarSeleccionesExpiradas,

    // ===== ENDPOINTS EXISTENTES =====
    // Endpoints básicos
    getBienvenida,
    getHealthCheck,
    
    // Gestión de películas
    getPeliculas,
    getPeliculaConFunciones,
    getFuncionesPelicula,
    buscarPeliculas,
    
    // Gestión de funciones
    getAsientosFuncion,
    
    // Compra de entradas
    comprarEntrada,
    
    // Métricas
    getRankingPeliculas,
    getOcupacionSala,
    getOcupacionSalas,
    getGenerosPopulares,
    getHorariosPico,

    // ===== GESTIÓN DE TRANSACCIONES =====
    comprarEntradaTransaccion,
    getHistorialCompras,
    getTransaccionesUsuario,
    cancelarTransaccion,
    getDetallesTransaccion,
    getAsientosOcupados,
    getEstadisticasVentas
  }
} 