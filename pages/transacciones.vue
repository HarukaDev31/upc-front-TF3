<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Header -->
    <section class="bg-white border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-slate-900 mb-2">Mis Transacciones</h1>
            <p class="text-slate-600">Historial de todas tus compras y reservas</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Contenido -->
    <section class="py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Filtros -->
        <div class="mb-8">
          <div class="flex flex-wrap gap-4 items-center">
            <div class="flex items-center space-x-4">
              <label class="text-sm font-medium text-slate-700">Filtrar por:</label>
              <select 
                v-model="filtroEstado" 
                class="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option value="">Todos los estados</option>
                <option value="confirmado">Confirmado</option>
                <option value="pendiente">Pendiente</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
            
            <div class="flex items-center space-x-4">
              <label class="text-sm font-medium text-slate-700">Ordenar por:</label>
              <select 
                v-model="ordenarPor" 
                class="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option value="fecha_desc">Más recientes</option>
                <option value="fecha_asc">Más antiguos</option>
                <option value="total_desc">Mayor monto</option>
                <option value="total_asc">Menor monto</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Estado de carga -->
        <div v-if="loading" class="text-center py-12">
          <div class="w-8 h-8 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-slate-600">Cargando transacciones...</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <svg class="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-lg font-semibold text-red-900 mb-2">Error al cargar transacciones</h3>
          <p class="text-red-700 mb-4">{{ error }}</p>
          <button 
            @click="cargarTransacciones"
            class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Intentar de nuevo
          </button>
        </div>

        <!-- Lista de transacciones -->
        <div v-else-if="transacciones.length > 0" class="space-y-6">
          <div 
            v-for="transaccion in transaccionesFiltradas" 
            :key="transaccion.id"
            class="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-3">
                  <h3 class="text-lg font-semibold text-slate-900">
                    {{ transaccion.pelicula?.titulo || 'Película no disponible' }}
                  </h3>
                  <span 
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="{
                      'bg-green-100 text-green-800': transaccion.estado === 'confirmado',
                      'bg-yellow-100 text-yellow-800': transaccion.estado === 'pendiente',
                      'bg-red-100 text-red-800': transaccion.estado === 'cancelado'
                    }"
                  >
                    {{ transaccion.estado?.toUpperCase() }}
                  </span>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-slate-600">
                  <div>
                    <span class="font-medium">Número de Factura:</span>
                    <p class="font-mono">{{ transaccion.numero_factura }}</p>
                  </div>
                  <div>
                    <span class="font-medium">Fecha:</span>
                    <p>{{ formatDate(transaccion.fecha) }}</p>
                  </div>
                  <div>
                    <span class="font-medium">Sala:</span>
                    <p>{{ transaccion.sala?.nombre || 'N/A' }}</p>
                  </div>
                  <div>
                    <span class="font-medium">Asientos:</span>
                    <p>{{ transaccion.asientos?.join(', ') || 'N/A' }}</p>
                  </div>
                </div>
                
                <div class="mt-4 pt-4 border-t border-slate-200">
                  <div class="flex items-center justify-between">
                    <div class="text-sm text-slate-600">
                      <span class="font-medium">Método de pago:</span>
                      <span class="ml-2">{{ transaccion.metodo_pago?.toUpperCase() }}</span>
                    </div>
                    <div class="text-right">
                      <span class="text-sm text-slate-600">Total:</span>
                      <p class="text-lg font-bold text-slate-900">${{ formatCurrency(transaccion.total) }}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="flex items-center space-x-2 ml-4">
                <button
                  @click="descargarComprobante(transaccion)"
                  class="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Descargar comprobante"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </button>
                
                <button
                  @click="verDetalles(transaccion)"
                  class="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Ver detalles"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Sin transacciones -->
        <div v-else class="text-center py-12">
          <svg class="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <h3 class="text-lg font-semibold text-slate-900 mb-2">No hay transacciones</h3>
          <p class="text-slate-600 mb-6">Aún no has realizado ninguna compra.</p>
          <NuxtLink 
            to="/peliculas"
            class="inline-flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M6 20h12M4 12h16"></path>
            </svg>
            Ver Películas
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Modal de detalles -->
    <div v-if="mostrarModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-slate-900">Detalles de la Transacción</h3>
            <button 
              @click="mostrarModal = false"
              class="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div v-if="transaccionSeleccionada" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span class="text-sm font-medium text-slate-600">Número de Factura</span>
                <p class="font-mono text-slate-900">{{ transaccionSeleccionada.numero_factura }}</p>
              </div>
              <div>
                <span class="text-sm font-medium text-slate-600">Estado</span>
                <p class="text-slate-900">{{ transaccionSeleccionada.estado?.toUpperCase() }}</p>
              </div>
              <div>
                <span class="text-sm font-medium text-slate-600">Película</span>
                <p class="text-slate-900">{{ transaccionSeleccionada.pelicula?.titulo }}</p>
              </div>
              <div>
                <span class="text-sm font-medium text-slate-600">Sala</span>
                <p class="text-slate-900">{{ transaccionSeleccionada.sala?.nombre }}</p>
              </div>
              <div>
                <span class="text-sm font-medium text-slate-600">Fecha</span>
                <p class="text-slate-900">{{ formatDate(transaccionSeleccionada.fecha) }}</p>
              </div>
              <div>
                <span class="text-sm font-medium text-slate-600">Asientos</span>
                <p class="text-slate-900">{{ transaccionSeleccionada.asientos?.join(', ') }}</p>
              </div>
            </div>
            
            <div class="border-t border-slate-200 pt-4">
              <div class="flex justify-between items-center">
                <span class="text-lg font-semibold text-slate-900">Total</span>
                <span class="text-2xl font-bold text-slate-900">${{ formatCurrency(transaccionSeleccionada.total) }}</span>
              </div>
            </div>
          </div>
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
const { currentUser } = useAuth()

