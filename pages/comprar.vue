<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Header -->
    <section class="bg-white border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-slate-900 mb-2">Completar Compra</h1>
            <p class="text-slate-600">Finaliza tu reserva de entradas</p>
          </div>
          <NuxtLink 
            to="/peliculas"
            class="border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Contenido -->
    <section class="py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Formulario de Compra -->
          <div class="bg-white rounded-lg border border-slate-200 p-8">
            <h2 class="text-2xl font-bold text-slate-900 mb-6">Datos del Cliente</h2>
            
            <form @submit.prevent="procesarCompra" class="space-y-6">
              <!-- Información Personal -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">Nombre</label>
                  <input
                    v-model="formulario.nombre"
                    type="text"
                    placeholder="Tu nombre completo"
                    required
                    class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input
                    v-model="formulario.email"
                    type="email"
                    placeholder="tu@email.com"
                    required
                    class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Teléfono</label>
                <input
                  v-model="formulario.telefono"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
              </div>

              <!-- Método de Pago -->
              <div>
                <h3 class="text-lg font-semibold text-slate-900 mb-4">Método de Pago</h3>
                <div class="space-y-3">
                  <label class="flex items-center space-x-3 cursor-pointer">
                    <input
                      v-model="formulario.metodoPago"
                      type="radio"
                      value="tarjeta"
                      class="text-slate-600"
                    />
                    <span class="text-slate-900">Tarjeta de Crédito</span>
                  </label>
                  <label class="flex items-center space-x-3 cursor-pointer">
                    <input
                      v-model="formulario.metodoPago"
                      type="radio"
                      value="efectivo"
                      class="text-slate-600"
                    />
                    <span class="text-slate-900">Efectivo en Taquilla</span>
                  </label>
                  <label class="flex items-center space-x-3 cursor-pointer">
                    <input
                      v-model="formulario.metodoPago"
                      type="radio"
                      value="paypal"
                      class="text-slate-600"
                    />
                    <span class="text-slate-900">Transferencia Bancaria</span>
                  </label>
                </div>
              </div>

              <!-- Información de Tarjeta (si aplica) -->
              <div v-if="formulario.metodoPago === 'tarjeta'" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">Número de Tarjeta</label>
                  <input
                    v-model="formulario.numeroTarjeta"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    required
                    class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">Fecha de Vencimiento</label>
                    <input
                      v-model="formulario.fechaVencimiento"
                      type="text"
                      placeholder="MM/YY"
                      required
                      class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">CVV</label>
                    <input
                      v-model="formulario.cvv"
                      type="password"
                      placeholder="123"
                      required
                      class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <!-- Términos y Condiciones -->
              <div class="flex items-start space-x-3">
                <input
                  v-model="formulario.aceptaTerminos"
                  type="checkbox"
                  class="mt-1 text-slate-600"
                  required
                />
                <span class="text-sm text-slate-600">
                  Acepto los 
                  <a href="#" class="text-slate-900 hover:underline">términos y condiciones</a>
                  y la 
                  <a href="#" class="text-slate-900 hover:underline">política de privacidad</a>
                </span>
              </div>

              <!-- Botón de Compra -->
              <button
                type="submit"
                :disabled="!formularioValido || procesando"
                class="w-full bg-slate-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <div v-if="procesando" class="flex items-center justify-center space-x-2">
                  <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Procesando...</span>
                </div>
                <span v-else>Pagar S/ {{ formatCurrency(totalPrecio) }}</span>
              </button>
              
              <!-- Mensaje de error si el formulario no es válido -->
              <div v-if="!formularioValido && asientosSeleccionados.value?.length > 0" class="bg-red-50 border border-red-200 rounded-lg p-4">
                <div class="flex items-center space-x-3 mb-2">
                  <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span class="text-red-700 font-medium">Por favor completa los siguientes campos:</span>
                </div>
                <div class="text-sm text-red-600 space-y-1">
                  <p v-if="!formulario.nombre">• Completa tu nombre</p>
                  <p v-if="!formulario.email">• Completa tu email</p>
                  <p v-if="!formulario.metodoPago">• Selecciona un método de pago</p>
                  <p v-if="formulario.metodoPago === 'tarjeta' && !formulario.numeroTarjeta">• Completa el número de tarjeta</p>
                  <p v-if="formulario.metodoPago === 'tarjeta' && (!formulario.numeroTarjeta || formulario.numeroTarjeta.length < 4)">• El número de tarjeta debe tener al menos 4 dígitos</p>
                  <p v-if="formulario.metodoPago === 'tarjeta' && !formulario.fechaVencimiento">• Completa la fecha de vencimiento</p>
                  <p v-if="formulario.metodoPago === 'tarjeta' && !formulario.cvv">• Completa el CVV</p>
                  <p v-if="!formulario.aceptaTerminos">• Acepta los términos y condiciones</p>
                  <p v-if="(asientosSeleccionados.value?.length || 0) === 0">• No hay asientos seleccionados</p>
                </div>
              </div>
            </form>
          </div>

          <!-- Resumen de Compra -->
          <div class="bg-white rounded-lg border border-slate-200 p-8">
            <h2 class="text-2xl font-bold text-slate-900 mb-6">Resumen de Compra</h2>
            
            <!-- Información de la Función -->
            <div class="bg-slate-50 rounded-lg p-4 mb-6">
              <h3 class="font-semibold text-slate-900 mb-2">{{ pelicula?.titulo || 'Película' }}</h3>
              <div class="space-y-1 text-sm text-slate-600">
                <div class="flex justify-between">
                  <span>Fecha:</span>
                  <span>{{ funcion?.fecha || 'Fecha no disponible' }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Hora:</span>
                  <span>{{ funcion?.hora || 'Hora no disponible' }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Sala:</span>
                  <span>{{ funcion?.sala_id || sala?.nombre || 'Sala no disponible' }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Precio por asiento:</span>
                  <span class="font-semibold text-slate-900">S/ {{ formatCurrency(precioPorAsiento) }}</span>
                </div>
              </div>
            </div>

            <!-- Asientos Seleccionados -->
            <div class="mb-6">
              <div class="flex items-center justify-between mb-3">
                <h3 class="font-semibold text-slate-900">Asientos Seleccionados</h3>
                <span class="text-sm text-slate-500">
                  {{ asientosSeleccionados.value?.length || 0 }} asiento{{ (asientosSeleccionados.value?.length || 0) !== 1 ? 's' : '' }}
                </span>
              </div>
              <div v-if="(asientosSeleccionados.value?.length || 0) === 0" class="text-center py-4 text-slate-500">
                <svg class="w-8 h-8 mx-auto mb-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p>No hay asientos seleccionados</p>
                <NuxtLink to="/peliculas" class="mt-2 inline-block border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors">
                  Seleccionar Asientos
                </NuxtLink>
              </div>
              <div v-else class="space-y-2">
                <div 
                  v-for="asiento in (asientosSeleccionados.value || [])" 
                  :key="asiento.id"
                  class="flex items-center justify-between bg-slate-50 p-3 rounded-lg"
                >
                  <span class="font-medium text-slate-900">{{ asiento.fila }}{{ asiento.numero }}</span>
                  <span class="text-slate-900 font-semibold">S/ {{ formatCurrency(precioPorAsiento) }}</span>
                </div>
              </div>
            </div>

            <!-- Desglose de Precios -->
            <div class="border-t border-slate-200 pt-4">
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-slate-500">Subtotal:</span>
                  <span class="text-slate-500">S/ {{ formatCurrency(subtotal) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500">Servicio:</span>
                  <span class="text-slate-500">S/ {{ formatCurrency(cargoServicio) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500">IVA:</span>
                  <span class="text-slate-500">S/ {{ formatCurrency(iva) }}</span>
                </div>
                <div class="border-t border-slate-200 pt-2">
                  <div class="flex justify-between">
                    <span class="font-bold text-lg text-slate-900">Total:</span>
                    <span class="font-bold text-lg text-slate-900">S/ {{ formatCurrency(totalPrecio) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Información Adicional -->
            <div class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 class="font-semibold text-blue-900 mb-2">Información Importante</h4>
              <ul class="text-sm text-blue-800 space-y-1">
                <li>• Llega 15 minutos antes de la función</li>
                <li>• Presenta tu comprobante en la entrada</li>
                <li>• No se permiten cambios ni devoluciones</li>
                <li>• Los asientos se liberan 5 minutos antes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Modal de Confirmación -->
    <div v-if="confirmacionAbierta" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-lg w-full">
        <div class="p-6">
          <div class="text-center mb-6">
            <svg class="w-12 h-12 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 class="text-xl font-semibold text-slate-900">¡Compra Exitosa!</h3>
          </div>

          <div class="space-y-4">
            <p class="text-slate-600 text-center">
              Tu compra ha sido procesada correctamente. Recibirás un email con los detalles de tu reserva.
            </p>
            
            <!-- Información de la transacción -->
            <div class="bg-slate-50 p-4 rounded-lg space-y-2">
              <div class="flex justify-between">
                <span class="font-semibold text-slate-900">Número de Factura:</span>
                <span class="text-slate-900 font-mono">{{ datosTransaccion?.numero_factura || numeroReserva }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-600">ID de Transacción:</span>
                <span class="text-slate-900 font-mono text-sm">{{ datosTransaccion?.transaccion_id }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-600">Estado:</span>
                <span class="text-green-600 font-semibold">{{ datosTransaccion?.estado?.toUpperCase() || 'CONFIRMADO' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-600">Total Pagado:</span>
                <span class="text-slate-900 font-semibold">S/ {{ formatCurrency(datosTransaccion?.total || totalPrecio) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-600">Asientos:</span>
                <span class="text-slate-900">{{ datosTransaccion?.asientos?.join(', ') || (asientosSeleccionados.value?.length || 0) + ' asientos' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-600">Código de Autorización:</span>
                <span class="text-slate-900 font-mono text-sm">{{ datosTransaccion?.resultado_pago?.codigo_autorizacion }}</span>
              </div>
            </div>
            
            <!-- Información adicional -->
            <div class="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p class="text-sm text-blue-800">
                <strong>Importante:</strong> Llega 15 minutos antes de la función y presenta este comprobante en la entrada.
              </p>
            </div>
          </div>

          <div class="flex gap-3 mt-6">
            <button @click="descargarComprobante" class="flex-1 bg-slate-900 text-white py-2 px-4 rounded-lg font-medium hover:bg-slate-800 transition-colors">
              Descargar Comprobante
            </button>
            <button @click="irAInicio" class="flex-1 border border-slate-300 text-slate-700 py-2 px-4 rounded-lg font-medium hover:bg-slate-50 transition-colors">
              Ir al Inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCineStore } from '~/stores/cine'

const route = useRoute()
const router = useRouter()
const api = useApi()
const cineStore = useCineStore()
const { asientosSeleccionados, limpiarAsientosSeleccionados } = cineStore

// Asegurar que asientosSeleccionados esté inicializado
if (!asientosSeleccionados.value) {
  asientosSeleccionados.value = []
}

// Estado
const procesando = ref(false)
const confirmacionAbierta = ref(false)
const numeroReserva = ref('')

// Datos de la compra
const pelicula = ref({
  titulo: 'Película de Ejemplo',
  id: 'pel_001'
})

const funcion = ref({
  id: route.query.funcion || '',
  fecha: '2024-12-20',
  hora: '20:00'
})

const sala = ref({
  nombre: 'Sala 1',
  tipo: '2D'
})

const precioPorAsiento = ref(15000) // Precio por defecto en pesos colombianos
const cargoServicio = ref(2000)

// Formulario
const formulario = ref({
  nombre: '',
  email: '',
  telefono: '',
  metodoPago: 'efectivo', // Cambiado a efectivo por defecto
  numeroTarjeta: '',
  fechaVencimiento: '',
  cvv: '',
  aceptaTerminos: false
})

// Computed
const subtotal = computed(() => {
  const cantidad = asientosSeleccionados.value?.length || 0
  const total = cantidad * precioPorAsiento.value
  console.log('Subtotal calculado:', { cantidad, precioPorAsiento: precioPorAsiento.value, total })
  return total
})

const iva = computed(() => {
  const ivaCalculado = subtotal.value * 0.16 // 16% IVA
  console.log('IVA calculado:', ivaCalculado)
  return ivaCalculado
})

const totalPrecio = computed(() => {
  const total = subtotal.value + cargoServicio.value + iva.value
  console.log('Total calculado:', { subtotal: subtotal.value, cargoServicio: cargoServicio.value, iva: iva.value, total })
  return total
})

const formularioValido = computed(() => {
  // Verificar que formulario esté inicializado
  if (!formulario || !formulario.value) {
    console.log('Formulario no inicializado')
    return false
  }
  
  const formData = formulario.value
  
  const tieneDatosBasicos = formData.nombre && 
                            formData.email && 
                            formData.metodoPago && 
                            formData.aceptaTerminos &&
                            (asientosSeleccionados.value?.length || 0) > 0
  
  // Validar datos de tarjeta si el método es tarjeta
  const datosTarjetaValidos = formData.metodoPago !== 'tarjeta' || 
                              (formData.numeroTarjeta && 
                               formData.fechaVencimiento && 
                               formData.cvv &&
                               formData.numeroTarjeta.length >= 4)
  
  const esValido = tieneDatosBasicos && datosTarjetaValidos
  
  // Debug logging
  console.log('=== VALIDACIÓN FORMULARIO ===')
  console.log('Formulario objeto:', formData)
  console.log('Nombre:', formData.nombre)
  console.log('Email:', formData.email)
  console.log('Método pago:', formData.metodoPago)
  console.log('Acepta términos:', formData.aceptaTerminos)
  console.log('Asientos seleccionados:', asientosSeleccionados.value?.length || 0)
  console.log('Tiene datos básicos:', tieneDatosBasicos)
  console.log('Datos tarjeta válidos:', datosTarjetaValidos)
  console.log('Formulario válido:', esValido)
  
  return esValido
})

// Procesar compra
const procesarCompra = async () => {
  if (!formularioValido.value) return
  
  procesando.value = true
  
  try {
    console.log('=== PROCESANDO COMPRA ===')
    console.log('Asientos seleccionados:', asientosSeleccionados.value)
    console.log('Formulario:', formulario.value)
    
    // Preparar datos para la API
    const asientosIds = asientosSeleccionados.value.map(asiento => asiento.id)
    const funcionId = route.query.funcion
    
    // Mapear el método de pago del frontend al backend
    const mapearMetodoPago = (metodoFrontend) => {
      switch (metodoFrontend) {
        case 'tarjeta':
          return 'tarjeta_credito' // Por defecto tarjeta de crédito
        case 'efectivo':
          return 'efectivo'
        case 'paypal':
          return 'transferencia' // PayPal se mapea a transferencia
        default:
          return 'efectivo'
      }
    }
    
    const datosCompra = {
      funcion_id: funcionId,
      asientos: asientosIds,
      metodo_pago: mapearMetodoPago(formulario.metodoPago),
      datos_pago: {
        referencia_externa: `REF-${Date.now()}`,
        ultimos_4_digitos: formulario.numeroTarjeta ? formulario.numeroTarjeta.slice(-4) : '0000',
        banco_emisor: 'Banco Virtual'
      }
    }
    
    console.log('Datos de compra a enviar:', datosCompra)
    
    // Llamar a la API
    const response = await api.comprarEntradaTransaccion(datosCompra)
    
    if (response.success) {
      console.log('Compra exitosa:', response.data)
      
      // Guardar datos de la transacción
      datosTransaccion.value = response.data
      numeroReserva.value = response.data.numero_factura
      
      // Mostrar confirmación
      confirmacionAbierta.value = true
      
      // Limpiar carrito
      limpiarAsientosSeleccionados()
      
      // Limpiar datos de localStorage
      if (process.client) {
        localStorage.removeItem(`datos_compra_${funcionId}`)
      }
      
    } else {
      console.error('Error en la compra:', response.error)
      // Mostrar error al usuario
      alert(`Error al procesar la compra: ${response.error}`)
    }
    
  } catch (error) {
    console.error('Error procesando compra:', error)
    alert('Error al procesar la compra. Por favor, intenta de nuevo.')
  } finally {
    procesando.value = false
  }
}

// Variable para almacenar los datos de la transacción
const datosTransaccion = ref(null)

// Descargar comprobante
const descargarComprobante = async () => {
  console.log('Descargando comprobante...')
  
  if (!datosTransaccion.value) {
    console.error('No hay datos de transacción disponibles')
    return
  }
  
  try {
    // Generar QR con los datos de la transacción
    const qrData = JSON.stringify({
      transaccion_id: datosTransaccion.value.transaccion_id,
      numero_factura: datosTransaccion.value.numero_factura,
      total: datosTransaccion.value.total,
      asientos: datosTransaccion.value.asientos
    })
    
    // Importar QRCode dinámicamente
    const QRCode = await import('qrcode')
    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      width: 200,
      margin: 2,
      color: {
        dark: '#1f2937',
        light: '#ffffff'
      }
    })
    
    // Crear contenido HTML del comprobante con estilo minimalista
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Comprobante de Compra - CINEMAX</title>
        <meta charset="UTF-8">
        <style>
          body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background: #f8fafc;
            min-height: 100vh;
            color: #1f2937;
          }
          .comprobante {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: #1f2937;
            color: white;
            text-align: center;
            padding: 32px 24px;
          }
          .header h1 {
            margin: 0;
            font-size: 2rem;
            font-weight: 700;
          }
          .header h2 {
            margin: 8px 0 0 0;
            font-size: 1rem;
            opacity: 0.9;
            font-weight: 400;
          }
          .content {
            padding: 32px 24px;
          }
          .section {
            margin-bottom: 24px;
            padding: 20px;
            background: #f8fafc;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
          }
          .section h3 {
            margin: 0 0 16px 0;
            color: #1f2937;
            font-size: 1.125rem;
            font-weight: 600;
          }
          .row {
            display: flex;
            justify-content: space-between;
            margin: 8px 0;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .row:last-child {
            border-bottom: none;
          }
          .label {
            font-weight: 500;
            color: #6b7280;
          }
          .value {
            color: #1f2937;
            font-weight: 500;
          }
          .total-section {
            background: #1f2937;
            color: white;
            padding: 24px;
            border-radius: 8px;
            margin-top: 24px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            margin: 8px 0;
            font-size: 1rem;
          }
          .total-final {
            font-size: 1.25rem;
            font-weight: 700;
            border-top: 2px solid rgba(255,255,255,0.2);
            padding-top: 16px;
            margin-top: 16px;
          }
          .qr-section {
            text-align: center;
            margin: 32px 0;
            padding: 24px;
            background: #f8fafc;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
          }
          .qr-code {
            margin: 20px auto;
            padding: 16px;
            background: white;
            border-radius: 8px;
            display: inline-block;
            border: 1px solid #e2e8f0;
          }
          .footer {
            text-align: center;
            padding: 24px;
            background: #f8fafc;
            color: #6b7280;
            font-size: 0.875rem;
            border-top: 1px solid #e2e8f0;
          }
          .asientos-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 8px;
          }
          .asiento-tag {
            background: #1f2937;
            color: white;
            padding: 4px 12px;
            border-radius: 16px;
            font-size: 0.875rem;
            font-weight: 500;
          }
          .estado-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 16px;
            font-weight: 600;
            font-size: 0.875rem;
          }
          .estado-confirmado {
            background: #10b981;
            color: white;
          }
          .estado-pendiente {
            background: #f59e0b;
            color: #1f2937;
          }
        </style>
      </head>
      <body>
        <div class="comprobante">
          <div class="header">
            <h1>CINEMAX</h1>
            <h2>Comprobante de Compra</h2>
          </div>
          
          <div class="content">
            <div class="section">
              <h3>Información de la Transacción</h3>
              <div class="row">
                <span class="label">Número de Factura:</span>
                <span class="value">${datosTransaccion.value.numero_factura}</span>
              </div>
              <div class="row">
                <span class="label">ID de Transacción:</span>
                <span class="value">${datosTransaccion.value.transaccion_id}</span>
              </div>
              <div class="row">
                <span class="label">Fecha de Compra:</span>
                <span class="value">${new Date(datosTransaccion.value.resumen.fecha).toLocaleString('es-CO')}</span>
              </div>
              <div class="row">
                <span class="label">Estado:</span>
                <span class="value">
                  <span class="estado-badge ${datosTransaccion.value.estado === 'confirmado' ? 'estado-confirmado' : 'estado-pendiente'}">
                    ${datosTransaccion.value.estado.toUpperCase()}
                  </span>
                </span>
              </div>
            </div>
            
            <div class="section">
              <h3>Detalles de la Función</h3>
              <div class="row">
                <span class="label">Película:</span>
                <span class="value">${pelicula.value.titulo}</span>
              </div>
              <div class="row">
                <span class="label">Fecha y Hora:</span>
                <span class="value">${funcion.value.fecha} - ${funcion.value.hora}</span>
              </div>
              <div class="row">
                <span class="label">Sala:</span>
                <span class="value">${funcion.value.sala_id || sala.value.nombre}</span>
              </div>
              <div class="row">
                <span class="label">Asientos:</span>
                <span class="value">
                  <div class="asientos-list">
                    ${datosTransaccion.value.asientos.map(asiento => `<span class="asiento-tag">${asiento}</span>`).join('')}
                  </div>
                </span>
              </div>
            </div>
            
            <div class="section">
              <h3>Información de Pago</h3>
              <div class="row">
                <span class="label">Método de Pago:</span>
                <span class="value">${datosTransaccion.value.resumen.metodo_pago.toUpperCase()}</span>
              </div>
              <div class="row">
                <span class="label">Código de Autorización:</span>
                <span class="value">${datosTransaccion.value.resultado_pago.codigo_autorizacion}</span>
              </div>
              <div class="row">
                <span class="label">Fecha de Procesamiento:</span>
                <span class="value">${new Date(datosTransaccion.value.resultado_pago.fecha_procesamiento).toLocaleString('es-PE')}</span>
              </div>
            </div>
            
            <div class="total-section">
              <div class="total-row">
                <span>Subtotal:</span>
                <span>S/ ${formatCurrency(datosTransaccion.value.resumen.subtotal)}</span>
              </div>
              <div class="total-row">
                <span>Descuentos:</span>
                <span>S/ ${formatCurrency(datosTransaccion.value.resumen.descuentos)}</span>
              </div>
              <div class="total-row">
                <span>Impuestos:</span>
                <span>S/ ${formatCurrency(datosTransaccion.value.resumen.impuestos)}</span>
              </div>
              <div class="total-row total-final">
                <span>TOTAL:</span>
                <span>S/ ${formatCurrency(datosTransaccion.value.total)}</span>
              </div>
            </div>
            
            <div class="qr-section">
              <h3>Código QR de Verificación</h3>
              <p>Escanea este código para verificar la autenticidad de tu comprobante</p>
              <div class="qr-code">
                <img src="${qrCodeDataURL}" alt="QR Code" style="width: 200px; height: 200px;">
              </div>
            </div>
          </div>
          
          <div class="footer">
            <p><strong>IMPORTANTE:</strong></p>
            <p>• Llega 15 minutos antes de la función</p>
            <p>• Presenta este comprobante en la entrada</p>
            <p>• No se permiten cambios ni devoluciones</p>
            <p>• Los asientos se liberan 5 minutos antes</p>
            <p style="margin-top: 20px; font-size: 0.75rem; color: #9ca3af;">
              CINEMAX - Sistema de Gestión de Entradas<br>
              ${new Date().toLocaleDateString('es-PE')}
            </p>
          </div>
        </div>
      </body>
      </html>
    `
    
    // Crear blob y descargar
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `comprobante-${datosTransaccion.value.numero_factura}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
  } catch (error) {
    console.error('Error generando comprobante:', error)
    alert('Error al generar el comprobante. Por favor, intenta de nuevo.')
  }
}

// Ir al inicio
const irAInicio = () => {
  router.push('/')
}

// Función para formatear moneda
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-PE', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

// Función para cargar datos de compra desde localStorage
const cargarDatosCompra = () => {
  if (process.client) {
    const funcionId = route.query.funcion
    console.log('Cargando datos para función:', funcionId)
    
    if (funcionId) {
      const datosGuardados = localStorage.getItem(`datos_compra_${funcionId}`)
      console.log('Datos guardados en localStorage:', datosGuardados)
      
      if (datosGuardados) {
        try {
          const datos = JSON.parse(datosGuardados)
          console.log('Datos de compra cargados:', datos)
          
          // Actualizar datos de la función
          if (datos.funcion) {
            funcion.value = {
              ...funcion.value,
              ...datos.funcion
            }
          }
          
          // Actualizar datos de la película
          if (datos.pelicula) {
            pelicula.value = {
              ...pelicula.value,
              ...datos.pelicula
            }
          }
          
          // Actualizar precio por asiento
          if (datos.precioPorAsiento) {
            // Convertir string a número si es necesario
            let precio = datos.precioPorAsiento
            if (typeof precio === 'string') {
              // Remover caracteres no numéricos y convertir
              precio = parseFloat(precio.replace(/[^\d]/g, ''))
            }
            precioPorAsiento.value = precio
            console.log('Precio por asiento actualizado:', precio)
          }
          
          // Actualizar asientos seleccionados en el store
          if (datos.asientos && Array.isArray(datos.asientos) && datos.asientos.length > 0) {
            // Convertir los asientos al formato esperado por el store
            const asientosFormateados = datos.asientos.map(asientoId => ({
              id: asientoId,
              fila: asientoId.charAt(0),
              numero: asientoId.substring(1),
              codigo: asientoId,
              disponible: true
            }))
            
            // Actualizar el store
            asientosSeleccionados.value = asientosFormateados
            console.log('Asientos formateados:', asientosFormateados)
            console.log('Store actualizado con', asientosFormateados.length, 'asientos')
          } else {
            console.log('No se encontraron asientos válidos en los datos')
            // Limpiar el store si no hay asientos
            asientosSeleccionados.value = []
          }
          
        } catch (error) {
          console.error('Error cargando datos de compra:', error)
          // En caso de error, limpiar el store
          asientosSeleccionados.value = []
        }
      } else {
        console.log('No se encontraron datos de compra para la función:', funcionId)
        // Limpiar el store si no hay datos
        asientosSeleccionados.value = []
      }
    } else {
      console.log('No se proporcionó ID de función en la URL')
      // Limpiar el store si no hay función
      asientosSeleccionados.value = []
    }
  }
}

// Cargar datos al montar el componente
onMounted(() => {
  console.log('=== PÁGINA COMPRA MONTADA ===')
  console.log('Query params:', route.query)
  console.log('Funcion ID:', route.query.funcion)
  
  // Asegurar que las variables estén inicializadas
  if (!pelicula.value) pelicula.value = { titulo: 'Película', id: '' }
  if (!funcion.value) funcion.value = { id: '', fecha: '', hora: '' }
  if (!sala.value) sala.value = { nombre: 'Sala', tipo: '2D' }
  
  cargarDatosCompra()
  
  // Esperar un momento para que se carguen los datos
  nextTick(() => {
    console.log('=== DESPUÉS DE CARGAR DATOS ===')
    console.log('Asientos seleccionados:', asientosSeleccionados.value)
    console.log('Cantidad de asientos:', asientosSeleccionados.value?.length || 0)
    console.log('Precio por asiento:', precioPorAsiento.value)
    console.log('Subtotal:', subtotal.value)
    console.log('Total:', totalPrecio.value)
  })
})
</script> 