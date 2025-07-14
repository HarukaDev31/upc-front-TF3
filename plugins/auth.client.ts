export default defineNuxtPlugin(() => {
  // Solo ejecutar en el cliente
  if (process.client) {
    // Verificar si localStorage está disponible antes de hacer cualquier cosa
    if (typeof localStorage === 'undefined') {
      console.log('Plugin Auth: localStorage no disponible')
      return
    }
    
    // Función para inicializar la autenticación
    const initializeAuth = async () => {
      try {
        const { checkAuth } = useAuth()
        
        // Verificar autenticación al cargar la aplicación
        await checkAuth()
        console.log('Plugin Auth: Autenticación verificada correctamente')
      } catch (error) {
        console.error('Error en plugin de autenticación:', error)
      }
    }
    
    // Esperar a que la aplicación esté completamente inicializada
    // Usar requestIdleCallback si está disponible, sino setTimeout
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => {
        initializeAuth()
      })
    } else {
      // Fallback para navegadores que no soportan requestIdleCallback
      setTimeout(() => {
        initializeAuth()
      }, 100)
    }
    
    // También verificar cuando la página esté completamente cargada
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
          initializeAuth()
        }, 50)
      })
    } else {
      // Si ya está cargado, ejecutar inmediatamente
      setTimeout(() => {
        initializeAuth()
      }, 50)
    }
  }
}) 