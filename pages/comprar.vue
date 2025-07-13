<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <section class="bg-gradient-to-r from-purple-600 to-pink-600 py-8">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between text-white">
          <div>
            <h1 class="text-3xl font-bold mb-2">Completar Compra</h1>
            <p class="text-purple-100">Finaliza tu reserva de entradas</p>
          </div>
          <UButton 
            to="/peliculas"
            variant="outline"
            class="border-white text-white hover:bg-white hover:text-gray-900"
          >
            Cancelar
          </UButton>
        </div>
      </div>
    </section>

    <!-- Contenido -->
    <section class="py-12">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Formulario de Compra -->
          <div class="bg-white rounded-xl shadow-lg p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Datos del Cliente</h2>
            
            <form @submit.prevent="procesarCompra" class="space-y-6">
              <!-- Información Personal -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UFormGroup label="Nombre" required>
                  <UInput
                    v-model="formulario.nombre"
                    placeholder="Tu nombre completo"
                    required
                  />
                </UFormGroup>
                
                <UFormGroup label="Email" required>
                  <UInput
                    v-model="formulario.email"
                    type="email"
                    placeholder="tu@email.com"
                    required
                  />
                </UFormGroup>
              </div>

              <UFormGroup label="Teléfono">
                <UInput
                  v-model="formulario.telefono"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                />
              </UFormGroup>

              <!-- Método de Pago -->
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Método de Pago</h3>
                <div class="space-y-3">
                  <label class="flex items-center space-x-3 cursor-pointer">
                    <input
                      v-model="formulario.metodoPago"
                      type="radio"
                      value="tarjeta"
                      class="text-purple-600"
                    />
                    <span>Tarjeta de Crédito/Débito</span>
                  </label>
                  <label class="flex items-center space-x-3 cursor-pointer">
                    <input
                      v-model="formulario.metodoPago"
                      type="radio"
                      value="paypal"
                      class="text-purple-600"
                    />
                    <span>PayPal</span>
                  </label>
                  <label class="flex items-center space-x-3 cursor-pointer">
                    <input
                      v-model="formulario.metodoPago"
                      type="radio"
                      value="efectivo"
                      class="text-purple-600"
                    />
                    <span>Efectivo en Taquilla</span>
                  </label>
                </div>
              </div>

              <!-- Información de Tarjeta (si aplica) -->
              <div v-if="formulario.metodoPago === 'tarjeta'" class="space-y-4">
                <UFormGroup label="Número de Tarjeta" required>
                  <UInput
                    v-model="formulario.numeroTarjeta"
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </UFormGroup>
                
                <div class="grid grid-cols-2 gap-4">
                  <UFormGroup label="Fecha de Vencimiento" required>
                    <UInput
                      v-model="formulario.fechaVencimiento"
                      placeholder="MM/YY"
                      required
                    />
                  </UFormGroup>
                  
                  <UFormGroup label="CVV" required>
                    <UInput
                      v-model="formulario.cvv"
                      placeholder="123"
                      type="password"
                      required
                    />
                  </UFormGroup>
                </div>
              </div>

              <!-- Términos y Condiciones -->
              <div class="flex items-start space-x-3">
                <input
                  v-model="formulario.aceptaTerminos"
                  type="checkbox"
                  class="mt-1 text-purple-600"
                  required
                />
                <span class="text-sm text-gray-600">
                  Acepto los 
                  <a href="#" class="text-purple-600 hover:underline">términos y condiciones</a>
                  y la 
                  <a href="#" class="text-purple-600 hover:underline">política de privacidad</a>
                </span>
              </div>

              <!-- Botón de Compra -->
              <UButton
                type="submit"
                :loading="procesando"
                :disabled="!formularioValido"
                color="purple"
                size="lg"
                class="w-full"
              >
                {{ procesando ? 'Procesando...' : `Pagar $${totalPrecio}` }}
              </UButton>
            </form>
          </div>

          <!-- Resumen de Compra -->
          <div class="bg-white rounded-xl shadow-lg p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Resumen de Compra</h2>
            
            <!-- Información de la Función -->
            <div class="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 class="font-semibold text-gray-900 mb-2">{{ pelicula?.titulo }}</h3>
              <div class="space-y-1 text-sm text-gray-600">
                <div class="flex justify-between">
                  <span>Fecha:</span>
                  <span>{{ funcion?.fecha }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Hora:</span>
                  <span>{{ funcion?.hora }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Sala:</span>
                  <span>{{ sala?.nombre }}</span>
                </div>
              </div>
            </div>

            <!-- Asientos Seleccionados -->
            <div class="mb-6">
              <h3 class="font-semibold text-gray-900 mb-3">Asientos Seleccionados</h3>
              <div class="space-y-2">
                <div 
                  v-for="asiento in asientosSeleccionados" 
                  :key="asiento.id"
                  class="flex items-center justify-between bg-gray-50 p-3 rounded"
                >
                  <span class="font-medium">{{ asiento.fila }}{{ asiento.numero }}</span>
                  <span class="text-purple-600 font-semibold">${{ precioPorAsiento }}</span>
                </div>
              </div>
            </div>

            <!-- Desglose de Precios -->
            <div class="border-t pt-4">
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600">Subtotal:</span>
                  <span>${{ subtotal }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Servicio:</span>
                  <span>${{ cargoServicio }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">IVA:</span>
                  <span>${{ iva }}</span>
                </div>
                <div class="border-t pt-2">
                  <div class="flex justify-between">
                    <span class="font-bold text-lg">Total:</span>
                    <span class="font-bold text-lg text-purple-600">${{ totalPrecio }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Información Adicional -->
            <div class="mt-6 p-4 bg-blue-50 rounded-lg">
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
    <UModal v-model="confirmacionAbierta" :ui="{ width: 'sm:max-w-md' }">
      <UCard>
        <template #header>
          <div class="text-center">
            <UIcon name="heroicons:check-circle" class="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 class="text-xl font-semibold text-gray-900">¡Compra Exitosa!</h3>
          </div>
        </template>

        <div class="text-center space-y-4">
          <p class="text-gray-600">
            Tu compra ha sido procesada correctamente. Recibirás un email con los detalles de tu reserva.
          </p>
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="font-semibold text-gray-900">Número de Reserva:</p>
            <p class="text-purple-600 font-mono text-lg">{{ numeroReserva }}</p>
          </div>
        </div>

        <template #footer>
          <div class="flex gap-3">
            <UButton @click="descargarComprobante" color="purple" class="flex-1">
              Descargar Comprobante
            </UButton>
            <UButton @click="irAInicio" variant="outline" class="flex-1">
              Ir al Inicio
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
import { useCineStore } from '~/stores/cine'

const route = useRoute()
const router = useRouter()
const api = useApi()
const cineStore = useCineStore()
const { asientosSeleccionados, limpiarAsientosSeleccionados } = cineStore

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
  id: route.query.funcion_id,
  fecha: '2024-12-20',
  hora: '20:00'
})

const sala = ref({
  nombre: 'Sala 1',
  tipo: '2D'
})

const precioPorAsiento = ref(12.50)
const cargoServicio = ref(2.00)

// Formulario
const formulario = ref({
  nombre: '',
  email: '',
  telefono: '',
  metodoPago: 'tarjeta',
  numeroTarjeta: '',
  fechaVencimiento: '',
  cvv: '',
  aceptaTerminos: false
})

// Computed
const subtotal = computed(() => {
  return asientosSeleccionados.value.length * precioPorAsiento.value
})

const iva = computed(() => {
  return subtotal.value * 0.16 // 16% IVA
})

const totalPrecio = computed(() => {
  return subtotal.value + cargoServicio.value + iva.value
})

const formularioValido = computed(() => {
  return formulario.value.nombre && 
         formulario.value.email && 
         formulario.value.metodoPago && 
         formulario.value.aceptaTerminos &&
         asientosSeleccionados.value.length > 0
})

// Procesar compra
const procesarCompra = async () => {
  if (!formularioValido.value) return
  
  procesando.value = true
  
  try {
    // Simular proceso de compra
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generar número de reserva
    numeroReserva.value = 'RES-' + Date.now().toString().slice(-8)
    
    // Mostrar confirmación
    confirmacionAbierta.value = true
    
    // Limpiar carrito
    limpiarAsientosSeleccionados()
    
  } catch (error) {
    console.error('Error procesando compra:', error)
  } finally {
    procesando.value = false
  }
}

// Descargar comprobante
const descargarComprobante = () => {
  // Implementar descarga de comprobante
  console.log('Descargando comprobante...')
}

// Ir al inicio
const irAInicio = () => {
  router.push('/')
}

// Cargar datos de la URL
onMounted(() => {
  const asientosIds = route.query.asientos?.split(',') || []
  // Aquí podrías cargar los datos de la función y película basado en los IDs
})
</script> 