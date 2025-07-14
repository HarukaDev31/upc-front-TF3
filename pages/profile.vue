<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Header -->
    <section class="bg-white border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-slate-900 mb-2">Mi Perfil</h1>
            <p class="text-slate-600">Gestiona tu información personal y preferencias</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Contenido -->
    <section class="py-12">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Estado de carga -->
        <div v-if="loading" class="text-center py-12">
          <div class="w-8 h-8 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-slate-600">Cargando perfil...</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <svg class="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-lg font-semibold text-red-900 mb-2">Error al cargar perfil</h3>
          <p class="text-red-700 mb-4">{{ error }}</p>
          <button 
            @click="cargarPerfil"
            class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Intentar de nuevo
          </button>
        </div>

        <!-- Perfil del usuario -->
        <div v-else-if="usuario" class="space-y-8">
          <!-- Información Personal -->
          <div class="bg-white rounded-lg border border-slate-200 p-8">
            <div class="flex items-center space-x-6 mb-6">
              <div class="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center">
                <span class="text-2xl font-bold text-white">
                  {{ usuario.nombre?.charAt(0).toUpperCase() }}
                </span>
              </div>
              <div>
                <h2 class="text-2xl font-bold text-slate-900">{{ usuario.nombre }} {{ usuario.apellido }}</h2>
                <p class="text-slate-600">{{ usuario.email }}</p>
                <div class="flex items-center space-x-2 mt-2">
                  <span 
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="usuario.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  >
                    {{ usuario.activo ? 'Activo' : 'Inactivo' }}
                  </span>
                  <span class="text-xs text-slate-500">
                    Miembro desde {{ formatDate(usuario.fecha_registro) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Formulario de edición -->
            <form @submit.prevent="guardarCambios" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">Nombre</label>
                  <input
                    v-model="formulario.nombre"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">Apellido</label>
                  <input
                    v-model="formulario.apellido"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input
                    v-model="formulario.email"
                    type="email"
                    required
                    class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">Teléfono</label>
                  <input
                    v-model="formulario.telefono"
                    type="tel"
                    class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
              </div>

              <!-- Botones de acción -->
              <div class="flex items-center space-x-4 pt-6 border-t border-slate-200">
                <button
                  type="submit"
                  :disabled="guardando"
                  class="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <div v-if="guardando" class="flex items-center space-x-2">
                    <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Guardando...</span>
                  </div>
                  <span v-else>Guardar Cambios</span>
                </button>
                
                <button
                  type="button"
                  @click="restaurarFormulario"
                  class="border border-slate-300 text-slate-700 px-6 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Restaurar
                </button>
              </div>
            </form>
          </div>

          <!-- Información de la cuenta -->
          <div class="bg-white rounded-lg border border-slate-200 p-8">
            <h3 class="text-lg font-semibold text-slate-900 mb-6">Información de la Cuenta</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <span class="text-sm font-medium text-slate-600">ID de Usuario</span>
                <p class="font-mono text-slate-900 text-sm">{{ usuario.id }}</p>
              </div>
              
              <div>
                <span class="text-sm font-medium text-slate-600">Estado de la Cuenta</span>
                <p class="text-slate-900">{{ usuario.activo ? 'Activa' : 'Inactiva' }}</p>
              </div>
              
              <div>
                <span class="text-sm font-medium text-slate-600">Fecha de Registro</span>
                <p class="text-slate-900">{{ formatDate(usuario.fecha_registro) }}</p>
              </div>
              
              <div>
                <span class="text-sm font-medium text-slate-600">Última Actualización</span>
                <p class="text-slate-900">{{ formatDate(usuario.fecha_registro) }}</p>
              </div>
            </div>
          </div>

          <!-- Acciones de seguridad -->
          <div class="bg-white rounded-lg border border-slate-200 p-8">
            <h3 class="text-lg font-semibold text-slate-900 mb-6">Seguridad</h3>
            
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <h4 class="font-medium text-slate-900">Cambiar Contraseña</h4>
                  <p class="text-sm text-slate-600">Actualiza tu contraseña para mayor seguridad</p>
                </div>
                <button
                  @click="mostrarModalPassword = true"
                  class="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Cambiar
                </button>
              </div>
              
              <div class="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <h4 class="font-medium text-slate-900">Cerrar Sesión</h4>
                  <p class="text-sm text-slate-600">Cierra tu sesión en todos los dispositivos</p>
                </div>
                <button
                  @click="cerrarSesion"
                  class="border border-red-300 text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Modal para cambiar contraseña -->
    <div v-if="mostrarModalPassword" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-md w-full">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-slate-900">Cambiar Contraseña</h3>
            <button 
              @click="mostrarModalPassword = false"
              class="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="cambiarPassword" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Contraseña Actual</label>
              <input
                v-model="passwordForm.actual"
                type="password"
                required
                class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Nueva Contraseña</label>
              <input
                v-model="passwordForm.nueva"
                type="password"
                required
                class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Confirmar Nueva Contraseña</label>
              <input
                v-model="passwordForm.confirmar"
                type="password"
                required
                class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
            
            <div class="flex space-x-3 pt-4">
              <button
                type="submit"
                :disabled="cambiandoPassword"
                class="flex-1 bg-slate-900 text-white py-2 px-4 rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <div v-if="cambiandoPassword" class="flex items-center justify-center space-x-2">
                  <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Cambiando...</span>
                </div>
                <span v-else>Cambiar Contraseña</span>
              </button>
              
              <button
                type="button"
                @click="mostrarModalPassword = false"
                class="flex-1 border border-slate-300 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const api = useApi()
const { currentUser, logout } = useAuth()
const router = useRouter()

// Estado
const loading = ref(true)
const error = ref(null)
const usuario = ref(null)
const guardando = ref(false)
const cambiandoPassword = ref(false)
const mostrarModalPassword = ref(false)

// Formulario de edición
const formulario = ref({
  nombre: '',
  apellido: '',
  email: '',
  telefono: ''
})

// Formulario de contraseña
const passwordForm = ref({
  actual: '',
  nueva: '',
  confirmar: ''
})

// Métodos
const cargarPerfil = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await api.getCurrentUser()
    
    if (response.success) {
      usuario.value = response.data
      // Inicializar formulario con datos del usuario
      formulario.value = {
        nombre: usuario.value.nombre || '',
        apellido: usuario.value.apellido || '',
        email: usuario.value.email || '',
        telefono: usuario.value.telefono || ''
      }
      console.log('Perfil cargado:', usuario.value)
    } else {
      error.value = response.error || 'Error al cargar perfil'
    }
  } catch (err) {
    console.error('Error cargando perfil:', err)
    error.value = 'Error de conexión al cargar perfil'
  } finally {
    loading.value = false
  }
}

