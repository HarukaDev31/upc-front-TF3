export default defineNuxtPlugin(async () => {
  // Solo ejecutar en el cliente y después de que la aplicación esté montada
  if (process.client) {
    // Esperar a que la aplicación esté completamente inicializada
    await nextTick()
    
    try {
      const { checkAuth } = useAuth()
      
      // Verificar autenticación al cargar la aplicación
      await checkAuth()
    } catch (error) {
      console.error('Error en plugin de autenticación:', error)
    }
  }
}) 