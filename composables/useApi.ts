export const useApi = () => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiBaseUrl

  // Función helper para hacer requests
  const apiRequest = async (endpoint, options = {}) => {
    try {
      const response = await $fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        }
      })
      return response
    } catch (error) {
      console.error('API Error:', error)
      return {
        success: false,
        error: error?.message || 'Error de conexión'
      }
    }
  }

  // Endpoints básicos
  const getBienvenida = () => apiRequest('/')
  const getHealthCheck = () => apiRequest('/health')

  // Gestión de películas
  const getPeliculas = (limite = 20, offset = 0) => 
    apiRequest(`/api/v1/peliculas?limite=${limite}&offset=${offset}`)

  const getPeliculaConFunciones = (peliculaId) => 
    apiRequest(`/api/v1/peliculas/${peliculaId}/funciones`)

  const getFuncionesPelicula = (peliculaId) => 
    apiRequest(`/api/v1/peliculas/${peliculaId}/funciones`)

  const buscarPeliculas = (busqueda) => 
    apiRequest('/api/v1/buscar-peliculas', {
      method: 'POST',
      body: busqueda
    })

  // Gestión de funciones
  const getAsientosFuncion = (funcionId) => 
    apiRequest(`/api/v1/funciones/${funcionId}/asientos`)

  // Compra de entradas
  const comprarEntrada = (datos) => 
    apiRequest('/api/v1/comprar-entrada', {
      method: 'POST',
      body: datos
    })

  // Métricas y analytics
  const getRankingPeliculas = (limite = 10) => 
    apiRequest(`/api/v1/metricas/ranking-peliculas?limite=${limite}`)

  const getOcupacionSala = (funcionId) => 
    apiRequest(`/api/v1/metricas/ocupacion/${funcionId}`)

  return {
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
    getOcupacionSala
  }
} 