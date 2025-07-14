export default defineNuxtRouteMiddleware((to, from) => {
  // Solo ejecutar en el cliente y en rutas que no sean de autenticación
  if (process.client && !to.path.startsWith('/auth/')) {
    const { checkAuth } = useAuth()
    
    // Verificar autenticación de forma asíncrona sin bloquear la navegación
    checkAuth().catch(error => {
      console.error('Error verificando autenticación en middleware:', error)
    })
  }
}) 