const guardarCambios = async () => {
  guardando.value = true
  
  try {
    const response = await api.updateUser(usuario.value.id, {
      nombre: formulario.value.nombre,
      apellido: formulario.value.apellido,
      email: formulario.value.email,
      telefono: formulario.value.telefono
    })
    
    if (response.success) {
      // Actualizar datos del usuario en el store
      usuario.value = { ...usuario.value, ...formulario.value }
      alert('Perfil actualizado correctamente')
    } else {
      alert('Error al actualizar perfil: ' + response.error)
    }
  } catch (err) {
    console.error('Error actualizando perfil:', err)
    alert('Error al actualizar perfil')
  } finally {
    guardando.value = false
  }
}

const restaurarFormulario = () => {
  formulario.value = {
    nombre: usuario.value.nombre || '',
    apellido: usuario.value.apellido || '',
    email: usuario.value.email || '',
    telefono: usuario.value.telefono || ''
  }
}

const cambiarPassword = async () => {
  if (passwordForm.value.nueva !== passwordForm.value.confirmar) {
    alert('Las contraseñas no coinciden')
    return
  }
  
  cambiandoPassword.value = true
  
  try {
    // Aquí implementarías la llamada a la API para cambiar contraseña
    console.log('Cambiando contraseña...')
    alert('Funcionalidad de cambio de contraseña en desarrollo')
    
    // Limpiar formulario
    passwordForm.value = {
      actual: '',
      nueva: '',
      confirmar: ''
    }
    mostrarModalPassword.value = false
  } catch (err) {
    console.error('Error cambiando contraseña:', err)
    alert('Error al cambiar contraseña')
  } finally {
    cambiandoPassword.value = false
  }
}

const cerrarSesion = async () => {
  if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
    logout()
    await router.push('/auth/login')
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Cargar perfil al montar
onMounted(() => {
  cargarPerfil()
})
</script> 