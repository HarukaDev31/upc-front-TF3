interface User {
  id: string
  email: string
  nombre: string
  apellido: string
  telefono: string
  fecha_registro: string
  activo: boolean
}

interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

interface RegisterData {
  email: string
  nombre: string
  apellido: string
  telefono: string
  password: string
}

interface TokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}

interface AuthResponse {
  usuario: User
  token: TokenResponse
  mensaje: string
}

export const useAuth = () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Obtener información del usuario desde localStorage
  const getUserFromStorage = (): User | null => {
    if (process.client) {
      const userData = localStorage.getItem('user_data')
      if (userData) {
        try {
          return JSON.parse(userData)
        } catch (e) {
          console.error('Error parsing user data from localStorage:', e)
        }
      }
    }
    return null
  }

  // Verificar si hay un token válido
  const checkAuth = async () => {
    if (process.client) {
      const token = getToken()
      const storedUser = getUserFromStorage()
      
      console.log('checkAuth - Token:', token ? 'Presente' : 'No presente')
      console.log('checkAuth - Usuario almacenado:', storedUser ? 'Presente' : 'No presente')
      
      if (token && storedUser) {
        // Verificar si el token es válido consultando al servidor
        try {
          const { getCurrentUser } = useApi()
          const response = await getCurrentUser()
          
          console.log('checkAuth - Respuesta del servidor:', response)
          
          if (response.success && response.data) {
            user.value = response.data
            isAuthenticated.value = true
            // Actualizar datos del usuario en localStorage
            localStorage.setItem('user_data', JSON.stringify(response.data))
            console.log('checkAuth - Usuario autenticado correctamente')
            return true
          } else {
            // Token inválido, limpiar datos
            console.log('checkAuth - Token inválido, limpiando datos')
            logout()
            return false
          }
        } catch (err) {
          // Error de conexión o token inválido
          console.log('checkAuth - Error de conexión:', err)
          logout()
          return false
        }
      } else {
        // No hay token o usuario, pero verificar si hay datos en localStorage
        if (storedUser) {
          user.value = storedUser
          isAuthenticated.value = true
          console.log('checkAuth - Usuario cargado desde localStorage')
          return true
        }
      }
    }
    
    console.log('checkAuth - No hay token o usuario, limpiando estado')
    user.value = null
    isAuthenticated.value = false
    return false
  }

  // Login
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    loading.value = true
    error.value = null
    
    try {
      const { loginUser } = useApi()
      const response = await loginUser({
        email: credentials.email,
        password: credentials.password
      })

      if (response.success && response.data) {
        const authData: AuthResponse = response.data
        
        // Guardar token y datos del usuario
        if (process.client) {
          localStorage.setItem('auth_token', authData.token.access_token)
          localStorage.setItem('user_data', JSON.stringify(authData.usuario))
          
          if (credentials.rememberMe) {
            localStorage.setItem('remember_me', 'true')
          }
        }
        
        // Actualizar estado
        user.value = authData.usuario
        isAuthenticated.value = true
        
        return true
      } else {
        error.value = response.error || 'Error en el login'
        return false
      }
    } catch (err: any) {
      error.value = err.message || 'Error de conexión'
      console.error('Error en login:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  // Register
  const register = async (data: RegisterData): Promise<boolean> => {
    loading.value = true
    error.value = null
    
    try {
      const { registerUser } = useApi()
      const response = await registerUser({
        email: data.email,
        nombre: data.nombre,
        apellido: data.apellido,
        telefono: data.telefono,
        password: data.password
      })

      if (response.success && response.data) {
        const authData: AuthResponse = response.data
        
        // Guardar token y datos del usuario
        if (process.client) {
          localStorage.setItem('auth_token', authData.token.access_token)
          localStorage.setItem('user_data', JSON.stringify(authData.usuario))
        }
        
        // Actualizar estado
        user.value = authData.usuario
        isAuthenticated.value = true
        
        return true
      } else {
        error.value = response.error || 'Error en el registro'
        return false
      }
    } catch (err: any) {
      error.value = err.message || 'Error de conexión'
      console.error('Error en registro:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  // Logout
  const logout = () => {
    if (process.client) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      localStorage.removeItem('remember_me')
    }
    
    user.value = null
    isAuthenticated.value = false
    error.value = null
  }

  // Obtener token
  const getToken = (): string | null => {
    if (process.client) {
      return localStorage.getItem('auth_token')
    }
    return null
  }

  // Verificar si el token está expirado
  const isTokenExpired = (): boolean => {
    const token = getToken()
    if (!token) return true
    
    try {
      // Decodificar el token JWT (solo la parte del payload)
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Math.floor(Date.now() / 1000)
      
      return payload.exp < currentTime
    } catch (e) {
      console.error('Error decoding token:', e)
      return true
    }
  }

  // Renovar token (si es necesario)
  const refreshToken = async (): Promise<boolean> => {
    if (isTokenExpired()) {
      logout()
      return false
    }
    return true
  }

  // Verificar si el usuario está autenticado
  const isLoggedIn = computed(() => {
    return isAuthenticated.value && user.value !== null && !isTokenExpired()
  })

  // Obtener información del usuario actual
  const currentUser = computed(() => user.value)

  // Obtener el ID del usuario actual
  const getCurrentUserId = (): string | null => {
    const userId = user.value?.id || null
    return userId
  }

  // Obtener el nombre completo del usuario
  const getUserFullName = (): string => {
    if (user.value) {
      return `${user.value.nombre} ${user.value.apellido}`
    }
    return ''
  }

  // Inicializar autenticación al cargar (solo en cliente)
  if (process.client) {
    // Inicializar inmediatamente si hay datos en localStorage
    const storedUser = getUserFromStorage()
    if (storedUser) {
      user.value = storedUser
      isAuthenticated.value = true
      console.log('useAuth: Usuario cargado desde localStorage')
    }
  }

  return {
    // Estado
    user: readonly(user),
    isAuthenticated: readonly(isAuthenticated),
    loading: readonly(loading),
    error: readonly(error),
    isLoggedIn,
    currentUser,
    
    // Métodos
    login,
    register,
    logout,
    checkAuth,
    getToken,
    getUserFromStorage,
    getCurrentUserId,
    getUserFullName,
    isTokenExpired,
    refreshToken
  }
} 