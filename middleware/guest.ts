export default defineNuxtRouteMiddleware((to, from) => {
  // Solo ejecutar en el cliente
  if (process.client) {
    try {
      // Verificar si hay token en localStorage
      const token = localStorage.getItem('auth_token')
      const userData = localStorage.getItem('user_data')
      
      // Si hay token y datos pero está en una página de auth
      if (token && userData && to.path.startsWith('/auth/')) {
        console.log('Middleware Guest: Usuario autenticado en página de auth, redirigiendo a home')
        // Redirigir al dashboard
        return navigateTo('/')
      }
    } catch (error) {
      console.error('Error en middleware guest:', error)
    }
  }
}) 