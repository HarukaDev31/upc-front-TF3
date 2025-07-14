export default defineNuxtPlugin(() => {
  // Solo ejecutar en el cliente
  if (process.client) {
    // Verificar si localStorage está disponible antes de hacer cualquier cosa
    if (typeof localStorage === 'undefined') {
      console.log('Plugin Auth: localStorage no disponible')
      return
    }
    
    // Esperar a que la aplicación esté completamente inicializada
    setTimeout(() => {
      try {
        const { checkAuth } = useAuth()
        
        // Verificar autenticación al cargar la aplicación
        checkAuth().catch(error => {
          console.error('Error en plugin de autenticación:', error)
        })
      } catch (error) {
        console.error('Error inicializando plugin de autenticación:', error)
      }
    }, 500) // Esperar 500ms para asegurar que todo esté inicializado
  }
}) 