// Estado
const loading = ref(true)
const error = ref(null)
const transacciones = ref([])
const filtroEstado = ref('')
const ordenarPor = ref('fecha_desc')
const mostrarModal = ref(false)
const transaccionSeleccionada = ref(null)

// Computed
const transaccionesFiltradas = computed(() => {
  let filtradas = [...transacciones.value]
  
  // Filtrar por estado
  if (filtroEstado.value) {
    filtradas = filtradas.filter(t => t.estado === filtroEstado.value)
  }
  
  // Ordenar
  switch (ordenarPor.value) {
    case 'fecha_desc':
      filtradas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
      break
    case 'fecha_asc':
      filtradas.sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
      break
    case 'total_desc':
      filtradas.sort((a, b) => b.total - a.total)
      break
    case 'total_asc':
      filtradas.sort((a, b) => a.total - b.total)
      break
  }
  
  return filtradas
})

// Métodos
const cargarTransacciones = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await api.getTransaccionesUsuario(20)
    
    if (response.success) {
      // El endpoint devuelve { transacciones: [...], total: number }
      transacciones.value = response.data?.transacciones || []
      console.log('Transacciones cargadas:', transacciones.value)
    } else {
      error.value = response.error || 'Error al cargar transacciones'
    }
  } catch (err) {
    console.error('Error cargando transacciones:', err)
    error.value = 'Error de conexión al cargar transacciones'
  } finally {
    loading.value = false
  }
}

const descargarComprobante = async (transaccion) => {
  try {
    // Aquí implementarías la lógica para descargar el comprobante
    console.log('Descargando comprobante para:', transaccion.numero_factura)
    // Por ahora solo mostramos un alert
    alert(`Descargando comprobante para ${transaccion.numero_factura}`)
  } catch (err) {
    console.error('Error descargando comprobante:', err)
    alert('Error al descargar el comprobante')
  }
}

const verDetalles = (transaccion) => {
  transaccionSeleccionada.value = transaccion
  mostrarModal.value = true
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

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

// Cargar transacciones al montar
onMounted(() => {
  cargarTransacciones()
})
</script> 