export default defineNuxtRouteMiddleware((to, from) => {
  // Solo ejecutar en el cliente
  if (process.client) {
    try {
      console.log('Middleware Auth - Verificando autenticación para:', to.path)
      
      // Verificar si hay token en localStorage
      const token = localStorage.getItem('auth_token')
      const userData = localStorage.getItem('user_data')
      
      console.log('Middleware Auth - Token:', token ? 'Presente' : 'No presente')
      console.log('Middleware Auth - UserData:', userData ? 'Presente' : 'No presente')
      
      // Si no hay token o datos de usuario y no está en una página de auth
      if ((!token || !userData) && !to.path.startsWith('/auth/')) {
        console.log('Middleware: Usuario no autenticado, redirigiendo a login')
        // Redirigir al login con la página actual como redirect
        return navigateTo(`/auth/login?redirect=${encodeURIComponent(to.fullPath)}`)
      }
      
      // Si hay token y datos pero está en una página de auth
      if (token && userData && to.path.startsWith('/auth/')) {
        console.log('Middleware: Usuario autenticado en página de auth, redirigiendo a home')
        // Redirigir al dashboard
        return navigateTo('/')
      }
      
      console.log('Middleware Auth - Usuario autenticado, permitiendo acceso')
    } catch (error) {
      console.error('Error en middleware de autenticación:', error)
      // En caso de error, redirigir al login
      return navigateTo('/auth/login')
    }
  }
}) 