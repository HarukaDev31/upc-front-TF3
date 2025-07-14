<template>
  <div>
    <!-- Header -->
    <section class="bg-gradient-to-r from-purple-600 to-pink-600 py-16">
      <div class="container mx-auto px-4 text-center text-white">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Mis Transacciones</h1>
        <p class="text-xl text-purple-100">Historial de compras y transacciones</p>
      </div>
    </section>

    <!-- Contenido principal -->
    <section class="py-12 bg-gray-50">
      <div class="container mx-auto px-4">
        <!-- Filtros y búsqueda -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div class="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <!-- Búsqueda -->
            <div class="flex-1 max-w-md">
              <UInput
                v-model="filtros.numeroFactura"
                placeholder="Buscar por número de factura..."
                icon="heroicons:magnifying-glass"
                @input="filtrarTransacciones"
              />
            </div>

            <!-- Filtros -->
            <div class="flex flex-wrap gap-4">
              <USelect
                v-model="filtros.estado"
                :options="opcionesEstado"
                placeholder="Estado"
                class="w-40"
                @update:model-value="filtrarTransacciones"
              />
              
              <USelect
                v-model="filtros.metodoPago"
                :options="opcionesMetodoPago"
                placeholder="Método de pago"
                class="w-40"
                @update:model-value="filtrarTransacciones"
              />
            </div>

            <!-- Ordenar -->
            <USelect
              v-model="orden"
              :options="opcionesOrden"
              placeholder="Ordenar por"
              class="w-40"
              @update:model-value="ordenarTransacciones"
            />
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex justify-center py-12">
          <UIcon name="heroicons:arrow-path" class="w-8 h-8 animate-spin text-purple-500" />
        </div>

        <!-- Error -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <UIcon name="heroicons:exclamation-triangle" class="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-red-800 mb-2">Error al cargar transacciones</h3>
          <p class="text-red-600 mb-4">{{ error }}</p>
          <UButton @click="cargarTransacciones" color="red" variant="outline">
            Intentar de nuevo
          </UButton>
        </div>

        <!-- Lista de transacciones -->
        <div v-else-if="transaccionesFiltradas.length > 0" class="space-y-6">
          <div 
            v-for="transaccion in transaccionesFiltradas" 
            :key="transaccion.id"
            class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <!-- Header de la transacción -->
            <div class="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
              <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h3 class="text-xl font-bold mb-2">{{ transaccion.numero_factura }}</h3>
                  <p class="text-purple-100">{{ formatDate(transaccion.fecha) }}</p>
                </div>
                <div class="flex items-center gap-4">
                  <UBadge 
                    :color="getEstadoColor(transaccion.estado)"
                    variant="solid"
                    class="text-sm font-semibold"
                  >
                    {{ getEstadoText(transaccion.estado) }}
                  </UBadge>
                  <UButton
                    @click="verDetalles(transaccion)"
                    variant="outline"
                    color="white"
                    size="sm"
                  >
                    Ver Detalles
                  </UButton>
                </div>
              </div>
            </div>

            <!-- Contenido de la transacción -->
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <!-- Información básica -->
                <div>
                  <h4 class="font-semibold text-gray-900 mb-2">Información</h4>
                  <div class="space-y-1 text-sm text-gray-600">
                    <p><span class="font-medium">ID:</span> {{ transaccion.id }}</p>
                    <p><span class="font-medium">Función:</span> {{ transaccion.funcion_id }}</p>
                    <p><span class="font-medium">Método:</span> {{ getMetodoPagoText(transaccion.metodo_pago) }}</p>
                  </div>
                </div>

                <!-- Asientos -->
                <div>
                  <h4 class="font-semibold text-gray-900 mb-2">Asientos</h4>
                  <div class="flex flex-wrap gap-1">
                    <UBadge 
                      v-for="asiento in transaccion.asientos" 
                      :key="asiento"
                      color="purple"
                      variant="soft"
                      class="text-xs"
                    >
                      {{ asiento }}
                    </UBadge>
                  </div>
                </div>

                <!-- Total -->
                <div>
                  <h4 class="font-semibold text-gray-900 mb-2">Total</h4>
                  <p class="text-2xl font-bold text-green-600">
                    ${{ formatCurrency(transaccion.total) }}
                  </p>
                </div>

                <!-- Acciones -->
                <div>
                  <h4 class="font-semibold text-gray-900 mb-2">Acciones</h4>
                  <div class="space-y-2">
                    <UButton
                      v-if="transaccion.estado === 'confirmado'"
                      @click="cancelarTransaccion(transaccion.id)"
                      color="red"
                      variant="outline"
                      size="sm"
                      :loading="cancelando === transaccion.id"
                    >
                      Cancelar
                    </UButton>
                    <UButton
                      @click="descargarComprobante(transaccion)"
                      color="purple"
                      variant="outline"
                      size="sm"
                    >
                      Descargar
                    </UButton>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Paginación -->
          <div v-if="totalPaginas > 1" class="flex justify-center mt-8">
            <UPagination
              v-model="paginaActual"
              :page-count="totalPaginas"
              :total="totalTransacciones"
              @update:model-value="cambiarPagina"
            />
          </div>
        </div>

        <!-- Sin transacciones -->
        <div v-else class="bg-white rounded-xl shadow-lg p-12 text-center">
          <UIcon name="heroicons:document-text" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No hay transacciones</h3>
          <p class="text-gray-600 mb-6">Aún no has realizado ninguna compra</p>
          <UButton to="/peliculas" color="purple">
            Ver Películas
          </UButton>
        </div>
      </div>
    </section>

    <!-- Modal de detalles -->
    <UModal v-model="detallesAbierto" :ui="{ width: 'sm:max-w-4xl' }">
      <div v-if="transaccionSeleccionada" class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Detalles de Transacción</h2>
          <UButton @click="detallesAbierto = false" variant="ghost" color="gray">
            <UIcon name="heroicons:x-mark" class="w-5 h-5" />
          </UButton>
        </div>

        <!-- Información detallada -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Información básica -->
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Información General</h3>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600">Número de Factura:</span>
                  <span class="font-medium">{{ transaccionSeleccionada.numero_factura }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">ID de Transacción:</span>
                  <span class="font-medium">{{ transaccionSeleccionada.id }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Fecha:</span>
                  <span class="font-medium">{{ formatDateTime(transaccionSeleccionada.fecha_creacion) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Estado:</span>
                  <UBadge :color="getEstadoColor(transaccionSeleccionada.estado)">
                    {{ getEstadoText(transaccionSeleccionada.estado) }}
                  </UBadge>
                </div>
              </div>
            </div>

            <!-- Asientos -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Asientos</h3>
              <div class="flex flex-wrap gap-2">
                <UBadge 
                  v-for="asiento in transaccionSeleccionada.asientos" 
                  :key="asiento"
                  color="purple"
                  variant="solid"
                >
                  {{ asiento }}
                </UBadge>
              </div>
            </div>

            <!-- Método de pago -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Método de Pago</h3>
              <div class="flex items-center gap-3">
                <UIcon :name="getMetodoPagoIcon(transaccionSeleccionada.metodo_pago)" class="w-6 h-6 text-purple-500" />
                <span class="font-medium">{{ getMetodoPagoText(transaccionSeleccionada.metodo_pago) }}</span>
              </div>
            </div>
          </div>

          <!-- Resumen financiero -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Resumen Financiero</h3>
            <div class="bg-gray-50 rounded-lg p-4 space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600">Subtotal:</span>
                <span class="font-medium">${{ formatCurrency(transaccionSeleccionada.subtotal || 0) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Descuentos:</span>
                <span class="font-medium text-green-600">-${{ formatCurrency(transaccionSeleccionada.descuento_cliente || 0) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Impuestos:</span>
                <span class="font-medium">${{ formatCurrency(transaccionSeleccionada.impuestos || 0) }}</span>
              </div>
              <div class="border-t pt-3">
                <div class="flex justify-between">
                  <span class="text-lg font-semibold text-gray-900">Total:</span>
                  <span class="text-lg font-bold text-green-600">${{ formatCurrency(transaccionSeleccionada.total) }}</span>
                </div>
              </div>
            </div>

            <!-- Acciones -->
            <div class="mt-6 space-y-3">
              <UButton
                v-if="transaccionSeleccionada.puede_cancelar"
                @click="cancelarTransaccion(transaccionSeleccionada.id)"
                color="red"
                variant="outline"
                class="w-full"
                :loading="cancelando === transaccionSeleccionada.id"
              >
                Cancelar Transacción
              </UButton>
              <UButton
                @click="descargarComprobante(transaccionSeleccionada)"
                color="purple"
                variant="outline"
                class="w-full"
              >
                Descargar Comprobante
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup>
// Middleware de autenticación
definePageMeta({
  middleware: 'auth'
})

const api = useApi()

// Estado
const loading = ref(false)
const error = ref(null)
const transacciones = ref([])
const transaccionesFiltradas = ref([])
const paginaActual = ref(1)
const totalTransacciones = ref(0)
const totalPaginas = ref(0)
const limite = 10

// Modal de detalles
const detallesAbierto = ref(false)
const transaccionSeleccionada = ref(null)
const cancelando = ref(null)

// Filtros
const filtros = ref({
  numeroFactura: '',
  estado: '',
  metodoPago: ''
})

const orden = ref('fecha_desc')

// Opciones
const opcionesEstado = [
  { label: 'Todos', value: '' },
  { label: 'Confirmado', value: 'confirmado' },
  { label: 'Pendiente', value: 'pendiente' },
  { label: 'Cancelado', value: 'cancelado' },
  { label: 'Procesando', value: 'procesando' }
]

const opcionesMetodoPago = [
  { label: 'Todos', value: '' },
  { label: 'Tarjeta de Crédito', value: 'tarjeta_credito' },
  { label: 'Tarjeta de Débito', value: 'tarjeta_debito' },
  { label: 'Efectivo', value: 'efectivo' },
  { label: 'Transferencia', value: 'transferencia' },
  { label: 'Puntos', value: 'puntos' }
]

const opcionesOrden = [
  { label: 'Fecha (más reciente)', value: 'fecha_desc' },
  { label: 'Fecha (más antigua)', value: 'fecha_asc' },
  { label: 'Total (mayor)', value: 'total_desc' },
  { label: 'Total (menor)', value: 'total_asc' }
]

// Cargar transacciones
const cargarTransacciones = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await api.getHistorialCompras(limite)
    
    if (response.success && response.data) {
      transacciones.value = response.data.transacciones || []
      totalTransacciones.value = response.data.total || 0
      totalPaginas.value = Math.ceil(totalTransacciones.value / limite)
      filtrarTransacciones()
    } else {
      error.value = response.error || 'Error al cargar las transacciones'
    }
  } catch (err) {
    error.value = 'Error de conexión'
    console.error('Error cargando transacciones:', err)
  } finally {
    loading.value = false
  }
}

// Filtrar transacciones
const filtrarTransacciones = () => {
  let filtradas = [...transacciones.value]
  
  // Filtro por número de factura
  if (filtros.value.numeroFactura) {
    filtradas = filtradas.filter(t => 
      t.numero_factura.toLowerCase().includes(filtros.value.numeroFactura.toLowerCase())
    )
  }
  
  // Filtro por estado
  if (filtros.value.estado) {
    filtradas = filtradas.filter(t => t.estado === filtros.value.estado)
  }
  
  // Filtro por método de pago
  if (filtros.value.metodoPago) {
    filtradas = filtradas.filter(t => t.metodo_pago === filtros.value.metodoPago)
  }
  
  transaccionesFiltradas.value = filtradas
}

// Ordenar transacciones
const ordenarTransacciones = () => {
  const ordenadas = [...transaccionesFiltradas.value]
  
  switch (orden.value) {
    case 'fecha_desc':
      ordenadas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
      break
    case 'fecha_asc':
      ordenadas.sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
      break
    case 'total_desc':
      ordenadas.sort((a, b) => b.total - a.total)
      break
    case 'total_asc':
      ordenadas.sort((a, b) => a.total - b.total)
      break
  }
  
  transaccionesFiltradas.value = ordenadas
}

// Cambiar página
const cambiarPagina = (nuevaPagina) => {
  paginaActual.value = nuevaPagina
  cargarTransacciones()
}

// Ver detalles de transacción
const verDetalles = async (transaccion) => {
  try {
    const response = await api.getDetallesTransaccion(transaccion.id)
    
    if (response.success && response.data) {
      transaccionSeleccionada.value = response.data
      detallesAbierto.value = true
    } else {
      console.error('Error cargando detalles:', response.error)
    }
  } catch (err) {
    console.error('Error cargando detalles:', err)
  }
}

// Cancelar transacción
const cancelarTransaccion = async (transaccionId) => {
  if (!confirm('¿Estás seguro de que quieres cancelar esta transacción?')) {
    return
  }
  
  cancelando.value = transaccionId
  
  try {
    const response = await api.cancelarTransaccion(transaccionId)
    
    if (response.success) {
      // Actualizar la transacción en la lista
      const index = transacciones.value.findIndex(t => t.id === transaccionId)
      if (index !== -1) {
        transacciones.value[index].estado = 'cancelado'
        filtrarTransacciones()
      }
      
      // Cerrar modal si está abierto
      if (detallesAbierto.value && transaccionSeleccionada.value?.id === transaccionId) {
        transaccionSeleccionada.value.estado = 'cancelado'
      }
      
      // Mostrar notificación
      alert('Transacción cancelada exitosamente')
    } else {
      alert('Error al cancelar la transacción: ' + response.error)
    }
  } catch (err) {
    console.error('Error cancelando transacción:', err)
    alert('Error al cancelar la transacción')
  } finally {
    cancelando.value = null
  }
}

// Descargar comprobante
const descargarComprobante = (transaccion) => {
  // Simular descarga de comprobante
  const contenido = `
    COMPROBANTE DE COMPRA
    ====================
    
    Número de Factura: ${transaccion.numero_factura}
    ID de Transacción: ${transaccion.id}
    Fecha: ${formatDateTime(transaccion.fecha_creacion || transaccion.fecha)}
    Estado: ${getEstadoText(transaccion.estado)}
    
    Asientos: ${transaccion.asientos.join(', ')}
    Total: $${formatCurrency(transaccion.total)}
    Método de Pago: ${getMetodoPagoText(transaccion.metodo_pago)}
    
    Gracias por su compra!
  `
  
  const blob = new Blob([contenido], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `comprobante-${transaccion.numero_factura}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Funciones helper
const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDateTime = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CO').format(amount)
}

const getEstadoColor = (estado) => {
  switch (estado) {
    case 'confirmado': return 'green'
    case 'pendiente': return 'yellow'
    case 'cancelado': return 'red'
    case 'procesando': return 'blue'
    default: return 'gray'
  }
}

const getEstadoText = (estado) => {
  switch (estado) {
    case 'confirmado': return 'Confirmado'
    case 'pendiente': return 'Pendiente'
    case 'cancelado': return 'Cancelado'
    case 'procesando': return 'Procesando'
    default: return estado
  }
}

const getMetodoPagoText = (metodo) => {
  switch (metodo) {
    case 'tarjeta_credito': return 'Tarjeta de Crédito'
    case 'tarjeta_debito': return 'Tarjeta de Débito'
    case 'efectivo': return 'Efectivo'
    case 'transferencia': return 'Transferencia'
    case 'puntos': return 'Puntos'
    default: return metodo
  }
}

const getMetodoPagoIcon = (metodo) => {
  switch (metodo) {
    case 'tarjeta_credito':
    case 'tarjeta_debito':
      return 'heroicons:credit-card'
    case 'efectivo':
      return 'heroicons:banknotes'
    case 'transferencia':
      return 'heroicons:arrow-path'
    case 'puntos':
      return 'heroicons:gift'
    default:
      return 'heroicons:credit-card'
  }
}

// Cargar datos al montar el componente
onMounted(() => {
  cargarTransacciones()
})
</script> 