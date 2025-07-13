<template>
  <div>
    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center min-h-screen">
      <UIcon name="heroicons:arrow-path" class="w-8 h-8 animate-spin text-purple-500" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="container mx-auto px-4 py-12 text-center">
      <UIcon name="heroicons:exclamation-triangle" class="w-12 h-12 text-red-500 mx-auto mb-4" />
      <p class="text-red-600 text-xl mb-4">{{ error }}</p>
      <UButton @click="cargarDatos" color="purple">
        Reintentar
      </UButton>
    </div>

    <!-- Contenido de la película -->
    <div v-else-if="pelicula" class="min-h-screen bg-gray-50">
      <!-- Hero Section -->
      <section class="relative h-[500px] overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-black/80 to-purple-900/80 z-10"></div>
        <img 
          :src="pelicula.poster_url || 'https://via.placeholder.com/1920x500/1f2937/ffffff?text=Sin+Imagen'" 
          :alt="pelicula.titulo"
          class="absolute inset-0 w-full h-full object-cover"
        />
        
        <div class="relative z-20 container mx-auto px-4 h-full flex items-center">
          <div class="max-w-4xl">
            <h1 class="text-4xl md:text-6xl font-bold text-white mb-4">{{ pelicula.titulo }}</h1>
            <p class="text-xl text-gray-200 mb-6 max-w-2xl">{{ pelicula.sinopsis }}</p>
            
            <div class="flex flex-wrap items-center gap-6 text-white mb-8">
              <div class="flex items-center space-x-2">
                <UIcon name="heroicons:clock" class="w-6 h-6" />
                <span>{{ pelicula.duracion_minutos }} min</span>
              </div>
              <div class="flex items-center space-x-2">
                <UIcon name="heroicons:calendar" class="w-6 h-6" />
                <span>{{ formatDate(pelicula.fecha_estreno) }}</span>
              </div>
              <div class="bg-purple-500 px-3 py-1 rounded-full text-sm font-semibold">
                {{ pelicula.clasificacion }}
              </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-4">
              <UButton 
                to="#funciones"
                color="purple"
                size="lg"
                class="text-lg px-8 py-4"
              >
                Ver Funciones
              </UButton>
              <UButton 
                v-if="pelicula.trailer_url"
                @click="reproducirTrailer"
                variant="outline"
                size="lg"
                class="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-gray-900"
              >
                Ver Trailer
              </UButton>
            </div>
          </div>
        </div>
      </section>

      <!-- Información detallada -->
      <section class="py-16 bg-white">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <!-- Información principal -->
            <div class="lg:col-span-2">
              <h2 class="text-3xl font-bold text-gray-900 mb-6">Sinopsis</h2>
              <p class="text-lg text-gray-600 leading-relaxed mb-8">{{ pelicula.sinopsis }}</p>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 class="text-xl font-semibold text-gray-900 mb-4">Detalles</h3>
                  <div class="space-y-3">
                    <div class="flex justify-between">
                      <span class="text-gray-600">Géneros:</span>
                      <span class="font-medium text-purple-600">{{ pelicula.generos.join(', ') }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Director:</span>
                      <span class="font-medium text-purple-600">{{ pelicula.director }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Duración:</span>
                      <span class="font-medium text-purple-600">{{ pelicula.duracion_minutos }} minutos</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Clasificación:</span>
                      <span class="font-medium text-purple-600">{{ pelicula.clasificacion }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Fecha de estreno:</span>
                      <span class="font-medium text-purple-600">{{ formatDate(pelicula.fecha_estreno) }}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 class="text-xl font-semibold text-gray-900 mb-4">Reparto Principal</h3>
                  <div class="space-y-2">
                    <div v-for="actor in pelicula.actores_principales" :key="actor" class="text-gray-600">
                      {{ actor }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Poster -->
            <div class="lg:col-span-1">
              <div class="sticky top-8">
                <img 
                  :src="pelicula.poster_url || 'https://via.placeholder.com/300x450/1f2937/ffffff?text=Sin+Imagen'" 
                  :alt="pelicula.titulo"
                  class="w-full rounded-xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Funciones -->
      <section id="funciones" class="py-16 bg-gray-50">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">Funciones Disponibles</h2>
          
          <div v-if="cargandoFunciones" class="flex justify-center py-12">
            <UIcon name="heroicons:arrow-path" class="w-8 h-8 animate-spin text-purple-500" />
          </div>

          <div v-else-if="errorFunciones" class="text-center py-12">
            <UIcon name="heroicons:exclamation-triangle" class="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p class="text-red-600">{{ errorFunciones }}</p>
          </div>

          <div v-else-if="funciones.length === 0" class="text-center py-12">
            <UIcon name="heroicons:calendar" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-500">No hay funciones disponibles para esta película</p>
          </div>

          <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div 
              v-for="funcion in funciones" 
              :key="funcion._id"
              class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <!-- Información de la función -->
              <div class="mb-6">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-xl font-semibold text-gray-900">{{ formatDateTime(funcion.fecha_hora_inicio) }}</h3>
                  <span 
                    :class="{
                      'text-green-600': funcion.estado === 'programada',
                      'text-red-600': funcion.estado === 'cancelada',
                      'text-yellow-600': funcion.estado === 'en_curso'
                    }"
                    class="text-sm font-medium capitalize px-3 py-1 rounded-full bg-gray-100"
                  >
                    {{ funcion.estado }}
                  </span>
                </div>
                
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Horario:</span>
                    <span class="font-medium text-purple-600">{{ formatTime(funcion.fecha_hora_inicio) }} - {{ formatTime(funcion.fecha_hora_fin) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Sala:</span>
                    <span class="font-medium text-purple-600">{{ funcion.sala.nombre }} ({{ funcion.sala.tipo.toUpperCase() }})</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Capacidad:</span>
                    <span class="font-medium text-purple-600">{{ funcion.sala.capacidad_total }} asientos</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Precio base:</span>
                    <span class="font-semibold text-purple-600">${{ formatPrice(funcion.precio_base) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Precio VIP:</span>
                    <span class="font-semibold text-purple-600">${{ formatPrice(funcion.precio_vip) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Idioma:</span>
                    <span class="font-medium text-purple-600">{{ funcion.idioma_audio }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Subtítulos:</span>
                    <span class="font-medium text-purple-600">{{ funcion.subtitulos ? 'Sí' : 'No' }}</span>
                  </div>
                </div>
              </div>

              <!-- Equipamiento de la sala -->
              <div class="mb-6">
                <h4 class="text-lg font-semibold text-gray-900 mb-3">Equipamiento de la Sala</h4>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="equipo in funcion.sala.equipamiento" 
                    :key="equipo"
                    class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                  >
                    {{ equipo }}
                  </span>
                </div>
              </div>

              <!-- Estadísticas -->
              <div class="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 class="text-lg font-semibold text-gray-900 mb-3">Estadísticas</h4>
                <div class="grid grid-cols-2 gap-4">
                  <div class="text-center">
                    <div class="text-2xl font-bold text-purple-600">{{ funcion.ventas_totales }}</div>
                    <div class="text-sm text-gray-600">Ventas</div>
                  </div>
                  <div class="text-center">
                    <div class="text-2xl font-bold text-green-600">${{ formatPrice(funcion.ingresos_totales) }}</div>
                    <div class="text-sm text-gray-600">Ingresos</div>
                  </div>
                </div>
              </div>

              <UButton 
                :to="`/funciones/${funcion._id}/asientos`"
                :disabled="funcion.estado !== 'programada'"
                color="purple"
                class="w-full"
              >
                {{ funcion.estado === 'programada' ? 'Seleccionar Asientos' : 'No Disponible' }}
              </UButton>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Modal del trailer -->
    <UModal v-model="trailerAbierto" :ui="{ width: 'sm:max-w-4xl' }">
      <div class="relative aspect-video">
        <iframe
          v-if="pelicula?.trailer_url"
          :src="pelicula.trailer_url"
          class="w-full h-full rounded-lg"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    </UModal>
  </div>
</template>

<script setup>
const route = useRoute()
const api = useApi()

// Estado
const loading = ref(true)
const error = ref(null)
const pelicula = ref(null)
const funciones = ref([])
const cargandoFunciones = ref(false)
const errorFunciones = ref(null)
const trailerAbierto = ref(false)

// Obtener ID de la película
const peliculaId = route.params.id

// Cargar datos de película y funciones
const cargarDatos = async () => {
  loading.value = true
  error.value = null
  
  try {
    // Cargar película y funciones usando el endpoint correcto
    const response = await api.getPeliculaConFunciones(peliculaId)
    
    if (response.success && response.data.pelicula) {
      pelicula.value = response.data.pelicula
      funciones.value = response.data.funciones || []
    } else {
      error.value = 'No se pudo cargar la información de la película'
    }
  } catch (err) {
    error.value = 'Error de conexión'
    console.error('Error cargando datos:', err)
  } finally {
    loading.value = false
  }
}

// Formatear fecha
const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Formatear fecha y hora
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

// Formatear hora
const formatTime = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Formatear precio
const formatPrice = (price) => {
  if (!price) return '0'
  return price.toLocaleString('es-CO')
}

// Reproducir trailer
const reproducirTrailer = () => {
  if (pelicula.value?.trailer_url) {
    trailerAbierto.value = true
  }
}

// Cargar datos al montar el componente
onMounted(async () => {
  await cargarDatos()
})
</script> 